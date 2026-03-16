import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

interface Props {
  minPrice: string;
  maxPrice: string;
  setMinPrice: (v: string) => void;
  setMaxPrice: (v: string) => void;
}

export function PriceFilterButton({ minPrice, maxPrice, setMinPrice, setMaxPrice }: Props) {
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