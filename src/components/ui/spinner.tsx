import type { ClassValue } from "clsx";
import { cn } from "@/shared/utils";

export function Spinner({ className }: { className?: ClassValue }) {
  return (
    <svg className={cn("size-6 origin-center animate-spinner", className)} viewBox="0 0 50 50" fill="none">
      <circle
        className="animate-dash stroke-current stroke-[5px]"
        cx="25"
        cy="25"
        r="18"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
