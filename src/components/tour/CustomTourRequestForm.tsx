"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { SubmitButton, TextField, TextareaField } from "@/components/forms";
import { Checkbox, Label, toast } from "@/components/ui";
import { useCreateCustomTourRequest } from "@/lib/hooks/use-custom-tour-data";
import { DESTINATIONS } from "@/lib/mock/seed";
import { useSession } from "@/lib/stores/auth";

const schema = Yup.object({
  destinationIds: Yup.array().min(1, "Select at least one destination"),
  preferredStartDate: Yup.string(),
  preferredEndDate: Yup.string(),
  durationDays: Yup.number().min(1).max(30),
  travelerCount: Yup.number().min(1).max(30).required(),
  budgetUsd: Yup.number().min(0),
  notes: Yup.string().max(2000),
});

interface FormValues {
  destinationIds: string[];
  preferredStartDate: string;
  preferredEndDate: string;
  durationDays: string;
  travelerCount: number;
  budgetUsd: string;
  notes: string;
}

export function CustomTourRequestForm() {
  const session = useSession();
  const router = useRouter();
  const create = useCreateCustomTourRequest();

  if (!session) {
    return (
      <p className="text-sm text-text-secondary">
        Please{" "}
        <a href="/auth/login?redirect=/tours/request" className="font-medium text-primary">
          sign in
        </a>{" "}
        to submit a custom tour request.
      </p>
    );
  }

  return (
    <Formik<FormValues>
      initialValues={{
        destinationIds: [],
        preferredStartDate: "",
        preferredEndDate: "",
        durationDays: "",
        travelerCount: 2,
        budgetUsd: "",
        notes: "",
      }}
      validationSchema={schema}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const req = await create.mutateAsync({
            destinationIds: values.destinationIds,
            preferredStartDate: values.preferredStartDate || undefined,
            preferredEndDate: values.preferredEndDate || undefined,
            durationDays: values.durationDays ? Number(values.durationDays) : undefined,
            travelerCount: values.travelerCount,
            budgetUsd: values.budgetUsd ? Number(values.budgetUsd) : undefined,
            notes: values.notes || undefined,
          });
          toast.success("Request submitted");
          router.push(`/account/custom-tours/${req.reference}`);
        } catch {
          toast.error("Could not submit request");
        }
        setSubmitting(false);
      }}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form className="glass-card space-y-5 p-6">
          <div>
            <Label className="mb-2">Destinations *</Label>
            <div className="grid gap-2 sm:grid-cols-2">
              {DESTINATIONS.filter((d) => d.status === "published").map((d) => {
                const checked = values.destinationIds.includes(d.id);
                return (
                  <label
                    key={d.id}
                    className="flex cursor-pointer items-center gap-2 rounded-xl border border-border/80 px-3 py-2 text-sm hover:bg-primary/4"
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={(v) => {
                        const next = v
                          ? [...values.destinationIds, d.id]
                          : values.destinationIds.filter((x) => x !== d.id);
                        setFieldValue("destinationIds", next);
                      }}
                    />
                    {d.name}
                  </label>
                );
              })}
            </div>
            {touched.destinationIds && errors.destinationIds && (
              <p className="mt-1 text-xs text-danger">{String(errors.destinationIds)}</p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField name="preferredStartDate" label="Preferred start" type="date" />
            <TextField name="preferredEndDate" label="Preferred end" type="date" />
            <TextField name="durationDays" label="Duration (days)" type="number" />
            <TextField name="travelerCount" label="Travelers" type="number" required />
            <TextField name="budgetUsd" label="Budget (USD, optional)" type="number" />
          </div>

          <TextareaField
            name="notes"
            label="Tell us about your ideal trip"
            hint="Interests, pace, accessibility, dietary needs…"
          />

          <SubmitButton fullWidth>Submit custom tour request</SubmitButton>
        </Form>
      )}
    </Formik>
  );
}
