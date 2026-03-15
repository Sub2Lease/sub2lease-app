import type { Listing } from "@/shared/types";
import { MapSection, PropertyList } from "@/widgets/Listings";
import { useListings } from "@/shared/hooks";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";

function FilterButton({ filter, options, selected, setter }: { filter: string; options: string[], selected: string, setter: React.Dispatch<React.SetStateAction<string>> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex gap-2 px-6 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
          {selected || filter}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent>
        {options.map((item) => (
          <DropdownMenuItem key={item} onSelect={() => setter(item)} disabled={selected === item}>
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
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

  const [locationFilter, setLocationFilter] = useState<string>("any");
  const [priceFilter, setPriceFilter] = useState<string>("any");
  const [bedroomFilter, setBedroomFilter] = useState<string>("any");

  // DUMMY IF BACKEND OFF / NO LISTINGS
  const usedListings = fetchedListings.length ? fetchedListings : DUMMY_PROPERTIES;

  const prices = useMemo(() => {
    return [...new Set(usedListings.map((listing) => listing.monthly_rent))].sort((a, b) => parseInt(a) - parseInt(b)).concat("any");
  }, [usedListings]);

  const locations = useMemo(() => {
    return [...new Set(usedListings.map((listing) => listing.address.split(", ")[1]))].sort().concat("any");
  }, [usedListings]);

  const filteredListings = useMemo(() => usedListings.filter((listing) => {
    const priceMatch = priceFilter === "any" || listing.monthly_rent === priceFilter;
    const locationMatch = locationFilter === "any" || listing.address.split(", ")[1] === locationFilter;
    // const bedroomMatch = bedroomFilter === "any" || listing.bedrooms === parseInt(bedroomFilter);
    return priceMatch && locationMatch;
  }), [usedListings, priceFilter, locationFilter]);

  return (
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="mb-4 gap-2 flex">
            <FilterButton filter="Price" options={prices} selected={priceFilter} setter={setPriceFilter} />
            <FilterButton filter="Bedrooms" options={["1", "2", "3"]} selected={bedroomFilter} setter={setBedroomFilter} />
            <FilterButton filter="Location" options={locations} selected={locationFilter} setter={setLocationFilter} />
          </div>
          <PropertyList listings={[...filteredListings, ...filteredListings, ...filteredListings]} />
        </div>
        <div className="flex-1">
          <MapSection lat={43.07305} lng={-89.40325} />
        </div>
      </div>
  );
}