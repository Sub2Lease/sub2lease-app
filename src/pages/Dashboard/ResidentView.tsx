import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState } from "./Components";
import { formatDate, daysUntil, statusColor } from "./Utils";
import { useFavorites } from "@/shared/hooks";
import { OfferModal } from "@/widgets/widget/OfferModal";
import { backendHooks } from "@/shared/api/backendGO/hooks";
import { cancelOffer } from "@/shared/api/backendGO/endpoints";
import { MessagesSection } from "./MessagesSection";

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

export function ResidentView() {
  const navigate = useNavigate();
  const { posts, isLoading: savedLoading, isError: savedError, toggle } = useFavorites();
  const activePosts = posts.filter((p) => p.status !== "subleased");
  const { data: myOffers = [], isLoading: offersLoading, isError: offersError, refetch: refetchOffers } = backendHooks.useMyOffers();
  const currentStays = useMemo(
    () => myOffers.filter((o) => o.status === "accepted"),
    [myOffers]
  );

  const [offerPost, setOfferPost] = useState<{
    id: number;
    title: string;
    monthly_rent: string;
    start_date: string;
    end_date: string;
  } | null>(null);

  // Map of postId -> offerId for locally tracked pending offers
  const [localPendingIds, setLocalPendingIds] = useState<Map<number, number>>(new Map());

  const serverPendingIds = useMemo(
    () => new Map(
      myOffers
        .filter((o) => o.status === "pending")
        .flatMap((o) => {
          const postId = o.post_id?.Int64;
          if (postId === undefined) return [];
          return [[postId, o.id]] as [number, number][];
        })
    ),
    [myOffers]
  );

  const pendingOfferIds = useMemo(
    () => new Map([...serverPendingIds, ...localPendingIds]),
    [serverPendingIds, localPendingIds]
  );

  const handleCancelOffer = async (postId: number) => {
    const offerId = pendingOfferIds.get(postId);
    if (!offerId) return;

    // Optimistic removal
    setLocalPendingIds((prev) => {
      const next = new Map(prev);
      next.delete(postId);
      return next;
    });

    try {
      await cancelOffer(offerId);
      refetchOffers();
    } catch {
      // Revert on failure
      setLocalPendingIds((prev) => new Map([...prev, [postId, offerId]]));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Current Stay */}
      <Tile>
        <TileHeader title="Current Stay" />
        {offersLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-foreground/30">Loading...</p>
          </div>
        ) : currentStays.length === 0 ? (
          <EmptyState message="No active stay" />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {currentStays.map((stay) => (
              <Card key={stay.id} className="p-3">
                <p className="font-semibold text-xs text-foreground">{stay.title}</p>
                <p className="text-xs text-foreground/40 mt-0.5">
                  {stay.address}, {stay.city}, {stay.state}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                    ${Math.round(parseFloat(stay.amount))}/mo
                  </span>
                  {stay.start_date && (
                    <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                      {formatDate(stay.start_date)} → {formatDate(stay.end_date ?? "")}
                    </span>
                  )}
                  {stay.end_date && (
                    <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                      {daysUntil(stay.end_date)}d left
                    </span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Tile>

      {/* Messages */}
      <Tile>
        <div className="flex-1 overflow-y-auto pr-1">
          <MessagesSection />
        </div>
      </Tile>

      {/* Liked Posts */}
      <Tile>
      <TileHeader title="Liked Posts" />
      {savedLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-foreground/30">Loading...</p>
        </div>
      ) : savedError ? (
        <EmptyState message="Could not load liked posts" />
      ) : activePosts.length === 0 ? (
        <EmptyState message="No liked posts yet" />
      ) : (
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {activePosts.map((post) => (
              <Card key={post.id} className="p-3 flex items-start justify-between gap-2">
                <div
                  className="flex-1 cursor-pointer min-w-0"
                  onClick={() => navigate(`/listings/${post.id}`)}
                >
                  <p className="font-semibold text-xs text-foreground truncate">{post.title}</p>
                  <p className="text-xs text-foreground/40 mt-0.5 truncate">
                    {post.address}, {post.city}, {post.state}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-foreground">
                    ${Math.round(parseFloat(post.monthly_rent))}
                    <span className="font-normal text-foreground/40">/mo</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  {pendingOfferIds.has(post.id) ? (
                    <button
                      onClick={() => handleCancelOffer(post.id)}
                      className="rounded-full border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Cancel Offer
                    </button>
                  ) : (
                    <button
                      onClick={() => toggle(post.id)}
                      className="rounded-full border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (!pendingOfferIds.has(post.id)) {
                        setOfferPost({
                          id: post.id,
                          title: post.title,
                          monthly_rent: post.monthly_rent,
                          start_date: post.start_date,
                          end_date: post.end_date,
                        });
                      }
                    }}
                    disabled={pendingOfferIds.has(post.id)}
                    className={`rounded-full px-2.5 py-1 text-xs font-medium transition-opacity ${
                      pendingOfferIds.has(post.id)
                        ? "bg-amber-50 text-amber-600 border border-amber-200 cursor-default"
                        : "bg-foreground text-background hover:opacity-80"
                    }`}
                  >
                    {pendingOfferIds.has(post.id) ? "Pending" : "Offer"}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Tile>

      {/* My Offers */}
      <Tile>
        <TileHeader title="My Offers" />
        {offersLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-xs text-foreground/30">Loading...</p>
          </div>
        ) : offersError ? (
          <EmptyState message="Could not load offers" />
        ) : myOffers.length === 0 ? (
          <EmptyState message="No offers sent yet" />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {myOffers.map((offer) => (
              <Card key={offer.id} className="p-3">
                <p className="font-semibold text-xs text-foreground">{offer.title}</p>
                <p className="text-xs text-foreground/40 mt-0.5">
                  {offer.address}, {offer.city}, {offer.state}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                    ${Math.round(parseFloat(offer.amount))}/mo
                  </span>
                  {offer.start_date && (
                    <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                      {formatDate(offer.start_date)} → {formatDate(offer.end_date ?? "")}
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(offer.status)}`}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </span>
                </div>
                {offer.message?.Valid && (
                  <p className="mt-2 text-xs text-foreground/50 italic border-t border-foreground/8 pt-2">
                    "{offer.message.String}"
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </Tile>

      {/* Offer Modal */}
      {offerPost && (
        <OfferModal
          postId={offerPost.id}
          postTitle={offerPost.title}
          monthlyRent={offerPost.monthly_rent}
          availableFrom={offerPost.start_date}
          availableTo={offerPost.end_date}
          onClose={() => setOfferPost(null)}
          onSuccess={(offerId) => {
            setLocalPendingIds((prev) => new Map([...prev, [offerPost.id, offerId]]));
            setOfferPost(null);
            refetchOffers();
          }}
        />
      )}

    </div>
  );
}