import { MapSection, PropertyList } from "@/widgets/Listings";
import { useListings } from "@/shared/hooks";
import { PriceFilterButton, SelectFilterButton } from "./filters";
import { useMemo, useState } from "react";

const LISTING_TYPES = ["Sublease", "Lease", "Roommate"];
const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5+"];

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
    <div className="flex flex-col md:flex-row gap-4 h-screen overflow-hidden">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="mb-4 gap-2 flex shrink-0 px-1 py-1">
          <PriceFilterButton
            minPrice={minPrice}
            maxPrice={maxPrice}
            setMinPrice={setMinPrice}
            setMaxPrice={setMaxPrice}
          />
          <SelectFilterButton
            filter="Bedrooms"
            options={BEDROOM_OPTIONS}
            selected={bedroomFilter}
            setter={setBedroomFilter}
            formatSelected={(val) => val === "5+" ? "5+ bedrooms" : `${val} bedroom${val === "1" ? "" : "s"}`}
          />
          <SelectFilterButton filter="Type" options={LISTING_TYPES} selected={typeFilter} setter={setTypeFilter} />
        </div>
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 min-h-0">
          <PropertyList listings={filteredListings} />
        </div>
      </div>
      <div className="flex-1 shrink-0 h-full">
        <MapSection lat={43.07305} lng={-89.40325} />
      </div>
    </div>
  );
}