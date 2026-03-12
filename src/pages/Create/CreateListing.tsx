import { useState } from "react";
import { useNavigate } from "react-router";
import { createPost } from "@/shared/api/backendGO/endpoints";

type Step = "basics" | "details" | "dates" | "extras";

const STEPS: { id: Step; label: string }[] = [
  { id: "basics", label: "Basics" },
  { id: "details", label: "Details" },
  { id: "dates", label: "Dates & Price" },
  { id: "extras", label: "Extras" },
];

const PROPERTY_TYPES = ["Apartment", "House", "Condo", "Studio", "Townhouse", "Dorm"];
const LISTING_TYPES = ["Sublease", "Roommate", "Short-term"];
const POSTER_ROLES = ["Tenant", "Landlord", "Property Manager"];

interface FormState {
  title: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  description: string;
  property_type: string;
  listing_type: string;
  poster_role: string;
  furnished: boolean;
  total_bedroom_count: number;
  rooms_available: number;
  bathrooms: number;
  monthly_rent: string;
  security_deposit: string;
  start_date: string;
  end_date: string;
  property_website: string;
  amenities: string;
  house_rules: string;
}

const initial: FormState = {
  title: "",
  address: "",
  city: "",
  state: "",
  country: "US",
  zipcode: "",
  description: "",
  property_type: "Apartment",
  listing_type: "Sublease",
  poster_role: "Tenant",
  furnished: false,
  total_bedroom_count: 1,
  rooms_available: 1,
  bathrooms: 1,
  monthly_rent: "",
  security_deposit: "",
  start_date: "",
  end_date: "",
  property_website: "",
  amenities: "",
  house_rules: "",
};

