import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { updatePost, updatePostDetails, replaceRoommates, uploadPostPhoto, deletePostPhoto, updatePhotoOrder } from "@/shared/api/backendGO/endpoints";
import { backendHooks } from "@/shared/api/backendGO/hooks";
import { type Step, type FormState, initialFormState, steps } from "@/shared";
import type { RoommateEntry } from "./steps/DetailsStep";
import type { PhotoSlot } from "./steps/PhotosStep";

const editSteps = steps;

export function useEditListingForm(postId: number) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<Step>("basics");
  const [form, setForm] = useState<FormState>(initialFormState);
  const [roommates, setRoommates] = useState<RoommateEntry[]>([]);
  const [photoSlots, setPhotoSlots] = useState<PhotoSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: existingRoommates } = backendHooks.useRoommates({ post_id: postId });

  useEffect(() => {
    if (existingRoommates) {
      setRoommates(
        existingRoommates.map((r) => ({
          age: String(r.age),
          gender: r.gender,
        }))
      );
    }
  }, [existingRoommates]);

  const initForm = (post: Partial<FormState>) => {
    setForm((prev) => ({ ...prev, ...post }));
  };

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : e.target.value;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const setNum = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [field]: Number(e.target.value) }));

  const stepIndex = editSteps.findIndex((s) => s.id === step);
  const isLast = stepIndex === editSteps.length - 1;

  const back = () => {
    setError(null);
    if (stepIndex > 0) setStep(editSteps[stepIndex - 1].id);
  };

  const next = () => {
    setError(null);
    if (!isLast) setStep(editSteps[stepIndex + 1].id);
  };

  const handleSave = async (originalServerPhotoIds: number[]) => {
    if (photoSlots.length < 5) {
      setError("At least 5 photos are required.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await updatePost(postId, {
        address: form.address,
        city: form.city,
        state: form.state.toUpperCase(),
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
        security_deposit: form.security_deposit ? String(form.security_deposit) : undefined,
        start_date: form.start_date.slice(0, 10),
        end_date: form.end_date.slice(0, 10),
        property_website: form.property_website || undefined,
        status: "active",
      });

      await updatePostDetails(postId, {
        title: form.title,
        amenities: form.amenities || undefined,
        house_rules: form.house_rules || undefined,
      });

      await replaceRoommates({
        post_id: postId,
        roommates: roommates.map((r) => ({
          age: parseInt(r.age) || 1,
          gender: r.gender,
        })),
      });

      const keptIds = new Set(
        photoSlots
          .filter((s): s is Extract<PhotoSlot, { kind: "existing" }> => s.kind === "existing")
          .map((s) => s.id)
      );
      await Promise.all(
        originalServerPhotoIds.filter((id) => !keptIds.has(id)).map((id) => deletePostPhoto(postId, id))
      );

      for (let i = 0; i < photoSlots.length; i++) {
        const slot = photoSlots[i];
        const order = i + 1;
        if (slot.kind === "new") {
          await uploadPostPhoto(postId, slot.file, order);
        } else {
          await updatePhotoOrder(postId, slot.id, order);
        }
      }

      await queryClient.invalidateQueries({ queryKey: ["useActivePosts"] });
      await queryClient.invalidateQueries({ queryKey: ["usePosts"] });
      await queryClient.invalidateQueries({ queryKey: ["usePostsByUser"] });
      await queryClient.invalidateQueries({ queryKey: ["usePostByID", postId] });
      await queryClient.invalidateQueries({ queryKey: ["useRoommates", postId] });
      await queryClient.invalidateQueries({ queryKey: ["usePhotosByPostID", postId] });

      navigate("/listings/" + postId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  return {
    step, setStep,
    form, setForm,
    set, setNum,
    roommates, setRoommates,
    photoSlots, setPhotoSlots,
    stepIndex, isLast,
    back, next,
    handleSave,
    loading, error,
    initForm,
  };
}