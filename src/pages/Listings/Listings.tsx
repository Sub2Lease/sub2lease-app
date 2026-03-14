import type { Listing } from "@/shared/types";
import { MapSection, PropertyList } from "@/widgets/Listings";
import { useListings } from "@/shared/hooks";

function FilterButtons() {
  const filters = ["Price", "Bedrooms", "Types"];
  return (
    <div className="flex gap-4 justify-center mb-6">
      {filters.map((filter) => (
        <button
          key={filter}
          className="px-6 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition"
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

const DUMMY_PROPERTIES: Listing[] = [
  {
    title: "4 x 1BR/1BA Simplistic Homes",
    monthly_rent: "6,800",
    address: "Kinshasa, Congo",
    photos: ["https://images.pexels.com/photos/35282517/pexels-photo-35282517.jpeg"],
  },
  {
    title: "Oceanview old Athens homes",
    monthly_rent: "265,500",
    address: "Athens, Greece",
    photos: ["https://images.pexels.com/photos/36176552/pexels-photo-36176552.jpeg"],
  },
  {
    title: "Brick by Brick Apartments",
    monthly_rent: "1,200",
    address: "Cairo, Egypt",
    photos: ["https://images.pexels.com/photos/36333018/pexels-photo-36333018.jpeg"],
  },
];

export function Listings() {
  const fetchedListings = useListings();

  // DUMMY IF BACKEND OFF / NO LISTINGS
  const usedListings = fetchedListings.length ? fetchedListings : DUMMY_PROPERTIES;

  return (
    <div className="bg-background">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <FilterButtons />
          <PropertyList listings={usedListings} />
        </div>
        <div className="flex-1">
          <MapSection lat={43.07305} lng={-89.40325} />
        </div>
      </div>
    </div>
  );
}