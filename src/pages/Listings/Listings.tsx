import { MapSection, PropertyList } from "@/widgets/Listings";
import { useListings } from "@/shared/hooks";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";

const LISTING_TYPES = ["Sublease", "Lease", "Roommate"];
const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5+"];

function PriceFilterButton({ minPrice, maxPrice, setMinPrice, setMaxPrice }: {
  minPrice: string;
  maxPrice: string;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const hasFilter = minPrice || maxPrice;
  const label = hasFilter ? `$${minPrice || "0"} — $${maxPrice || "1000"}` : "Price";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className={`flex gap-2 px-6 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition ${hasFilter ? "ring-2 ring-foreground/30" : ""}`}>
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 w-72" align="start" side="bottom" sideOffset={8} avoidCollisions={false}>
        <p className="font-semibold text-sm mb-3">Price</p>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <p className="text-xs text-foreground/50 mb-1">Min. price</p>
            <input
              type="number"
              placeholder="$0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full border border-foreground/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />
          </div>
          <span className="mt-5 text-foreground/40">—</span>
          <div className="flex-1">
            <p className="text-xs text-foreground/50 mb-1">Max. price</p>
            <input
              type="number"
              placeholder="$1000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full border border-foreground/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => { setMinPrice(""); setMaxPrice(""); }}
            className="flex-1 py-2 rounded-full border border-foreground/20 text-sm hover:bg-gray-50 transition"
          >
            Clear filter
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex-1 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-80 transition"
          >
            Save
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function FilterButton({ filter, options, selected, setter }: {
  filter: string;
  options: string[];
  selected: string;
  setter: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex gap-2 px-6 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition ${selected !== "any" ? "ring-2 ring-foreground/30" : ""}`}>
          {selected !== "any" ? selected : filter}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <div
          className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded"
          onClick={() => setter("any")}
        >
          Any
        </div>
        {options.map((item) => (
          <div
            key={item}
            className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded ${selected === item ? "font-semibold" : ""}`}
            onClick={() => setter(item)}
          >
            {item}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function Listings() {
  const fetchedListings = useListings();
  const [typeFilter, setTypeFilter] = useState<string>("any");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [bedroomFilter, setBedroomFilter] = useState<string>("any");

  const filteredListings = useMemo(() => fetchedListings.filter((listing) => {
    const rent = parseInt(listing.monthly_rent);
    const priceMatch =
      (!minPrice || rent >= parseInt(minPrice)) &&
      (!maxPrice || rent <= parseInt(maxPrice));
    const typeMatch = typeFilter === "any" || listing.listing_type === typeFilter;
    const bedroomMatch = bedroomFilter === "any" ||
      (bedroomFilter === "5+" ? listing.total_bedroom_count >= 5 : listing.total_bedroom_count === parseInt(bedroomFilter));
    return priceMatch && typeMatch && bedroomMatch;
  }), [fetchedListings, minPrice, maxPrice, typeFilter, bedroomFilter]);

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <div className="mb-4 gap-2 flex">
          <PriceFilterButton
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
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