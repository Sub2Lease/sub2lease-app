import type { z } from "zod";
import type { postSchema } from "@/shared/api/backendGO/z";
import { Link } from "react-router-dom";

type Listing = z.infer<typeof postSchema> & { photos: string[] };

interface PropertyCardProps {
  property: Listing;
  isFavorited: boolean;
  onToggleFavorite: (id: number) => void;
}

export function PropertyCard({ property, isFavorited, onToggleFavorite }: PropertyCardProps) {
  const photo = property.photos?.[0] || null;

  return (
    <Link to={`/listings/${property.id}`} className="shrink-0 box-border flex bg-white rounded-xl overflow-hidden shadow md:mb-1 lg:mb-2 xl:mb-4">
      <div className="aspect-[4/3] w-1/2 shrink-0 bg-gray-100">
        {photo ? (
          <img
            src={photo}
            alt={property.title}
            className="size-full object-[50%_70%] object-cover"
          />
        ) : (
          <div className="size-full bg-gray-500" />
        )}
      </div>
      <div className="box-border flex-1 flex justify-between w-full items-start">
        <div className="p-4">
          <h2 className="font-bold text-lg">{property.title}</h2>
          <span className="font-semibold">${property.monthly_rent}</span>
          <p className="text-gray-600">{property.address}</p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(property.id);
          }}
          className={`mr-2 leading-none select-none text-5xl transition-colors ${
            isFavorited ? "text-red-500 hover:text-red-300" : "text-gray-300 hover:text-red-400"
          }`}
        >
          ♥
        </button>
      </div>
    </Link>
  );
}