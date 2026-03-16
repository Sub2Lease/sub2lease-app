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

export function Listings() {
  const fetchedListings = useListings();
  const [locationFilter, setLocationFilter] = useState<string>("any");
  const [priceFilter, setPriceFilter] = useState<string>("any");
  const [bedroomFilter, setBedroomFilter] = useState<string>("any");

  const prices = useMemo(() => {
    return [...new Set(fetchedListings.map((listing) => listing.monthly_rent))].sort((a, b) => parseInt(a) - parseInt(b)).concat("any");
  }, [fetchedListings]);

  const locations = useMemo(() => {
    return [...new Set(fetchedListings.map((listing) => listing.address.split(", ")[1]))].sort().concat("any");
  }, [fetchedListings]);

  const filteredListings = useMemo(() => fetchedListings.filter((listing) => {
    const priceMatch = priceFilter === "any" || listing.monthly_rent === priceFilter;
    const locationMatch = locationFilter === "any" || listing.address.split(", ")[1] === locationFilter;
    return priceMatch && locationMatch;
  }), [fetchedListings, priceFilter, locationFilter]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="mb-4 gap-2 flex">
          <FilterButton filter="Price" options={prices} selected={priceFilter} setter={setPriceFilter} />
          <FilterButton filter="Bedrooms" options={["1", "2", "3"]} selected={bedroomFilter} setter={setBedroomFilter} />
          <FilterButton filter="Location" options={locations} selected={locationFilter} setter={setLocationFilter} />
        </div>
        <PropertyList listings={filteredListings} />
      </div>
      <div className="flex-1">
        <MapSection lat={43.07305} lng={-89.40325} />
      </div>
    </div>
  );
}