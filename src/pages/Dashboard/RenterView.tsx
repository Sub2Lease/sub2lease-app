import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, EmptyState, RentStatusBadge, SectionHeader } from "./Components";
import { MessagesSection } from "./MessagesSection";
import { PLACEHOLDER_MY_LISTINGS, PLACEHOLDER_OFFERS_RECEIVED } from "./Placeholders";
import type { Offer } from "./Types";
import { formatDate, daysUntil, statusColor } from "./Utils";

export function RenterView() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>(PLACEHOLDER_OFFERS_RECEIVED);

  const subleased = PLACEHOLDER_MY_LISTINGS.filter((l) => l.status === "subleased");
  const onMarket = PLACEHOLDER_MY_LISTINGS.filter((l) => l.status === "market");

  const handleOffer = (id: number, action: "accepted" | "declined") => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, status: action } : o)));
    // TODO: call PATCH /offers/:id/status
  };

  return (
    <div className="flex flex-col gap-8">

      {/* Subleased Properties */}
      <section>
        <SectionHeader title="Subleased Properties" count={subleased.length} />
        {subleased.length === 0 ? (
          <EmptyState message="No properties currently subleased" />
        ) : (
          <div className="flex flex-col gap-3">
            {subleased.map((l) => (
              <Card key={l.id} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{l.title}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">{l.address}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <RentStatusBadge paid={l.rentPaid!} />
                    <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
                      Next payment: {formatDate(l.nextPayDate!)}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
                      {daysUntil(l.endDate!)} days left
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Listings on Market */}
      <section>
        <SectionHeader title="Listings on Market" count={onMarket.length} />
        {onMarket.length === 0 ? (
          <EmptyState message="No active listings on the market" />
        ) : (
          <div className="flex flex-col gap-3">
            {onMarket.map((l) => (
              <Card key={l.id} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm text-foreground">{l.title}</p>
                  <p className="text-xs text-foreground/50 mt-0.5">{l.address}</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
                      ♥ {l.likes} likes
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
                      👁 {l.clicks} clicks
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/listings/${l.id}/edit`)}
                  className="shrink-0 rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-medium text-foreground hover:bg-foreground/5 transition-colors"
                >
                  Edit
                </button>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Offers Received */}
      <section>
        <SectionHeader title="Offers Received" count={offers.filter((o) => o.status === "pending").length} />
        {offers.length === 0 ? (
          <EmptyState message="No offers received yet" />
        ) : (
          <div className="flex flex-col gap-3">
            {offers.map((offer) => (
              <Card key={offer.id}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-semibold text-sm text-foreground">{offer.listingTitle}</p>
                    <p className="text-xs text-foreground/50 mt-0.5">{offer.listingAddress}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/10 text-xs font-semibold text-foreground">
                        {offer.offererName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-foreground">{offer.offererName}</p>
                        <p className="text-xs text-foreground/50">{offer.offererEmail}</p>
                      </div>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {offer.amount && (
                        <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
                          ${offer.amount}/mo offered
                        </span>
                      )}
                      <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-xs text-foreground/60">
                        {formatDate(offer.offeredAt)}
                      </span>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor(offer.status)}`}>
                        {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  {offer.status === "pending" && (
                    <div className="flex shrink-0 flex-col gap-2">
                      <button
                        onClick={() => handleOffer(offer.id, "accepted")}
                        className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background hover:opacity-80 transition-opacity"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleOffer(offer.id, "declined")}
                        className="rounded-full border border-foreground/20 px-4 py-1.5 text-xs font-medium text-foreground hover:bg-foreground/5 transition-colors"
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <MessagesSection />
    </div>
  );
}