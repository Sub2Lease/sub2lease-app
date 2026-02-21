import { cn } from "@/shared/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <span className={cn("inline-block w-16 animate-pulse rounded-sm bg-secondary-foreground/10", className)} {...props}>
      &zwnj;
    </span>
  );
}

export { Skeleton };
