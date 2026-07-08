"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Plus } from "lucide-react";
import {
  SelectField,
  SubmitButton,
  TextField,
} from "@/components/forms";
import { Button, Dialog, toast } from "@/components/ui";
import { useAddTourExpense } from "@/lib/hooks/use-travel-data";
import { EXPENSE_CATEGORY_LABELS } from "@/lib/tour-finance";
import type { TourExpenseCategory } from "@/lib/types";

const schema = Yup.object({
  category: Yup.string().required("Required"),
  description: Yup.string().required("Required").min(3),
  amountUsd: Yup.number().transform((v, o) => (o === "" ? undefined : Number(o))).min(1).required("Required"),
  date: Yup.string().required("Required"),
  vendor: Yup.string(),
  status: Yup.string().required(),
});

const CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORY_LABELS).map(
  ([value, label]) => ({ value, label }),
);

interface TourExpenseDialogProps {
  tourId: string;
  disabled?: boolean;
}

export function TourExpenseDialog({ tourId, disabled }: TourExpenseDialogProps) {
  const [open, setOpen] = useState(false);
  const addExpense = useAddTourExpense();

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button size="sm" disabled={disabled}>
          <Plus className="size-4" /> Add expense
        </Button>
      }
      title="Record expense"
      description="Track operational costs against this tour's budget."
      size="lg"
    >
      <Formik
        initialValues={{
          category: "transport" as TourExpenseCategory,
          description: "",
          amountUsd: "",
          date: new Date().toISOString().slice(0, 10),
          vendor: "",
          status: "paid" as const,
        }}
        validationSchema={schema}
        onSubmit={async (values, { resetForm, setSubmitting }) => {
          await addExpense.mutateAsync({
            tourId,
            category: values.category as TourExpenseCategory,
            description: values.description,
            amountUsd: Number(values.amountUsd),
            date: values.date,
            vendor: values.vendor || undefined,
            status: values.status,
          });
          toast.success("Expense recorded");
          resetForm();
          setOpen(false);
          setSubmitting(false);
        }}
      >
        {() => (
          <Form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                name="category"
                label="Category"
                options={CATEGORY_OPTIONS}
                required
              />
              <SelectField
                name="status"
                label="Status"
                options={[
                  { value: "paid", label: "Paid" },
                  { value: "pending", label: "Pending" },
                  { value: "planned", label: "Planned" },
                ]}
                required
              />
            </div>
            <TextField name="description" label="Description" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                name="amountUsd"
                label="Amount (USD)"
                type="number"
                required
              />
              <TextField name="date" label="Date" type="date" required />
            </div>
            <TextField name="vendor" label="Vendor (optional)" />
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <SubmitButton size="sm">Save expense</SubmitButton>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
