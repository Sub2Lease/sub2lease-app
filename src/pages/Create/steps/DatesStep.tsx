import { Field } from "../Field";
import type { FormState } from "@/shared/types";

interface Props {
  form: FormState;
  set: (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export function DatesStep({ form, set }: Props) {
  return (
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
  );
}