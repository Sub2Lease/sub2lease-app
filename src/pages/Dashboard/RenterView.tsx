import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState, RentStatusBadge } from "./Components";
import { PLACEHOLDER_OFFERS_RECEIVED } from "./Placeholders";
import type { MyListing, Offer } from "./Types";
import { formatDate, daysUntil, statusColor } from "./Utils";
import { backendHooks } from "@/shared/api/backendGO/hooks";

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

  const [offers, setOffers] = useState<Offer[]>(PLACEHOLDER_OFFERS_RECEIVED);

  const handleOffer = (id: number, action: "accepted" | "declined") => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: action } : o)));
    // TODO: PATCH /offers/:id/status — { status: action }
    // TODO: revert optimistic update and show error toast if request fails
  };

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
                  <p className="font-semibold text-xs text-foreground">{l.title}</p>
                  <p className="text-xs text-foreground/40 mt-0.5">{l.address}</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {l.rentPaid != null && <RentStatusBadge paid={l.rentPaid} />}
                    {l.nextPayDate && (
                      <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                        {formatDate(l.nextPayDate)}
                      </span>
                    )}
                    {l.endDate && (
                      <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                        {daysUntil(l.endDate)}d left
                      </span>
                    )}
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
                <Card key={l.id} className="mb-2 p-3 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-foreground">{l.title}</p>
                    <p className="text-xs text-foreground/40 mt-0.5">{l.address}</p>
                    <div className="mt-2 flex gap-1.5">
                      <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                        ♥ {l.likes ?? 0}
                      </span>
                      <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                        👁 {l.clicks ?? 0}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/listings/${l.id}/edit`)}
                    className="rounded-full border border-foreground/20 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-foreground/5 transition-colors shrink-0"
                  >
                    Edit
                  </button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Tile>

      {/* Messages */}
      {/* <Tile>
        <TileHeader title="Messages" />
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {PLACEHOLDER_MESSAGES.length === 0 ? (
            <EmptyState message="No messages yet" />
          ) : PLACEHOLDER_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start gap-2 rounded-xl border border-foreground/8 bg-foreground/3 p-3 cursor-pointer hover:bg-foreground/5 transition-colors"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                {msg.from.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-xs ${msg.unread ? "font-semibold text-foreground" : "font-medium text-foreground/60"}`}>
                    {msg.from}
                  </p>
                  <span className="text-xs text-foreground/30 shrink-0">{msg.time}</span>
                </div>
                <p className="text-xs text-foreground/40 truncate mt-0.5">{msg.preview}</p>
              </div>
              {msg.unread && <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />}
            </div>
          ))}
        </div>
      </Tile> */}
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

      {/* Offers */}
      <Tile>
        <TileHeader title="Offers Received" />
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {offers.length === 0 ? (
            <EmptyState message="No offers yet" />
          ) : offers.map((offer) => (
            <Card key={offer.id} className="p-3">
              <p className="font-semibold text-xs text-foreground">{offer.listingTitle}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground shrink-0">
                  {offer.offererName.charAt(0)}
                </div>
                <p className="text-xs text-foreground/60">{offer.offererName}</p>
                <p className="text-xs text-foreground/40">· {offer.offererEmail}</p>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                {offer.amount && (
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                    ${offer.amount}/mo
                  </span>
                )}
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(offer.status)}`}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
              {offer.status === "pending" && (
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleOffer(offer.id, "accepted")}
                    className="flex-1 rounded-full bg-foreground py-1 text-xs font-medium text-background hover:opacity-80 transition-opacity"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleOffer(offer.id, "declined")}
                    className="flex-1 rounded-full border border-foreground/20 py-1 text-xs font-medium text-foreground hover:bg-foreground/5 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Tile>

    </div>
  );
}