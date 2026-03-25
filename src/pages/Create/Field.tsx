export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-foreground/60">
        {label}
      </label>
      <div className="[&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-foreground/15 [&>input]:bg-background [&>input]:px-4 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-foreground [&>input]:outline-none [&>input]:placeholder:text-foreground/50 [&>input]:focus:border-foreground/40 [&>input]:transition-colors [&>select]:w-full [&>select]:rounded-xl [&>select]:border [&>select]:border-foreground/15 [&>select]:bg-background [&>select]:px-4 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-foreground [&>select]:outline-none [&>select]:focus:border-foreground/40 [&>textarea]:w-full [&>textarea]:rounded-xl [&>textarea]:border [&>textarea]:border-foreground/15 [&>textarea]:bg-background [&>textarea]:px-4 [&>textarea]:py-2.5 [&>textarea]:text-sm [&>textarea]:text-foreground [&>textarea]:outline-none [&>textarea]:placeholder:text-foreground/50 [&>textarea]:focus:border-foreground/40 [&>textarea]:transition-colors [&>textarea]:resize-none">
        {children}
      </div>
    </div>
  );
}