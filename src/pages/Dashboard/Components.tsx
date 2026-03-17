export function SectionHeader({ title, count }: { title: string; count?: number }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      {count !== undefined && (
        <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs font-medium text-foreground/60">
          {count}
        </span>
      )}
    </div>
  );
}

export function RentStatusBadge({ paid }: { paid: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${paid ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-green-500" : "bg-red-500"}`} />
      {paid ? "Rent paid" : "Rent due"}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-foreground/10 bg-white p-5 ${className}`}>
      {children}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-foreground/15 p-8 text-center text-sm text-foreground/40">
      {message}
    </div>
  );
}