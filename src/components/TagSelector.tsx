import { useState, useMemo } from 'react';

interface Option {
  id: string;
  label: string;
}

interface TagSelectorProps {
  options: Option[];
  title: string;
  onChange: (selected: string) => void;
  initialValue?: string;
}

export function TagSelector({ options, title, onChange, initialValue }: TagSelectorProps) {
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    initialValue ? initialValue.split(" ").filter(Boolean) : []
  );

  const filtered = useMemo(() => {
    return options.filter(opt =>
      opt.label.toLowerCase().includes(query.toLowerCase()) &&
      !selectedIds.includes(opt.id)
    );
  }, [query, options, selectedIds]);

  const selectedItems = selectedIds.map(id => options.find(opt => opt.id === id)).filter((opt) => !!opt);

  const handleToggle = (id: string) => {
    const nextIds = selectedIds.includes(id)
      ? selectedIds.filter(itemId => itemId !== id)
      : [...selectedIds, id];

    setSelectedIds(nextIds);
    onChange(options.map(({ id }) => id).filter(id => nextIds.includes(id)).join(" "));
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-end">
        <h3 className="text-sm font-medium uppercase tracking-wide text-foreground/60">{title}</h3>
        <span className="text-xs text-foreground/50">{selectedIds.length} selected</span>
      </div>

      <div className="flex flex-wrap gap-2 min-h-[32px] p-2 rounded-lg bg-background border border-foreground/15">
        {selectedItems.length > 0 ? (
          selectedItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className="flex items-center gap-1 px-2 py-1.5 bg-foreground/5 border border-foreground/5 text-foreground text-xs rounded-md hover:bg-foreground/10 transition-all"
            >
              {item.label} <span>✕</span>
            </button>
          ))
        ) : (
          <span className="text-sm text-foreground/50 self-center select-none">No {title.toLowerCase()} selected...</span>
        )}
      </div>

      <input
        type="text"
        placeholder="Type to filter..."
        className="w-full px-3 py-2 text-sm rounded-md text-foreground placeholder:text-foreground/50 transition-colors focus:border-foreground/40 outline-none bg-background border border-foreground/15"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {filtered.map(item => (
          <button
            key={item.id}
            onClick={() => handleToggle(item.id)}
            className="px-3 py-1.5 bg-background/75 border border-foreground/15 text-xs rounded-full hover:border-foreground/30 transition-colors"
          >
            + {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};