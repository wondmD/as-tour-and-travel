"use client";

import { useState } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  SubmitButton,
  TextField,
  SelectField,
} from "@/components/forms";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Dialog,
  EmptyState,
  Spinner,
  toast,
} from "@/components/ui";
import {
  useDeleteTraveler,
  useSavedTravelers,
  useSaveTraveler,
} from "@/lib/hooks/use-travel-data";
import type { SavedTraveler } from "@/lib/types";

const schema = Yup.object({
  fullName: Yup.string().required("Name is required"),
  dateOfBirth: Yup.string().required("Date of birth is required"),
  nationality: Yup.string().required("Nationality is required"),
  relationship: Yup.string().required("Relationship is required"),
  gender: Yup.string(),
  passportNumber: Yup.string(),
});

export default function SavedTravelersPage() {
  const { data, isLoading } = useSavedTravelers();
  const saveTraveler = useSaveTraveler();
  const deleteTraveler = useDeleteTraveler();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SavedTraveler | null>(null);

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (t: SavedTraveler) => {
    setEditing(t);
    setOpen(true);
  };

  return (
    <>
      <PageHeader
        title="Saved travelers"
        description="Family and companions — prefill booking forms in one click."
        actions={
          <Button size="sm" onClick={openNew}>
            <Plus className="size-4" /> Add traveler
          </Button>
        }
      />

      {isLoading ? (
        <Spinner label="Loading travelers…" />
      ) : !data?.length ? (
        <EmptyState
          title="No saved travelers yet"
          description="Add companions to speed up group bookings."
          action={<Button size="sm" onClick={openNew}>Add traveler</Button>}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((t) => (
            <Card key={t.id} static>
              <CardContent className="flex items-start gap-3">
                <Avatar name={t.fullName} />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-text-primary">{t.fullName}</p>
                  <p className="text-xs text-text-secondary">
                    {t.relationship} · {t.nationality} · DOB {t.dateOfBirth}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" aria-label="Edit" onClick={() => openEdit(t)}>
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Delete"
                    onClick={async () => {
                      await deleteTraveler.mutateAsync(t.id);
                      toast.success("Traveler removed");
                    }}
                  >
                    <Trash2 className="size-4 text-danger" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={setOpen}
        title={editing ? "Edit traveler" : "Add traveler"}
        footer={null}
      >
        <Formik
          enableReinitialize
          initialValues={{
            id: editing?.id,
            fullName: editing?.fullName ?? "",
            dateOfBirth: editing?.dateOfBirth ?? "",
            nationality: editing?.nationality ?? "",
            relationship: editing?.relationship ?? "",
            gender: editing?.gender ?? "",
            passportNumber: editing?.passportNumber ?? "",
          }}
          validationSchema={schema}
          onSubmit={async (values, { resetForm }) => {
            await saveTraveler.mutateAsync({
              id: values.id,
              fullName: values.fullName,
              dateOfBirth: values.dateOfBirth,
              nationality: values.nationality,
              relationship: values.relationship,
              gender: values.gender as SavedTraveler["gender"],
              passportNumber: values.passportNumber || undefined,
            });
            toast.success(editing ? "Traveler updated" : "Traveler added");
            resetForm();
            setOpen(false);
          }}
        >
          <Form className="space-y-4">
            <TextField name="fullName" label="Full name" required />
            <TextField name="dateOfBirth" label="Date of birth" type="date" required />
            <TextField name="nationality" label="Nationality" required />
            <TextField name="relationship" label="Relationship" required placeholder="Spouse, child, friend…" />
            <SelectField
              name="gender"
              label="Gender"
              placeholder="Optional"
              options={[
                { value: "female", label: "Female" },
                { value: "male", label: "Male" },
                { value: "other", label: "Other" },
              ]}
            />
            <TextField name="passportNumber" label="Passport (optional)" />
            <SubmitButton fullWidth>{editing ? "Save changes" : "Add traveler"}</SubmitButton>
          </Form>
        </Formik>
      </Dialog>
    </>
  );
}
