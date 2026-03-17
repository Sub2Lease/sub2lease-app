import { useState } from "react";
import { RenterView } from "./RenterView";
import { ResidentView } from "./ResidentView";

export function Dashboard() {
  const [mode, setMode] = useState<"renter" | "resident">("renter");

  return (
    <div className="mx-auto w-full max-w-5xl py-8">

      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex items-center rounded-full border border-foreground/15 bg-foreground/5 p-1">
          <button
            onClick={() => setMode("renter")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "renter" ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Renter
          </button>
          <button
            onClick={() => setMode("resident")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              mode === "resident" ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground"
            }`}
          >
            Resident
          </button>
        </div>
      </div>

      {mode === "renter" ? <RenterView /> : <ResidentView />}
    </div>
  );
}