export interface MyListing {
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

export interface Offer {
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

export interface CurrentStay {
  id: number;
  title: string;
  address: string;
  photo?: string;
  rentPaid: boolean;
  nextDueDate: string;
  endDate: string;
}

export interface MyOffer {
  id: number;
  listingTitle: string;
  listingAddress: string;
  listingPhoto?: string;
  offeredAt: string;
  amount?: number;
  status: "pending" | "accepted" | "declined";
}

export interface SavedListing {
  id: number;
  title: string;
  address: string;
  photo?: string;
  monthlyRent: string;
}

export interface Message {
  id: number;
  from: string;
  preview: string;
  time: string;
  unread: boolean;
}