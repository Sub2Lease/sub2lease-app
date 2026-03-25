import { Field } from "../Field";
import type { FormState } from "@/shared/types";

interface Props {
  form: FormState;
  set: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function BasicsStep({ form, set }: Props) {
  return (
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
            <input value="US" disabled className="w-full rounded-xl border border-foreground/15 bg-foreground/5 px-4 py-2.5 text-sm text-foreground/40 cursor-not-allowed" />
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
  );
}