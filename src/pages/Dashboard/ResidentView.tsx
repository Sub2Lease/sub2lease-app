import { useNavigate } from "react-router-dom";
import { Card, EmptyState, RentStatusBadge } from "./Components";
import { PLACEHOLDER_CURRENT_STAY, PLACEHOLDER_MY_OFFERS, PLACEHOLDER_MESSAGES } from "./Placeholders";
import { formatDate, daysUntil, statusColor } from "./Utils";
import { useFavorites } from "@/shared/hooks";

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
  const stay = PLACEHOLDER_CURRENT_STAY;

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
                <button
                  onClick={() => toggle(post.id)}
                  className="shrink-0 rounded-full border border-red-200 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </Card>
            ))}
          </div>
        )}
      </Tile>

      {/* My Offers */}
      <Tile>
        <TileHeader title="My Offers" />
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {PLACEHOLDER_MY_OFFERS.length === 0 ? (
            <EmptyState message="No offers sent yet" />
          ) : PLACEHOLDER_MY_OFFERS.map((offer) => (
            <Card key={offer.id} className="p-3">
              <p className="font-semibold text-xs text-foreground">{offer.listingTitle}</p>
              <p className="text-xs text-foreground/40 mt-0.5">{offer.listingAddress}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {offer.amount && (
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                    ${offer.amount}/mo
                  </span>
                )}
                <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                  {formatDate(offer.offeredAt)}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(offer.status)}`}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
            </Card>
          ))}
        </div>
      </Tile>

    </div>
  );
}