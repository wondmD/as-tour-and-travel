"use client";

import { Form, Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Plus, Trash2 } from "lucide-react";
import { SubmitButton, TextField } from "@/components/forms";
import { Button, Card, CardContent, CardHeader, CardTitle, toast } from "@/components/ui";
import { useUpdateTourBudget } from "@/lib/hooks/use-travel-data";
import { formatUsd } from "@/lib/tour-finance";
import type { TourBudget } from "@/lib/types";

const schema = Yup.object({
  totalBudgetUsd: Yup.number().min(0).required(),
  periodLabel: Yup.string().required(),
  notes: Yup.string(),
  categories: Yup.array().of(
    Yup.object({
      name: Yup.string().required(),
      allocatedUsd: Yup.number().min(0).required(),
    }),
  ),
});

interface TourBudgetEditorProps {
  budget: TourBudget;
  canEdit: boolean;
}

export function TourBudgetEditor({ budget, canEdit }: TourBudgetEditorProps) {
  const updateBudget = useUpdateTourBudget();

  return (
    <Card static>
      <CardHeader>
        <CardTitle className="text-base">Tour budget</CardTitle>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={budget}
          validationSchema={schema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting }) => {
            if (!canEdit) return;
            const total = values.categories.reduce(
              (s, c) => s + Number(c.allocatedUsd),
              0,
            );
            await updateBudget.mutateAsync({
              ...values,
              totalBudgetUsd: Number(values.totalBudgetUsd) || total,
              categories: values.categories.map((c) => ({
                name: c.name,
                allocatedUsd: Number(c.allocatedUsd),
              })),
            });
            toast.success("Budget updated");
            setSubmitting(false);
          }}
        >
          {({ values }) => {
            const categoryTotal = values.categories.reduce(
              (s, c) => s + Number(c.allocatedUsd || 0),
              0,
            );

            return (
              <Form className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField
                    name="totalBudgetUsd"
                    label="Total budget (USD)"
                    type="number"
                    disabled={!canEdit}
                    required
                  />
                  <TextField
                    name="periodLabel"
                    label="Period"
                    disabled={!canEdit}
                    required
                  />
                </div>
                <TextField name="notes" label="Notes" disabled={!canEdit} />

                <FieldArray name="categories">
                  {({ push, remove }) => (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-text-primary">
                          Category allocations
                        </p>
                        {canEdit && (
                          <Button
                            type="button"
                            size="sm"
                            variant="soft"
                            onClick={() =>
                              push({ name: "", allocatedUsd: 0 })
                            }
                          >
                            <Plus className="size-3.5" /> Add line
                          </Button>
                        )}
                      </div>
                      {values.categories.map((_, index) => (
                        <div
                          key={index}
                          className="grid gap-2 sm:grid-cols-[1fr_140px_40px] sm:items-end"
                        >
                          <TextField
                            name={`categories.${index}.name`}
                            label={index === 0 ? "Category" : undefined}
                            disabled={!canEdit}
                          />
                          <TextField
                            name={`categories.${index}.allocatedUsd`}
                            label={index === 0 ? "Amount" : undefined}
                            type="number"
                            disabled={!canEdit}
                          />
                          {canEdit && values.categories.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-danger"
                              onClick={() => remove(index)}
                              aria-label="Remove category"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-primary/6 px-4 py-3 text-sm">
                  <span className="text-text-secondary">
                    Category subtotal:{" "}
                    <strong className="tabular-nums text-text-primary">
                      {formatUsd(categoryTotal)}
                    </strong>
                  </span>
                  <span className="text-text-secondary">
                    Total budget:{" "}
                    <strong className="tabular-nums text-primary">
                      {formatUsd(Number(values.totalBudgetUsd) || 0)}
                    </strong>
                  </span>
                </div>

                {canEdit && (
                  <SubmitButton className="w-fit">Save budget</SubmitButton>
                )}
              </Form>
            );
          }}
        </Formik>
      </CardContent>
    </Card>
  );
}
