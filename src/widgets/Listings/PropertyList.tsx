import type { Listing } from "@/shared/types";
import { PropertyCard } from "./PropertyCard";

export function PropertyList({ listings }: { listings: Listing[] }) {
  return (
    <div className="flex flex-col w-full px-4">
      {listings.map((listing, index) => (
        <PropertyCard key={index} property={listing} />
      ))}
    </div>
  );
}