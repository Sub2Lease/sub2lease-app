import type { z } from "zod";
import type { postSchema } from "@/shared/api/backendGO/z";
import { PropertyCard } from "./PropertyCard";

type Listing = z.infer<typeof postSchema> & { photos: string[] };

interface Props {
  listings: Listing[];
}

export function PropertyList({ listings }: Props) {
  return (
    <div className="max-h-[600px]">
      <div className="flex flex-col w-full scroll-container">
        {listings.map((listing, index) => (
          <PropertyCard key={index} property={listing} />
        ))}
      </div>
    </div>
  );
}