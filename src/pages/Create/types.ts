export type Step = "basics" | "details" | "dates" | "extras";

export const STEPS: { id: Step; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "details", label: "Details" },
  { id: "dates", label: "Dates & Price" },
  { id: "extras", label: "Extras" },
];

export interface FormState {
  title: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  description: string;
  property_type: string;
  listing_type: string;
  poster_role: string;
  furnished: boolean;
  total_bedroom_count: number;
  rooms_available: number;
  bathrooms: number;
  monthly_rent: string;
  security_deposit: string;
  start_date: string;
  end_date: string;
  property_website: string;
  amenities: string;
  house_rules: string;
}

export const initialFormState: FormState = {
  title: "",
  address: "",
  city: "",
  state: "",
  country: "US",
  zipcode: "",
  description: "",
  property_type: "Apartment",
  listing_type: "Sublease",
  poster_role: "Tenant",
  furnished: false,
  total_bedroom_count: 0,
  rooms_available: 0,
  bathrooms: 0,
  monthly_rent: "",
  security_deposit: "",
  start_date: "",
  end_date: "",
  property_website: "",
  amenities: "",
  house_rules: "",
};