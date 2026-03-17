import { Field } from "../Field";
import type { FormState } from "../types";

interface Props {
  form: FormState;
  set: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  photos: File[];
  setPhotos: (photos: File[]) => void;
}

export function ExtrasStep({ form, set, photos, setPhotos }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-foreground">Extra info</h2>
      <Field label="Photos">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setPhotos(Array.from(e.target.files || []))}
        />
        {photos.length > 0 && (
          <p className="mt-1 text-xs text-foreground/50">
            {photos.length} photo{photos.length > 1 ? "s" : ""} selected
            {photos.length < 5 && ` — ${5 - photos.length} more needed`}
          </p>
        )}
      </Field>
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