export function CreateListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("basics");
  const [form, setForm] = useState<FormState>(initial);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const   set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const setNum = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }));

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const isLast = stepIndex === STEPS.length - 1;

  const next = () => !isLast && setStep(STEPS[stepIndex + 1].id);
  const back = () => stepIndex > 0 && setStep(STEPS[stepIndex - 1].id);

  const handleComplete = async () => {
    setError(null);
    setLoading(true);
    try {
      await createPost({
        ...form,
        security_deposit: form.security_deposit ? Number(form.security_deposit) : undefined,
        property_website: form.property_website || undefined,
        amenities: form.amenities || undefined,
        house_rules: form.house_rules || undefined,
        status: "active",
      });
      navigate("/listings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl py-8">

      {/* Step indicator */}
      <div className="mb-10 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              onClick={() => i < stepIndex && setStep(s.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                s.id === step
                  ? "bg-foreground text-background"
                  : i < stepIndex
                  ? "bg-foreground/30 text-foreground cursor-pointer"
                  : "bg-foreground/10 text-foreground/40"
              }`}
            >
              {i + 1}
            </button>
            <span className={`text-sm ${s.id === step ? "text-foreground" : "text-foreground/40"}`}>
              {s.label}
            </span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px w-6 bg-foreground/20" />}
          </div>
        ))}
      </div>

      {/* Card */}
      <form onSubmit={(e) => {
        e.preventDefault();
        next();
      }}>
        <div className="rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm p-8">

          {/* ── Basics ─────────────────────────────────────────────────── */}
          {step === "basics" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-foreground">About the place</h2>
              <Field label="Listing title">
                <input required placeholder="e.g. Cozy studio near Langdon St" value={form.title} onChange={set("title")} />
              </Field>
              <Field label="Address">
                <input required placeholder="Street address" value={form.address} onChange={set("address")} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City">
                  <input required placeholder="Madison" value={form.city} onChange={set("city")} />
                </Field>
                <Field label="State">
                  <input required placeholder="WI" value={form.state} onChange={set("state")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Zipcode">
                  <input required placeholder="53703" value={form.zipcode} onChange={set("zipcode")} />
                </Field>
                <Field label="Country">
                  <input required placeholder="US" value={form.country} onChange={set("country")} />
                </Field>
              </div>
              <Field label="Description">
                <textarea
                  rows={4}
                  placeholder="Describe the space, neighborhood, vibe..."
                  value={form.description}
                  onChange={set("description")}
                />
              </Field>
            </div>
          )}

          {/* ── Details ────────────────────────────────────────────────── */}
          {step === "details" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-foreground">Property details</h2>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Property type">
                  <select value={form.property_type} onChange={set("property_type")}>
                    {PROPERTY_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Listing type">
                  <select value={form.listing_type} onChange={set("listing_type")}>
                    {LISTING_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Your role">
                  <select value={form.poster_role} onChange={set("poster_role")}>
                    {POSTER_ROLES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Field label="Total bedrooms">
                  <input type="number" min={0} value={form.total_bedroom_count} onChange={setNum("total_bedroom_count")} />
                </Field>
                <Field label="Rooms available">
                  <input type="number" min={1} value={form.rooms_available} onChange={setNum("rooms_available")} />
                </Field>
                <Field label="Bathrooms">
                  <input type="number" min={1} step={0.5} value={form.bathrooms} onChange={setNum("bathrooms")} />
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
          )}

          {/* ── Dates & Price ───────────────────────────────────────────── */}
          {step === "dates" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-foreground">Dates & pricing</h2>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date">
                  <input type="date" value={form.start_date} onChange={set("start_date")} />
                </Field>
                <Field label="End date">
                  <input type="date" value={form.end_date} onChange={set("end_date")} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Monthly rent ($)">
                  <input type="number" placeholder="1200" value={form.monthly_rent} onChange={set("monthly_rent")} />
                </Field>
                <Field label="Security deposit ($) — optional">
                  <input type="number" placeholder="500" value={form.security_deposit} onChange={set("security_deposit")} />
                </Field>
              </div>
            </div>
          )}

          {/* ── Extras ─────────────────────────────────────────────────── */}
          {step === "extras" && (
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-semibold text-foreground">Extra info</h2>
              <Field label="Property website — optional">
                <input placeholder="https://..." value={form.property_website} onChange={set("property_website")} />
              </Field>
              <Field label="Amenities — optional">
                <textarea rows={3} placeholder="Gym, parking, rooftop, in-unit laundry..." value={form.amenities} onChange={set("amenities")} />
              </Field>
              <Field label="House rules — optional">
                <textarea rows={3} placeholder="No smoking, no pets, quiet hours after 10pm..." value={form.house_rules} onChange={set("house_rules")} />
              </Field>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          )}

          {/* ── Navigation ─────────────────────────────────────────────── */}
          <div className="mt-8 flex justify-between">
            <button
              onClick={back}
              disabled={stepIndex === 0}
              className="rounded-full border border-foreground/30 px-6 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/10 disabled:opacity-0"
            >
              Back
            </button>

            {isLast ? (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="rounded-full bg-foreground px-8 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-40"
              >
                {loading ? "Publishing…" : "Publish listing"}
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-full bg-foreground px-8 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

// ── Field wrapper ────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium uppercase tracking-wide text-foreground/50">
        {label}
      </label>
      <div className="[&>input]:w-full [&>input]:rounded-xl [&>input]:border [&>input]:border-foreground/15 [&>input]:bg-background [&>input]:px-4 [&>input]:py-2.5 [&>input]:text-sm [&>input]:text-foreground [&>input]:outline-none [&>input]:placeholder:text-foreground/30 [&>input]:focus:border-foreground/40 [&>input]:transition-colors [&>select]:w-full [&>select]:rounded-xl [&>select]:border [&>select]:border-foreground/15 [&>select]:bg-background [&>select]:px-4 [&>select]:py-2.5 [&>select]:text-sm [&>select]:text-foreground [&>select]:outline-none [&>select]:focus:border-foreground/40 [&>textarea]:w-full [&>textarea]:rounded-xl [&>textarea]:border [&>textarea]:border-foreground/15 [&>textarea]:bg-background [&>textarea]:px-4 [&>textarea]:py-2.5 [&>textarea]:text-sm [&>textarea]:text-foreground [&>textarea]:outline-none [&>textarea]:placeholder:text-foreground/30 [&>textarea]:focus:border-foreground/40 [&>textarea]:transition-colors [&>textarea]:resize-none">
        {children}
      </div>
    </div>
  );
}