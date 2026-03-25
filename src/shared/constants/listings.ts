import type { Step, FormState, Amenity } from "../types";
import {
  Wind,
  Wifi,
  Flame,
  Dumbbell,
  Waves,
  UtensilsCrossed,
  Microwave,
} from "lucide-react";

export const amenities: { icon: typeof Wind; label: string; value: Amenity }[] = [
  { icon: Wind, label: "Air conditioning", value: "aircon" },
  { icon: UtensilsCrossed, label: "Dishwasher", value: "dishwasher" },
  { icon: Dumbbell, label: "Gym", value: "gym" },
  { icon: Flame, label: "Heating", value: "heating" },
  { icon: Waves, label: "In-unit laundry", value: "laundry" },
  { icon: Microwave, label: "Microwave", value: "microwave" },
  { icon: UtensilsCrossed, label: "Oven", value: "oven" },
  { icon: UtensilsCrossed, label: "Stove", value: "stove" },
  { icon: Wifi, label: "Wifi", value: "wifi" },
];


// CREATE LISTINGS --------------------------------
export const steps: { id: Step; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "details", label: "Details" },
  { id: "dates", label: "Dates & Price" },
  { id: "extras", label: "Extras" },
];

export const initialFormState: FormState = {
  title: "",
  address: "",
  city: "Madison",
  state: "WI",
  country: "US",
  zipcode: "537XX",
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