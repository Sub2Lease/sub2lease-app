import type { z } from "zod";
import type { postSchema } from "@/shared/api/backendGO/z";
import { PropertyCard } from "./PropertyCard";

type Listing = z.infer<typeof postSchema> & { photos: string[] };

interface Props {
  listings: Listing[];
  favoriteIds: Set<number>;
  onToggleFavorite: (postId: number) => void;
}

export function PropertyList({ listings, favoriteIds, onToggleFavorite }: Props) {
  return (
    <div className="flex flex-col w-full gap-4">
      {listings.map((listing) => (
        <PropertyCard
          key={listing.id}
          property={listing}
          isFavorited={favoriteIds.has(listing.id)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}