import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState, RentStatusBadge, SectionHeader } from "./Components";
import { MessagesSection } from "./MessagesSection";
import { PLACEHOLDER_CURRENT_STAY, PLACEHOLDER_MY_OFFERS, PLACEHOLDER_SAVED } from "./Placeholders";
import type { SavedListing } from "./Types";
import { formatDate, daysUntil, statusColor } from "./Utils";

export function ResidentView() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<SavedListing[]>(PLACEHOLDER_SAVED);
  const stay = PLACEHOLDER_CURRENT_STAY;

  const handleRemoveSaved = (id: number) => {
    setSaved((prev) => prev.filter((s) => s.id !== id));
    // TODO: call DELETE /favorites with post_id
  };

  return (
    <div className="flex flex-col gap-8">

      {/* Current Stay */}
      <section>
        <SectionHeader title="Current Stay" />
        <Card>
          <p className="font-semibold text-sm text-foreground">{stay.title}</p>
          <p className="text-xs text-foreground/50 mt-0.5">{stay.address}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <RentStatusBadge paid={stay.rentPaid} />
            <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
              Due: {formatDate(stay.nextDueDate)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
              {daysUntil(stay.endDate)} days left
            </span>
          </div>
        </Card>
      </section>

      {/* My Offers */}
      <section>
        <SectionHeader title="My Offers" count={PLACEHOLDER_MY_OFFERS.length} />
        {PLACEHOLDER_MY_OFFERS.length === 0 ? (
          <EmptyState message="You haven't sent any offers yet" />
        ) : (
          <div className="flex flex-col gap-3">
            {PLACEHOLDER_MY_OFFERS.map((offer) => (
              <Card key={offer.id} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{offer.listingTitle}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">{offer.listingAddress}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {offer.amount && (
                      <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
                        ${offer.amount}/mo
                      </span>
                    )}
                    <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
                      Offered {formatDate(offer.offeredAt)}
                    </span>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(offer.status)}`}>
                      {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Saved Listings */}
      <section>
        <SectionHeader title="Saved Listings" count={saved.length} />
        {saved.length === 0 ? (
          <EmptyState message="No saved listings" />
        ) : (
          <div className="flex flex-col gap-3">
            {saved.map((listing) => (
              <Card key={listing.id} className="flex items-start justify-between gap-4">
                <div className="flex-1 cursor-pointer" onClick={() => navigate(`/listings/${listing.id}`)}>
                  <p className="font-semibold text-sm text-foreground">{listing.title}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">{listing.address}</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    ${listing.monthlyRent}
                    <span className="text-xs font-normal text-foreground/50">/mo</span>
                  </p>
                </div>
                <button
                  onClick={() => handleRemoveSaved(listing.id)}
                  className="shrink-0 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>

      <MessagesSection />
    </div>
  );
}