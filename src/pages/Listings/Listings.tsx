import { MapSection, PropertyList } from "@/widgets/Listings";
import { useListings } from "@/shared/hooks";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";

const LISTING_TYPES = ["Sublease", "Lease", "Roommate"];
const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5+"];

function FilterButton({ filter, options, selected, setter }: {
  filter: string;
  options: string[];
  selected: string;
  setter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex gap-2 px-6 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition">
          {selected !== "any" ? selected : filter}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => setter("any")} disabled={selected === "any"}>
          Any
        </DropdownMenuItem>
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
  const [typeFilter, setTypeFilter] = useState<string>("any");
  const [priceFilter, setPriceFilter] = useState<string>("any");
  const [bedroomFilter, setBedroomFilter] = useState<string>("any");

  const prices = useMemo(() => {
    return [...new Set(fetchedListings.map((l) => l.monthly_rent))]
      .sort((a, b) => parseInt(a) - parseInt(b));
  }, [fetchedListings]);

  const filteredListings = useMemo(() => fetchedListings.filter((listing) => {
    const priceMatch = priceFilter === "any" || listing.monthly_rent === priceFilter;
    const typeMatch = typeFilter === "any" || listing.listing_type === typeFilter;
    const bedroomMatch = bedroomFilter === "any" ||
      (bedroomFilter === "5+" ? listing.total_bedroom_count >= 5 : listing.total_bedroom_count === parseInt(bedroomFilter));
    return priceMatch && typeMatch && bedroomMatch;
  }), [fetchedListings, priceFilter, typeFilter, bedroomFilter]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="mb-4 gap-2 flex">
          <FilterButton filter="Price" options={prices} selected={priceFilter} setter={setPriceFilter} />
          <FilterButton filter="Bedrooms" options={BEDROOM_OPTIONS} selected={bedroomFilter} setter={setBedroomFilter} />
          <FilterButton filter="Type" options={LISTING_TYPES} selected={typeFilter} setter={setTypeFilter} />
        </div>
        <PropertyList listings={filteredListings} />
      </div>
      <div className="flex-1">
        <MapSection lat={43.07305} lng={-89.40325} />
      </div>
    </div>
  );
}