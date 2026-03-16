import { Field } from "../Field";
import { PROPERTY_TYPES, LISTING_TYPES, POSTER_ROLES } from "../constants";
import type { FormState } from "../types";

interface Props {
  form: FormState;
  set: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setNum: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}

export function DetailsStep({ form, set, setNum, setForm }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-foreground">Property details</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-foreground/50">Property type</label>
            <div className="group relative">
              <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-foreground/30 text-[10px] text-foreground/50">?</span>
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
            <label className="text-xs font-medium uppercase tracking-wide text-foreground/50">Listing type</label>
            <div className="group relative">
              <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-foreground/30 text-[10px] text-foreground/50">?</span>
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
            <label className="text-xs font-medium uppercase tracking-wide text-foreground/50">Your role</label>
            <div className="group relative">
              <span className="flex h-4 w-4 cursor-default items-center justify-center rounded-full border border-foreground/30 text-[10px] text-foreground/50">?</span>
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
          <input type="number" min={0} placeholder="0" value={form.total_bedroom_count || ""} onChange={setNum("total_bedroom_count")} />
        </Field>
        <Field label="Rooms available">
          <input type="number" min={1} placeholder="1" value={form.rooms_available || ""} onChange={setNum("rooms_available")} />
        </Field>
        <Field label="Bathrooms">
          <input type="number" min={1} step={0.5} placeholder="1" value={form.bathrooms || ""} onChange={setNum("bathrooms")} />
        </Field>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setForm((p) => ({ ...p, furnished: !p.furnished }))}
          className={`h-6 w-11 rounded-full transition-colors relative ${form.furnished ? "bg-foreground" : "bg-foreground/20"}`}
        >
          <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition-all ${form.furnished ? "left-5" : "left-0.5"}`} />
        </div>
        <span className="text-sm text-foreground">Furnished</span>
      </label>
    </div>
  );
}