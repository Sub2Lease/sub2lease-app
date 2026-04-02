import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useCallback, useRef } from "react";
import { steps } from "@/shared";
import { useEditListingForm } from "./useEditListingForm";
import { BasicsStep } from "./steps/BasicsStep";
import { DetailsStep } from "./steps/DetailsStep";
import { DatesStep } from "./steps/DatesStep";
import { useListings } from "@/shared/hooks";

export const LISTING_PARAM = "listingId";

export function EditListing() {
  const { [LISTING_PARAM]: listingId } = useParams();
  const navigate = useNavigate();
  const { getListingById } = useListings();
  const listing = getListingById(listingId || "");
  const postId = listing?.id ?? 0;

  const {
    step, setStep,
    form, setForm,
    set, setNum,
    roommates, setRoommates,
    back, next,
    handleSave,
    loading, error,
    initForm,
  } = useEditListingForm(postId);

  const stableInitForm = useCallback(initForm, []); // eslint-disable-line react-hooks/exhaustive-deps

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!listing || hasInitialized.current) return;
    hasInitialized.current = true;
    stableInitForm({
      title: listing.title ?? "",
      address: listing.address ?? "",
      city: listing.city ?? "",
      state: listing.state ?? "",
      country: listing.country ?? "US",
      zipcode: listing.zipcode ?? "",
      description: listing.description ?? "",
      property_type: listing.property_type ?? "Apartment",
      listing_type: listing.listing_type ?? "Sublease",
      poster_role: listing.poster_role ?? "Tenant",
      furnished: listing.furnished ?? false,
      total_bedroom_count: listing.total_bedroom_count ?? 1,
      rooms_available: listing.rooms_available ?? 1,
      bathrooms: listing.bathrooms ?? 1,
      monthly_rent: listing.monthly_rent ?? "",
      security_deposit: listing.security_deposit?.String ?? listing.security_deposit ?? "",
      start_date: listing.start_date?.slice(0, 10) ?? "",
      end_date: listing.end_date?.slice(0, 10) ?? "",
      property_website: listing.property_website?.String ?? listing.property_website ?? "",
      amenities: listing.amenities?.String ?? listing.amenities ?? "",
      house_rules: listing.house_rules?.String ?? listing.house_rules ?? "",
    });
  }, [listing, stableInitForm]);

  if (!listing) {
    return (
      <div className="flex items-center justify-center h-40 text-foreground/40">
        Loading listing…
      </div>
    );
  }

  const editSteps = steps.filter((s) => s.id !== "extras");
  const editStepIndex = editSteps.findIndex((s) => s.id === step);
  const isEditLast = editStepIndex === editSteps.length - 1;

  return (
    <div className="mx-auto w-full max-w-2xl overflow-y-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Edit Listing</h1>
        <button
          type="button"
          onClick={() => navigate("/listings/" + listingId)}
          className="text-sm text-foreground/50 hover:text-foreground transition-colors"
        >
          ✕ Cancel
        </button>
      </div>

      {/* Step indicators */}
      <div className="mb-10 flex items-center gap-2">
        {editSteps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => i < editStepIndex && setStep(s.id)}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                s.id === step
                  ? "bg-foreground text-background"
                  : i < editStepIndex
                  ? "bg-foreground/30 text-foreground cursor-pointer"
                  : "bg-foreground/10 text-foreground/40"
              }`}
            >
              {i + 1}
            </button>
            <span className={`text-sm ${s.id === step ? "text-foreground" : "text-foreground/40"}`}>
              {s.label}
            </span>
            {i < editSteps.length - 1 && <div className="mx-2 h-px w-6 bg-foreground/20" />}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-foreground/10 bg-foreground/5 backdrop-blur-sm p-8">
        {step === "basics" && <BasicsStep form={form} set={set} />}
        {step === "details" && (
          <DetailsStep
            form={form}
            set={set}
            setNum={setNum}
            setForm={setForm}
            roommates={roommates}
            setRoommates={setRoommates}
          />
        )}
        {step === "dates" && <DatesStep form={form} set={set} />}

        {error && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={back}
            disabled={editStepIndex === 0}
            className="rounded-full border border-foreground/30 px-6 py-2.5 text-sm text-foreground transition-colors hover:bg-foreground/10 disabled:opacity-0"
          >
            Back
          </button>
          {isEditLast ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="rounded-full bg-foreground px-8 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              {loading ? "Saving…" : "Save changes"}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="rounded-full bg-foreground px-8 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-80"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}