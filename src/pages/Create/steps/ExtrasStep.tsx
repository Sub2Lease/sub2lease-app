import { Field } from "../Field";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { FormState } from "@/shared/types";
import { processAndCompressImages } from "@/shared/utils";

interface Props {
  form: FormState;
  set: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  photos: File[];
  setPhotos: Dispatch<SetStateAction<File[]>>;
}

const FILE_LIMIT = 10;

export function ExtrasStep({ form, set, photos, setPhotos }: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const previews = photos.map((f) => URL.createObjectURL(f));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = await processAndCompressImages(e.target.files);

    const successfulFiles = files.filter((res) => res.status === 'fulfilled').map(({ value }) => value);

    if (successfulFiles.length !== files.length) alert("Some files failed to process and were not added!");
    if (!successfulFiles.length) return;

    if (successfulFiles.length + photos.length > FILE_LIMIT) {
      alert(`You can upload a maximum of ${FILE_LIMIT} photos.`);
    }
    setPhotos((prev) => [...prev, ...successfulFiles].slice(0, FILE_LIMIT));
  };

  const handleDragStart = (i: number) => setDragIndex(i);

  const handleDrop = (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    const newPhotos = [...photos];
    const newPreviews = [...previews];
    newPhotos.splice(i, 0, newPhotos.splice(dragIndex, 1)[0]);
    newPreviews.splice(i, 0, newPreviews.splice(dragIndex, 1)[0]);
    setPhotos(newPhotos);
    setDragIndex(null);
  };

  const removePhoto = (i: number) => {
    const newPhotos = photos.filter((_, idx) => idx !== i);
    setPhotos(newPhotos);
  };

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-foreground">Extra info</h2>

      <Field label="Photos (min 5, drag to reorder)">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        {photos.length > 0 && (
          <p className="mt-1 text-xs text-foreground/50">
            {photos.length} photo{photos.length > 1 ? "s" : ""} selected
            {photos.length < 5 && ` — ${5 - photos.length} more needed`}
          </p>
        )}
      </Field>

      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {previews.map((src, i) => (
            <div
              key={src}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              className={`relative cursor-grab rounded-xl bg-background overflow-hidden border-2 transition-colors ${
                dragIndex === i ? "border-foreground/40 opacity-50" : "border-transparent"
              }`}
            >
              <img src={src} className="w-full aspect-square object-cover" />
              <div className="absolute top-1 left-2 px-2 text-lg rounded-full font-bold text-foreground/75 bg-background">
                {i + 1}
              </div>
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-foreground/60 text-white text-md font-bold hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <Field label="Property website — optional">
        <input placeholder="https://..." value={form.property_website} onChange={set("property_website")} />
      </Field>
      <Field label="Amenities — optional">
        <textarea rows={3} placeholder="Gym, parking, rooftop, in-unit laundry..." value={form.amenities} onChange={set("amenities")} />
      </Field>
      <Field label="House rules — optional">
        <textarea rows={3} placeholder="No smoking, no pets, quiet hours after 10pm..." value={form.house_rules} onChange={set("house_rules")} />
      </Field>
    </div>
  );
}