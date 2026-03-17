import { STEPS } from "./types";
import { useCreateListingForm } from "./useCreateListingForm";
import { BasicsStep } from "./steps/BasicsStep";
import { DetailsStep } from "./steps/DetailsStep";
import { DatesStep } from "./steps/DatesStep";
import { ExtrasStep } from "./steps/ExtrasStep";

export function CreateListing() {
  const { step, setStep, form, setForm, set, setNum, photos, setPhotos, stepIndex, isLast, back, next, handleComplete, loading, error } = useCreateListingForm();

  return (
    <div className="mx-auto w-full max-w-2xl py-8">
      <div className="mb-10 flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
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

      <form onSubmit={(e) => { e.preventDefault(); next(); }}>
        <div className="rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm p-8">
          {step === "basics" && <BasicsStep form={form} set={set} />}
          {step === "details" && <DetailsStep form={form} set={set} setNum={setNum} setForm={setForm} />}
          {step === "dates" && <DatesStep form={form} set={set} />}
          {step === "extras" && (
            <ExtrasStep form={form} set={set} photos={photos} setPhotos={setPhotos} />
          )}

          {error && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={back}
              disabled={stepIndex === 0}
              className="rounded-full border border-foreground/30 px-6 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/10 disabled:opacity-0"
            >
              Back
            </button>
            {isLast ? (
              <button
                type="button"
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
