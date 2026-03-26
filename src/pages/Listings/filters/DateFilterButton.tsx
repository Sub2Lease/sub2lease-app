import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

export function DateFilterButton({
  minDate,
  maxDate,
  setMinDate,
  setMaxDate,
}: {
  minDate: Date | null;
  maxDate: Date | null;
  setMinDate: (d: Date | null) => void;
  setMaxDate: (d: Date | null) => void;
}) {
  const [open, setOpen] = useState(false);

  const toInputValue = (d: Date | null) =>
    d ? d.toISOString().split("T")[0] : "";

  const hasFilter = minDate || maxDate;
  const label = hasFilter
    ? `${minDate ? minDate.toLocaleDateString() : "Any"} – ${maxDate ? maxDate.toLocaleDateString() : "Any"}`
    : "Dates";

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button className={`flex gap-2 px-6 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition whitespace-nowrap ${hasFilter ? "ring-2 ring-foreground/30" : ""}`}>
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-4 w-72" align="start" side="bottom" sideOffset={8} avoidCollisions={false}>
        <p className="font-semibold text-sm mb-3">Dates</p>
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs text-foreground/50 mb-1">Available from</p>
            <input
              type="date"
              value={toInputValue(minDate)}
              onChange={(e) => setMinDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full border border-foreground/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />
          </div>
          <div>
            <p className="text-xs text-foreground/50 mb-1">Available to</p>
            <input
              type="date"
              value={toInputValue(maxDate)}
              onChange={(e) => setMaxDate(e.target.value ? new Date(e.target.value) : null)}
              className="w-full border border-foreground/15 rounded-lg px-3 py-2 text-sm outline-none focus:border-foreground/40"
            />
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => { setMinDate(null); setMaxDate(null); }}
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