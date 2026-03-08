import type { Listing } from "@/shared/types";
import { MapSection, PropertyList, SearchBar } from "@/widgets/Listings";

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
    title: "Property #1",
    price: 12345,
    address: "339 West Gorham Street, Madison Wisconsin",
    imageUrl: "https://images.pexels.com/photos/35282517/pexels-photo-35282517.jpeg",
  },
  {
    title: "Property #2",
    price: 12345,
    address: "339 West Gorham Street, Madison Wisconsin",
    imageUrl: "https://images.pexels.com/photos/36176552/pexels-photo-36176552.jpeg",
  },
  {
    title: "Property #3",
    price: 12345,
    address: "339 West Gorham Street, Madison Wisconsin",
    imageUrl: "https://images.pexels.com/photos/36333018/pexels-photo-36333018.jpeg",
  },
];

export function Listings({ listings = [] }: { listings?: Listing[] }) {
  const shownListings = listings.length ? listings : DUMMY_PROPERTIES;

  return (
    <div className="bg-background">

      <SearchBar />

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <FilterButtons />  
          <PropertyList listings={shownListings} />
        </div>
        <div className="flex-1">
          <MapSection lat={43.07305} lng={-89.40325} />
        </div>
      </div>
    </div>
  );
}