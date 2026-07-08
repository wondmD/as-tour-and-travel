"use client";

import { Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import { SelectField, SubmitButton, TextField, TextareaField } from "@/components/forms";
import { Checkbox, Label, toast } from "@/components/ui";
import { useCreateCustomTourRequest } from "@/lib/hooks/use-custom-tour-data";
import { DESTINATIONS } from "@/lib/mock/seed";
import { ALL_TRAVELERS } from "@/lib/mock/seed";
import { useSession } from "@/lib/stores/auth";

const schema = Yup.object({
  userId: Yup.string().required(),
  destinationIds: Yup.array().min(1),
  durationDays: Yup.number().min(1),
  travelerCount: Yup.number().min(1).required(),
  budgetUsd: Yup.number().min(0),
  notes: Yup.string(),
});

export default function AdminCreateCustomTourPage() {
  const router = useRouter();
  const session = useSession();
  const create = useCreateCustomTourRequest();
  const canEdit = useRequireRole(["admin", "staff"]);

  if (!canEdit) return null;

  return (
    <>
      <PageHeader
        title="Create custom tour"
        description="Build an itinerary on behalf of a traveler — they receive a confirmed request to review."
      />
      <Formik
        initialValues={{
          userId: ALL_TRAVELERS[0]?.id ?? "",
          destinationIds: [] as string[],
          durationDays: "7",
          travelerCount: 2,
          budgetUsd: "",
          notes: "",
        }}
        validationSchema={schema}
        onSubmit={async (values, { setSubmitting }) => {
          const traveler = ALL_TRAVELERS.find((t) => t.id === values.userId);
          if (!traveler) return;
          const req = await create.mutateAsync({
            userId: traveler.id,
            customerName: traveler.fullName,
            destinationIds: values.destinationIds,
            durationDays: Number(values.durationDays),
            travelerCount: values.travelerCount,
            budgetUsd: values.budgetUsd ? Number(values.budgetUsd) : undefined,
            notes: values.notes || undefined,
            createdByStaff: true,
            assignedStaffName: session?.user.fullName,
          });
          toast.success(`Created ${req.reference}`);
          router.push(`/admin/custom-tours/${req.id}`);
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="max-w-xl space-y-4">
            <SelectField
              name="userId"
              label="Traveler"
              options={ALL_TRAVELERS.map((t) => ({
                value: t.id,
                label: `${t.fullName} (${t.email})`,
              }))}
              required
            />
            <div>
              <Label className="mb-2">Destinations</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {DESTINATIONS.filter((d) => d.status === "published").map((d) => (
                  <label
                    key={d.id}
                    className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                  >
                    <Checkbox
                      checked={values.destinationIds.includes(d.id)}
                      onCheckedChange={(v) => {
                        setFieldValue(
                          "destinationIds",
                          v
                            ? [...values.destinationIds, d.id]
                            : values.destinationIds.filter((x) => x !== d.id),
                        );
                      }}
                    />
                    {d.name}
                  </label>
                ))}
              </div>
            </div>
            <TextField name="durationDays" label="Duration (days)" type="number" />
            <TextField name="travelerCount" label="Travelers" type="number" required />
            <TextField name="budgetUsd" label="Quoted budget USD" type="number" />
            <TextareaField name="notes" label="Itinerary notes for traveler" />
            <SubmitButton>Create custom tour</SubmitButton>
          </Form>
        )}
      </Formik>
    </>
  );
}
