import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";

interface Props {
  filter: string;
  options: string[];
  selected: string;
  setter: React.Dispatch<React.SetStateAction<string>>;
  formatSelected?: (val: string) => string;
}

export function SelectFilterButton({ filter, options, selected, setter, formatSelected }: Props) {
  const label = selected !== "any" ? (formatSelected ? formatSelected(selected) : selected) : filter;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className={`flex gap-2 px-6 py-2 bg-white rounded-full shadow hover:bg-gray-100 transition ${selected !== "any" ? "ring-2 ring-foreground/30" : ""}`}>
          {label}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <div className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded" onClick={() => setter("any")}>
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