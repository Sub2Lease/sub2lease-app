import { Field } from "../Field";
import type { FormState } from "@/shared/types";
import { TagSelector } from "@/components/TagSelector";
import { amenities } from "@/shared";
import { X, Plus } from "lucide-react";

const PROPERTY_TYPES = ["Apartment", "House", "Condo", "Studio", "Townhouse", "Dorm"];
const LISTING_TYPES = ["Sublease", "Lease", "Roommate"];
const POSTER_ROLES = ["Tenant", "Landlord", "Property Manager"];

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export interface RoommateEntry {
  age: string;
  gender: string;
}

interface Props {
  form: FormState;
  set: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setNum: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  roommates: RoommateEntry[];
  setRoommates: React.Dispatch<React.SetStateAction<RoommateEntry[]>>;
}

export function DetailsStep({ form, set, setNum, setForm, roommates, setRoommates }: Props) {
  const addRoommate = () => {
    setRoommates((prev) => [...prev, { age: "", gender: "Prefer not to say" }]);
  };

  const removeRoommate = (index: number) => {
    setRoommates((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRoommate = (index: number, field: keyof RoommateEntry, value: string) => {
    setRoommates((prev) =>
      prev.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    );
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-foreground">Property Details</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-foreground/60">Property type</label>
            <div className="group relative">
              <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-foreground/30 text-[10px] text-foreground/50 select-none">?</span>
              <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden w-60 -translate-x-1/2 rounded-xl border border-foreground/10 bg-background p-3 text-xs text-foreground/70 shadow-lg group-hover:block">
                <p className="mb-1"><span className="font-semibold text-foreground">Apartment</span> — unit in a multi-unit building</p>
                <p className="mb-1"><span className="font-semibold text-foreground">House</span> — standalone residential home</p>
                <p className="mb-1"><span className="font-semibold text-foreground">Condo</span> — privately owned unit in a shared building</p>
                <p className="mb-1"><span className="font-semibold text-foreground">Studio</span> — open-plan single room with no separate bedroom</p>
                <p className="mb-1"><span className="font-semibold text-foreground">Townhouse</span> — multi-floor home sharing walls with neighbors</p>
                <p><span className="font-semibold text-foreground">Dorm</span> — university or college housing</p>
              </div>
            </div>
          </div>
          <select value={form.property_type} onChange={set("property_type")} className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground/40">
            {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-foreground/60 select">Listing type</label>
            <div className="group relative">
              <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-foreground/30 text-[10px] text-foreground/50 select-none">?</span>
              <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden w-60 -translate-x-1/2 rounded-xl border border-foreground/10 bg-background p-3 text-xs text-foreground/70 shadow-lg group-hover:block">
                <p className="mb-1.5"><span className="font-semibold text-foreground">Sublease</span> — renting out your place while you're away</p>
                <p className="mb-1.5"><span className="font-semibold text-foreground">Lease</span> — a standard rental where the new tenant signs directly</p>
                <p><span className="font-semibold text-foreground">Roommate</span> — looking for someone to share the space with you</p>
              </div>
            </div>
          </div>
          <select value={form.listing_type} onChange={set("listing_type")} className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground/40">
            {LISTING_TYPES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-foreground/60">Your role</label>
            <div className="group relative">
              <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-foreground/30 text-[10px] text-foreground/50 select-none">?</span>
              <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden w-60 -translate-x-1/2 rounded-xl border border-foreground/10 bg-background p-3 text-xs text-foreground/70 shadow-lg group-hover:block">
                <p className="mb-1"><span className="font-semibold text-foreground">Tenant</span> — you currently rent this space</p>
                <p className="mb-1"><span className="font-semibold text-foreground">Landlord</span> — you own the property</p>
                <p><span className="font-semibold text-foreground">Property Manager</span> — you manage on behalf of the owner</p>
              </div>
            </div>
          </div>
          <select value={form.poster_role} onChange={set("poster_role")} className="w-full rounded-xl border border-foreground/15 bg-background px-4 py-2.5 text-sm text-foreground outline-none focus:border-foreground/40">
            {POSTER_ROLES.map((t) => <option key={t}>{t}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Field label="Total bedrooms">
          <input className="focus:border-foreground/40" type="number" min={0} placeholder="0" value={form.total_bedroom_count || ""} onChange={setNum("total_bedroom_count")} />
        </Field>
        <Field label="Rooms available">
          <input className="focus:border-foreground/40" type="number" min={1} placeholder="1" value={form.rooms_available || ""} onChange={setNum("rooms_available")} />
        </Field>
        <Field label="Bathrooms">
          <input className="focus:border-foreground/40" type="number" min={1} step={0.5} placeholder="1" value={form.bathrooms || ""} onChange={setNum("bathrooms")} />
        </Field>
      </div>

      <TagSelector title="Amenities" options={amenities.map(({ value, label }) => ({ id: value, label }))} onChange={(amenities) => setForm((p) => ({ ...p, amenities }))} />

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setForm((p) => ({ ...p, furnished: !p.furnished }))}
          className={`h-6 w-11 rounded-full transition-colors relative ${form.furnished ? "bg-foreground" : "bg-foreground/20"}`}
        >
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all ${form.furnished ? "left-5" : "left-0.5"}`} />
        </div>
        <span className="text-sm text-foreground">Furnished</span>
      </label>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Current Roommates — optional</p>
            <p className="text-xs text-foreground/50">Add info about people already living there</p>
          </div>
          <button
            type="button"
            onClick={addRoommate}
            className="flex items-center gap-1.5 rounded-xl border border-foreground/15 bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-foreground/5"
          >
            <Plus size={13} />
            Add roommate
          </button>
        </div>

        {roommates.length > 0 && (
          <div className="flex flex-col gap-2">
            {roommates.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl border border-foreground/10 bg-background px-4 py-3"
              >
                <span className="text-xs text-foreground/40 w-4 shrink-0">{i + 1}</span>

                <div className="flex flex-1 items-center gap-3">
                  <div className="flex flex-col gap-0.5 w-24">
                    <label className="text-[10px] font-medium uppercase tracking-wide text-foreground/50">Age</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      placeholder="22"
                      value={r.age}
                      onChange={(e) => updateRoommate(i, "age", e.target.value)}
                      className="w-full rounded-lg border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-sm text-foreground outline-none focus:border-foreground/40"
                    />
                  </div>

                  <div className="flex flex-col gap-0.5 flex-1">
                    <label className="text-[10px] font-medium uppercase tracking-wide text-foreground/50">Gender</label>
                    <select
                      value={r.gender}
                      onChange={(e) => updateRoommate(i, "gender", e.target.value)}
                      className="w-full rounded-lg border border-foreground/15 bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:border-foreground/40"
                    >
                      {GENDER_OPTIONS.map((g) => (
                        <option key={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeRoommate(i)}
                  className="shrink-0 flex items-center justify-center rounded-lg p-1.5 text-foreground/30 transition-colors hover:bg-foreground/5 hover:text-foreground/60"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}