import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState, RentStatusBadge } from "./Components";
import { PLACEHOLDER_CURRENT_STAY, PLACEHOLDER_MY_OFFERS, PLACEHOLDER_SAVED, PLACEHOLDER_MESSAGES } from "./Placeholders";
import type { SavedListing } from "./Types";
import { formatDate, daysUntil, statusColor } from "./Utils";

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

  // TODO: fetch saved listings from GET /favorites, replace placeholder
  // TODO: add loading and error state for saved listings
  const [saved, setSaved] = useState<SavedListing[]>(PLACEHOLDER_SAVED); // TODO: seed from GET /favorites

  // TODO: fetch current stay from GET /stays/current, replace placeholder
  // TODO: add loading and error state for current stay
  // TODO: handle case where user has no active stay
  const stay = PLACEHOLDER_CURRENT_STAY;

  const handleRemoveSaved = (id: number) => {
    setSaved((prev) => prev.filter((s) => s.id !== id));
    // TODO: DELETE /favorites/:id
    // TODO: revert optimistic removal and show error toast if request fails
  };

  return (
    <div className="grid grid-cols-2 gap-4">

      {/* Current Stay */}
      <Tile>
        <TileHeader title="Current Stay" />
        {/* TODO: show skeleton loader while stay is fetching */}
        {/* TODO: show empty state if no active stay */}
        <div className="flex-1 overflow-y-auto pr-1">
          <Card className="p-3">
            <p className="font-semibold text-xs text-foreground">{stay.title}</p>
            <p className="text-xs text-foreground/40 mt-0.5">{stay.address}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {/* TODO: verify rentPaid shape matches RentStatusBadge's prop type */}
              <RentStatusBadge paid={stay.rentPaid} />
              {/* TODO: guard against null nextDueDate before calling formatDate */}
              <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50 inline-flex items-center leading-none">
                Due {formatDate(stay.nextDueDate)}
              </span>
              {/* TODO: guard against null endDate before calling daysUntil */}
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
        {/* TODO: fetch messages from GET /messages/inbox, replace placeholder */}
        {/* TODO: add loading and error state for messages */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {PLACEHOLDER_MESSAGES.length === 0 ? (
            <EmptyState message="No messages yet" />
          ) : PLACEHOLDER_MESSAGES.map((msg) => (
            <div
              key={msg.id}
              // TODO: add onClick to navigate to thread or open message modal
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

      {/* Saved Listings */}
      <Tile>
        <TileHeader title="Saved Listings" />
        {/* TODO: show skeleton loader while saved listings are fetching */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {saved.length === 0 ? (
            <EmptyState message="No saved listings" />
          ) : saved.map((listing) => (
            <Card key={listing.id} className="p-3 flex items-start justify-between gap-2">
              {/* TODO: confirm /listings/:id route exists in router */}
              <div className="flex-1 cursor-pointer min-w-0" onClick={() => navigate(`/listings/${listing.id}`)}>
                <p className="font-semibold text-xs text-foreground truncate">{listing.title}</p>
                <p className="text-xs text-foreground/40 mt-0.5 truncate">{listing.address}</p>
                <p className="mt-1 text-xs font-semibold text-foreground">
                  ${listing.monthlyRent}<span className="font-normal text-foreground/40">/mo</span>
                </p>
              </div>
              <button
                onClick={() => handleRemoveSaved(listing.id)}
                className="shrink-0 rounded-full border border-red-200 px-2.5 py-1 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </Card>
          ))}
        </div>
      </Tile>

      {/* My Offers */}
      <Tile>
        <TileHeader title="My Offers" />
        {/* TODO: fetch offers from GET /offers?offeredBy=me, replace placeholder */}
        {/* TODO: add loading and error state for offers */}
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
                {/* TODO: guard against null offeredAt before calling formatDate */}
                <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                  {formatDate(offer.offeredAt)}
                </span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(offer.status)}`}>
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>
              {/* TODO: add withdraw/cancel action for pending offers */}
            </Card>
          ))}
        </div>
      </Tile>

    </div>
  );
}