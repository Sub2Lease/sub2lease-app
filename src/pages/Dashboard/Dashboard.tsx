import { useState } from "react";
import { RenterView } from "./RenterView";
import { ResidentView } from "./ResidentView";

// TODO: Replace hardcoded default mode with user's actual role from auth/profile
// TODO: Persist selected mode to localStorage or user preferences

export function Dashboard() {
  const [mode, setMode] = useState<"resident" | "renter">("resident");

  return (
    <div className="w-full flex flex-1 flex-col h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex items-center rounded-full border border-foreground/15 bg-foreground/5 p-1">
          <button
            onClick={() => setMode("resident")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "resident" ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Resident
          </button>
          <button
            onClick={() => setMode("renter")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "renter" ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Renter
          </button>
        </div>
      </div>

      <div className="overflow-y-auto scrollbar-none">{mode === "renter" ? <RenterView /> : <ResidentView />}</div>
    </div>
  );
}