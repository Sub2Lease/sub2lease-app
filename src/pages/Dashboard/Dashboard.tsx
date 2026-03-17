import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Placeholder types ────────────────────────────────────────────────────────

interface MyListing {
  id: number;
  title: string;
  address: string;
  photo?: string;
  status: "subleased" | "market";
  // subleased
  rentPaid?: boolean;
  nextPayDate?: string;
  endDate?: string;
  // market
  likes?: number;
  clicks?: number;
}

interface Offer {
  id: number;
  listingTitle: string;
  listingAddress: string;
  offererName: string;
  offererEmail: string;
  offererPhoto?: string;
  offeredAt: string;
  amount?: number;
  status: "pending" | "accepted" | "declined";
}

interface CurrentStay {
  id: number;
  title: string;
  address: string;
  photo?: string;
  rentPaid: boolean;
  nextDueDate: string;
  endDate: string;
}

interface MyOffer {
  id: number;
  listingTitle: string;
  listingAddress: string;
  listingPhoto?: string;
  offeredAt: string;
  amount?: number;
  status: "pending" | "accepted" | "declined";
}

interface SavedListing {
  id: number;
  title: string;
  address: string;
  photo?: string;
  monthlyRent: string;
}

interface Message {
  id: number;
  from: string;
  preview: string;
  time: string;
  unread: boolean;
}

// ── Placeholder data ─────────────────────────────────────────────────────────

const PLACEHOLDER_MY_LISTINGS: MyListing[] = [
  {
    id: 1,
    title: "Cozy Studio on Langdon St",
    address: "123 Langdon St, Madison, WI",
    status: "subleased",
    rentPaid: true,
    nextPayDate: "2026-04-01",
    endDate: "2026-07-31",
  },
  {
    id: 2,
    title: "2BR Near UW Campus",
    address: "456 State St, Madison, WI",
    status: "market",
    likes: 14,
    clicks: 82,
  },
  {
    id: 3,
    title: "Sunny 1BR Downtown",
    address: "789 Johnson St, Madison, WI",
    status: "market",
    likes: 6,
    clicks: 31,
  },
];

const PLACEHOLDER_OFFERS_RECEIVED: Offer[] = [
  {
    id: 1,
    listingTitle: "2BR Near UW Campus",
    listingAddress: "456 State St, Madison, WI",
    offererName: "Alex Johnson",
    offererEmail: "alex@example.com",
    offeredAt: "2026-03-14",
    amount: 1100,
    status: "pending",
  },
  {
    id: 2,
    listingTitle: "Sunny 1BR Downtown",
    listingAddress: "789 Johnson St, Madison, WI",
    offererName: "Priya Sharma",
    offererEmail: "priya@example.com",
    offeredAt: "2026-03-15",
    amount: 950,
    status: "pending",
  },
];

const PLACEHOLDER_CURRENT_STAY: CurrentStay = {
  id: 10,
  title: "Modern 1BR in Capitol Area",
  address: "321 Carroll St, Madison, WI",
  rentPaid: false,
  nextDueDate: "2026-04-01",
  endDate: "2026-08-15",
};

const PLACEHOLDER_MY_OFFERS: MyOffer[] = [
  {
    id: 1,
    listingTitle: "3BR Townhouse on Monroe",
    listingAddress: "55 Monroe St, Madison, WI",
    offeredAt: "2026-03-10",
    amount: 1400,
    status: "pending",
  },
  {
    id: 2,
    listingTitle: "Studio Near Engineering",
    listingAddress: "200 University Ave, Madison, WI",
    offeredAt: "2026-03-08",
    amount: 800,
    status: "accepted",
  },
];

const PLACEHOLDER_SAVED: SavedListing[] = [
  {
    id: 1,
    title: "Cozy 2BR with Parking",
    address: "88 Regent St, Madison, WI",
    monthlyRent: "1350",
  },
  {
    id: 2,
    title: "1BR Near Memorial Union",
    address: "10 Park St, Madison, WI",
    monthlyRent: "1050",
  },
];

const PLACEHOLDER_MESSAGES: Message[] = [
  { id: 1, from: "Alex Johnson", preview: "Hey, is the place still available?", time: "2h ago", unread: true },
  { id: 2, from: "Priya Sharma", preview: "What floor is the unit on?", time: "5h ago", unread: true },
  { id: 3, from: "Marcus Lee", preview: "Thanks for getting back to me!", time: "1d ago", unread: false },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function daysUntil(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function statusColor(status: string) {
  if (status === "accepted") return "text-green-600 bg-green-50";
  if (status === "declined") return "text-red-500 bg-red-50";
  return "text-amber-600 bg-amber-50";
}

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/60">
          {count}
        </span>
      )}
    </div>
  );
}

function RentStatusBadge({ paid }: { paid: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${paid ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-green-500" : "bg-red-500"}`} />
      {paid ? "Rent paid" : "Rent due"}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-foreground/10 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-foreground/15 p-8 text-center text-sm text-foreground/40">
      {message}
    </div>
  );
}

// ── Renter View ──────────────────────────────────────────────────────────────

function RenterView() {
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

      {/* My Listings — Subleased */}
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

      {/* My Listings — On Market */}
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

      {/* Messages */}
      <MessagesSection />
    </div>
  );
}

// ── Resident View ────────────────────────────────────────────────────────────

function ResidentView() {
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
                  <p className="mt-2 text-sm font-semibold text-foreground">${listing.monthlyRent}<span className="text-xs font-normal text-foreground/50">/mo</span></p>
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

      {/* Messages */}
      <MessagesSection />
    </div>
  );
}

// ── Messages (shared) ────────────────────────────────────────────────────────

function MessagesSection() {
  return (
    <section>
      <SectionHeader title="Messages" count={PLACEHOLDER_MESSAGES.filter((m) => m.unread).length} />
      {PLACEHOLDER_MESSAGES.length === 0 ? (
        <EmptyState message="No messages yet" />
      ) : (
        <div className="flex flex-col gap-2">
          {PLACEHOLDER_MESSAGES.map((msg) => (
            <Card key={msg.id} className={`flex items-start gap-3 cursor-pointer hover:bg-foreground/5 transition-colors ${msg.unread ? "border-foreground/20" : ""}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground/10 text-sm font-semibold text-foreground">
                {msg.from.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className={`text-sm ${msg.unread ? "font-semibold text-foreground" : "font-medium text-foreground/70"}`}>
                    {msg.from}
                  </p>
                  <span className="text-xs text-foreground/40 shrink-0">{msg.time}</span>
                </div>
                <p className="text-xs text-foreground/50 truncate mt-0.5">{msg.preview}</p>
              </div>
              {msg.unread && <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-foreground" />}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

// ── Dashboard Page ───────────────────────────────────────────────────────────

export function Dashboard() {
  const [mode, setMode] = useState<"renter" | "resident">("renter");

  return (
    <div className="mx-auto w-full max-w-2xl py-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex items-center rounded-full border border-foreground/15 bg-foreground/5 p-1">
          <button
            onClick={() => setMode("renter")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "renter" ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Renter
          </button>
          <button
            onClick={() => setMode("resident")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "resident" ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Resident
          </button>
        </div>
      </div>

      {mode === "renter" ? <RenterView /> : <ResidentView />}
    </div>
  );
}