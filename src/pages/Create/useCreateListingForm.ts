import { useState } from "react";
import { useNavigate } from "react-router";
import { createPost } from "@/shared/api/backendGO/endpoints";
import { uploadPostPhoto } from "@/shared/api/backendGO/endpoints";
import { type Step, type FormState, STEPS, initialFormState } from "./types";
import { US_STATES } from "./constants";

export function useCreateListingForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("basics");
  const [form, setForm] = useState<FormState>(initialFormState);
  const [photos, setPhotos] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof FormState) =>
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

  const back = () => {
    setError(null);
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id);
  };

  const validateBasics = () => {
    if (!form.title.trim()) return "Listing title is required.";
    if (!form.address.trim()) return "Address is required.";
    if (!form.city.trim()) return "City is required.";
    if (!form.state.trim()) return "State is required.";
    if (!US_STATES.includes(form.state.trim().toUpperCase())) return "Please enter a valid 2-letter US state (e.g. WI).";
    if (!form.zipcode.trim()) return "Zipcode is required.";
    if (!/^\d{5}$/.test(form.zipcode.trim())) return "Zipcode must be a 5-digit number.";
    if (!form.country.trim()) return "Country is required.";
    if (!form.description.trim()) return "Description is required.";
    return null;
  };

  const validateDetails = () => {
    if (!form.property_type) return "Property type is required.";
    if (!form.listing_type) return "Listing type is required.";
    if (!form.poster_role) return "Your role is required.";
    if (!form.total_bedroom_count || form.total_bedroom_count < 1) return "Total bedroom count is required.";
    if (!form.rooms_available || form.rooms_available < 1) return "Rooms available is required.";
    if (!form.bathrooms || form.bathrooms < 1) return "Bathrooms is required.";
    return null;
  };

  const validateDates = () => {
    if (!form.start_date) return "Start date is required.";
    if (!form.end_date) return "End date is required.";
    if (form.end_date <= form.start_date) return "End date must be after start date.";
    if (!form.monthly_rent) return "Monthly rent is required.";
    return null;
  };

  const validateExtras = () => {
    if (photos.length < 5) return "At least 5 photos are required.";
    return null;
  };

  const next = () => {
    setError(null);
    if (step === "basics") { const err = validateBasics(); if (err) { setError(err); return; } }
    if (step === "details") { const err = validateDetails(); if (err) { setError(err); return; } }
    if (step === "dates") { const err = validateDates(); if (err) { setError(err); return; } }
    if (!isLast) setStep(STEPS[stepIndex + 1].id);
  };

  const handleComplete = async () => {
    const err = validateExtras();
    if (err) { setError(err); return; }
    setError(null);
    setLoading(true);
    try {
      const post = await createPost({
        title: form.title,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        zipcode: form.zipcode,
        description: form.description,
        property_type: form.property_type,
        listing_type: form.listing_type,
        poster_role: form.poster_role,
        furnished: form.furnished,
        total_bedroom_count: form.total_bedroom_count,
        rooms_available: form.rooms_available,
        bathrooms: form.bathrooms,
        monthly_rent: form.monthly_rent,
        start_date: form.start_date,
        end_date: form.end_date,
        status: "active",
        security_deposit: form.security_deposit ? Number(form.security_deposit) : null,
        property_website: form.property_website || null,
        amenities: form.amenities || null,
        house_rules: form.house_rules || null,
      });
      for (let i = 0; i < photos.length; i++) {
        await uploadPostPhoto(post.id, photos[i]);
      }
      navigate("/listings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  return {
    step, setStep,
    form, setForm,
    set, setNum,
    photos, setPhotos,
    stepIndex, isLast,
    back, next, handleComplete,
    loading, error,
  };
}