import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Card, EmptyState } from "./Components";
import type { MyListing } from "./Types";
import { formatDate, daysUntil, statusColor } from "./Utils";
import { backendHooks } from "@/shared/api/backendGO/hooks";
import { updateOfferStatus } from "@/shared/api/backendGO/endpoints";

function getUserIdFromToken(): number | null {
  try {
    const raw = localStorage.getItem("auth");
    const token = raw
      ? (JSON.parse(raw) as { state?: { token?: string } })?.state?.token ?? null
      : null;
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return typeof payload.user_id === "number" ? payload.user_id : null;
  } catch {
    return null;
  }
}

function TileHeader({ title }: { title: string }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wide text-foreground/40 mb-3 shrink-0">
      {title}
    </p>
  );
}

function Tile({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-foreground/10 bg-white p-4 h-96 flex flex-col overflow-hidden">
      {children}
    </div>
  );
}

function OffersReceivedForPost({ postId }: { postId: number }) {
  const { data: offers = [], isLoading, isError, refetch } = backendHooks.useOffersByPost({ id: postId });
  const [localStatuses, setLocalStatuses] = useState<Map<number, string>>(new Map());
  const queryClient = useQueryClient();

  const handleStatus = async (offerId: number, status: "accepted" | "declined") => {
    setLocalStatuses((prev) => new Map([...prev, [offerId, status]]));
    try {
      await updateOfferStatus(offerId, status);
      refetch();
      if (status === "accepted") {
        queryClient.invalidateQueries({ queryKey: ["usePostsByUser"] });
        queryClient.invalidateQueries({ queryKey: ["useActivePosts"] });
      }
    } catch {
      setLocalStatuses((prev) => {
        const next = new Map(prev);
        next.delete(offerId);
        return next;
      });
    }
  };

  if (isLoading) return <p className="text-xs text-foreground/30 py-1">Loading offers...</p>;
  if (isError) return <p className="text-xs text-red-400 py-1">Failed to load offers</p>;
  if (offers.length === 0) return (
    <p className="text-xs text-foreground/30 pt-2">No offers yet</p>
  );

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {offers.map((offer) => {
        const status = localStatuses.get(offer.id) ?? offer.status;
        return (
          <div key={offer.id} className="rounded-xl border border-foreground/8 bg-foreground/3 p-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                  {offer.first_name?.charAt(0) ?? "?"}
                </div>
                <span className="text-xs text-foreground/60 truncate">
                  {offer.first_name} {offer.last_name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {offer.amount && (
                  <span className="text-xs font-semibold text-foreground">
                    ${Math.round(parseFloat(offer.amount))}/mo
                  </span>
                )}
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
            {offer.start_date && (
              <p className="mt-1 text-xs text-foreground/40">
                {formatDate(offer.start_date)} → {formatDate(offer.end_date ?? "")}
              </p>
            )}
            {offer.message?.Valid && (
              <p className="mt-1.5 text-xs text-foreground/50 italic border-t border-foreground/8 pt-1.5">
                "{offer.message.String}"
              </p>
            )}
            {status === "pending" && (
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => handleStatus(offer.id, "accepted")}
                  className="flex-1 rounded-full bg-foreground py-1 text-xs font-medium text-background hover:opacity-80 transition-opacity"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleStatus(offer.id, "declined")}
                  className="flex-1 rounded-full border border-foreground/20 py-1 text-xs font-medium text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function RenterView() {
  const navigate = useNavigate();
  const userId = getUserIdFromToken();

  const {
    data: posts = [],
    isLoading: listingsLoading,
    isError: listingsError,
  } = backendHooks.usePostsByUser({
    user_id: userId ?? 0,
    page_id: 1,
    page_size: 100,
  });

  const listings: MyListing[] = posts.map((p) => ({
    id: p.id,
    title: p.title,
    address: `${p.address}, ${p.city}, ${p.state}`,
    status: p.status === "subleased" ? "subleased" : "market",
    endDate: p.end_date,
    likes: 0,
    clicks: 0,
  }));

  const subleased = listings.filter((l) => l.status === "subleased");
  const onMarket = listings.filter((l) => l.status === "market");

  const [expandedOfferId, setExpandedOfferId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* My Listings */}
      <Tile>
        <TileHeader title="My Listings" />
        {listingsLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-foreground/30">Loading...</p>
          </div>
        ) : listingsError ? (
          <EmptyState message="Could not load listings" />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1">
            {/* Subleased */}
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-2">Subleased</p>
              {subleased.length === 0 ? (
                <EmptyState message="None" />
              ) : subleased.map((l) => (
                <Card key={l.id} className="mb-2 p-3">
                  <div onClick={() => navigate(`/listings/${l.id}`)} className="cursor-pointer">
                    <p className="font-semibold text-xs text-foreground">{l.title}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">{l.address}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {l.endDate && (
                        <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                          {daysUntil(l.endDate)}d left
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            {/* On Market */}
            <div>
              <p className="text-xs font-medium text-foreground/50 mb-2">On Market</p>
              {onMarket.length === 0 ? (
                <EmptyState message="None" />
              ) : onMarket.map((l) => (
                <Card key={l.id} className="mb-2 p-3">
                  <div onClick={() => navigate(`/listings/${l.id}`)} className="flex items-start justify-between gap-2 cursor-pointer">
                    <div className="flex-1">
                      <p className="font-semibold text-xs text-foreground">{l.title}</p>
                      <p className="text-xs text-foreground/40 mt-0.5">{l.address}</p>
                      {l.endDate && (
                        <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50 mt-2 inline-block">
                          {formatDate(l.endDate)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/listings/${l.id}/edit`);
                      }}
                      className="rounded-full border border-foreground/20 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-foreground/5 transition-colors shrink-0"
                    >
                      Edit
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Tile>

      {/* Messages */}
      <Tile>
        <TileHeader title="Messages" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-foreground/30">Coming soon</p>
        </div>
      </Tile>

      {/* Open House */}
      <Tile>
        <TileHeader title="Open House" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-foreground/30">Coming soon</p>
        </div>
      </Tile>

      {/* Offers Received */}
      <Tile>
        <TileHeader title="Offers Received" />
        {listingsLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-foreground/30">Loading...</p>
          </div>
        ) : onMarket.length === 0 && subleased.length === 0 ? (
          <EmptyState message="No listings yet" />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {listings.map((listing) => (
              <Card key={listing.id} className="p-3">
                <button
                  onClick={() => setExpandedOfferId(
                    expandedOfferId === listing.id ? null : listing.id
                  )}
                  className="w-full flex items-center justify-between gap-2 text-left"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-foreground truncate">{listing.title}</p>
                    <p className="text-xs text-foreground/40 mt-0.5 truncate">{listing.address}</p>
                  </div>
                  <span className="text-xs text-foreground/30 shrink-0">
                    {expandedOfferId === listing.id ? "▲" : "▼"}
                  </span>
                </button>
                {expandedOfferId === listing.id && (
                  <OffersReceivedForPost postId={listing.id} />
                )}
              </Card>
            ))}
          </div>
        )}
      </Tile>

    </div>
  );
}