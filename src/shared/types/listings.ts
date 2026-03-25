import type { z } from "zod";
import type { postSchema } from "@/shared/api/backendGO/z";

export const AMENITIES = ["aircon", "dishwasher", "gym", "heating", "laundry", "microwave", "oven", "stove", "wifi"] as const;
export type Amenity = typeof AMENITIES[number];

export type Listing = z.infer<typeof postSchema> & { photos: string[] };

// CREATE LISTINGS --------------------------------
export const STEPS = ["basics", "details", "dates", "extras"] as const;
export type Step = typeof STEPS[number];

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