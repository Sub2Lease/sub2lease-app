import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState, RentStatusBadge } from "./Components";
import { PLACEHOLDER_CURRENT_STAY } from "./Placeholders";
import { formatDate, daysUntil, statusColor } from "./Utils";
import { useFavorites } from "@/shared/hooks";
import { OfferModal } from "@/widgets/widget/OfferModal";
import { backendHooks } from "@/shared/api/backendGO/hooks";

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
  const { data: myOffers = [], isLoading: offersLoading, isError: offersError } = backendHooks.useMyOffers();
  const stay = PLACEHOLDER_CURRENT_STAY;

  const [offerPost, setOfferPost] = useState<{
    id: number;
    title: string;
    monthly_rent: string;
  } | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Current Stay */}
      <Tile>
        <TileHeader title="Current Stay" />
        <div className="flex-1 overflow-y-auto pr-1">
          <Card className="p-3">
            <p className="font-semibold text-xs text-foreground">{stay.title}</p>
            <p className="text-xs text-foreground/40 mt-0.5">{stay.address}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RentStatusBadge paid={stay.rentPaid} />
              <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50 inline-flex items-center leading-none">
                Due {formatDate(stay.nextDueDate)}
              </span>
              <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50 inline-flex items-center leading-none">
                {daysUntil(stay.endDate)}d left
              </span>
            </div>
          </Card>
        </div>
      </Tile>

      {/* Messages */}
      <Tile>
        <TileHeader title="Messages" />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xs text-foreground/30">Coming soon</p>
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
        ) : posts.length === 0 ? (
          <EmptyState message="No liked posts yet" />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {posts.map((post) => (
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
                    ${post.monthly_rent}
                    <span className="font-normal text-foreground/40">/mo</span>
                  </p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => toggle(post.id)}
                    className="rounded-full border border-red-200 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Remove
                  </button>
                  <button
                    onClick={() => setOfferPost({
                      id: post.id,
                      title: post.title,
                      monthly_rent: post.monthly_rent,
                    })}
                    className="rounded-full bg-foreground px-2.5 py-1 text-xs font-medium text-background hover:opacity-80 transition-opacity"
                  >
                    Offer
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
                      {formatDate(offer.start_date)} → {formatDate(offer.end_date)}
                    </span>
                  )}
                  {offer.message?.Valid && (
                    <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50 truncate max-w-[140px]">
                      "{offer.message.String}"
                    </span>
                  )}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(offer.status)}`}>
                    {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                  </span>
                </div>
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
          onClose={() => setOfferPost(null)}
          onSuccess={() => setOfferPost(null)}
        />
      )}

    </div>
  );
}