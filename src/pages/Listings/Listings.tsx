import { MapSection, PropertyList } from "@/widgets/Listings";
import { useListings, useFavorites } from "@/shared/hooks";
import { PriceFilterButton, SelectFilterButton, DateFilterButton } from "./filters";
import { useMemo, useState } from "react";

const LISTING_TYPES = ["Sublease", "Lease", "Roommate"];
const BEDROOM_OPTIONS = ["1", "2", "3", "4", "5+"];

export function Listings() {
  const { listings } = useListings();
  const { favoriteIds, toggle } = useFavorites();
  const [typeFilter, setTypeFilter] = useState<string>("any");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [bedroomFilter, setBedroomFilter] = useState<string>("any");
  const [minDate, setMinDate] = useState<Date | null>(null);
  const [maxDate, setMaxDate] = useState<Date | null>(null);

  const filteredListings = useMemo(() => listings.filter((listing) => {
    const rent = parseInt(listing.monthly_rent);
    const priceMatch =
      (!minPrice || rent >= parseInt(minPrice)) &&
      (!maxPrice || rent <= parseInt(maxPrice));
    const typeMatch = typeFilter === "any" || listing.listing_type === typeFilter;
    const bedroomMatch =
      bedroomFilter === "any" ||
      (bedroomFilter === "5+"
        ? listing.total_bedroom_count >= 5
        : listing.total_bedroom_count === parseInt(bedroomFilter));
    const start_date = new Date(listing.start_date);
    const end_date = new Date(listing.end_date);
    const availabilityMatch =
      (!minDate || start_date <= minDate) &&
      (!maxDate || end_date >= maxDate);
    return priceMatch && typeMatch && bedroomMatch && availabilityMatch;
  }), [listings, minPrice, maxPrice, typeFilter, bedroomFilter, minDate, maxDate]);

  return (
    <div className="flex flex-1 flex-row gap-4 overflow-hidden h-full">
      {/* Left column */}
      <div className="flex-1 flex flex-col min-h-0 min-w-0">

        {/* Filter row */}
        <div className="mb-4 shrink-0 overflow-x-auto scrollbar-none px-1 py-1">
          <div className="flex gap-2 min-w-max">
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
              formatSelected={(val) => `${val} bedroom${val === "1" ? "" : "s"}`}
            />
            <SelectFilterButton
              filter="Type"
              options={LISTING_TYPES}
              selected={typeFilter}
              setter={setTypeFilter}
            />
            <DateFilterButton
              minDate={minDate}
              maxDate={maxDate}
              setMinDate={setMinDate}
              setMaxDate={setMaxDate}
            />
          </div>
        </div>

        {/* Listings */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 min-h-0">
          <PropertyList
            listings={filteredListings}
            favoriteIds={favoriteIds}
            onToggleFavorite={toggle}
          />
        </div>

      </div>

      {/* Map */}
      <div className="flex-1 h-full">
        <MapSection />
      </div>
    </div>
  );
}