import type { MyListing, Offer, CurrentStay, MyOffer, SavedListing, Message } from "./Types";

export const PLACEHOLDER_MY_LISTINGS: MyListing[] = [
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

export const PLACEHOLDER_OFFERS_RECEIVED: Offer[] = [
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

export const PLACEHOLDER_CURRENT_STAY: CurrentStay = {
  id: 10,
  title: "Modern 1BR in Capitol Area",
  address: "321 Carroll St, Madison, WI",
  rentPaid: false,
  nextDueDate: "2026-04-01",
  endDate: "2026-08-15",
};

export const PLACEHOLDER_MY_OFFERS: MyOffer[] = [
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

export const PLACEHOLDER_SAVED: SavedListing[] = [
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

export const PLACEHOLDER_MESSAGES: Message[] = [
  { id: 1, from: "Alex Johnson", preview: "Hey, is the place still available?", time: "2h ago", unread: true },
  { id: 2, from: "Priya Sharma", preview: "What floor is the unit on?", time: "5h ago", unread: true },
  { id: 3, from: "Marcus Lee", preview: "Thanks for getting back to me!", time: "1d ago", unread: false },
];