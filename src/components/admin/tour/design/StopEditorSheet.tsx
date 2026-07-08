"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { SubmitButton, TextField, TextareaField } from "@/components/forms";
import { Button, Sheet } from "@/components/ui";
import { departureDate, formatDisplayDate } from "@/lib/tour-itinerary";
import type { TourItineraryStop } from "@/lib/types";

const schema = Yup.object({
  arrivalDate: Yup.string().required("Arrival date is required"),
  nights: Yup.number().min(1, "At least 1 night").max(14).required(),
  notes: Yup.string().max(400),
});

interface StopEditorSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stop: TourItineraryStop | null;
  tourStartDate: string;
  onSave: (patch: Pick<TourItineraryStop, "arrivalDate" | "nights" | "notes">) => void;
  onDelete?: () => void;
}

export function StopEditorSheet({
  open,
  onOpenChange,
  stop,
  tourStartDate,
  onSave,
  onDelete,
}: StopEditorSheetProps) {
  if (!stop) return null;

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
      title={stop.destinationName}
      description="Set when travelers arrive and how long they stay."
      side="end"
      className="w-[min(28rem,92vw)]"
    >
      <Formik
        key={stop.id}
        initialValues={{
          arrivalDate: stop.arrivalDate,
          nights: stop.nights,
          notes: stop.notes ?? "",
        }}
        validationSchema={schema}
        onSubmit={(values, { setSubmitting }) => {
          onSave({
            arrivalDate: values.arrivalDate,
            nights: Number(values.nights),
            notes: values.notes || undefined,
          });
          onOpenChange(false);
          setSubmitting(false);
        }}
      >
        {({ values }) => {
          const leave = departureDate(values.arrivalDate, Number(values.nights) || 0);
          const beforeStart = values.arrivalDate < tourStartDate;

          return (
            <Form className="space-y-4">
              <TextField
                name="arrivalDate"
                label="Arrival date"
                type="date"
                required
                hint={
                  beforeStart
                    ? "Arrival is before tour start — adjust tour start or pick a later date."
                    : undefined
                }
              />
              <TextField
                name="nights"
                label="Nights at destination"
                type="number"
                required
              />
              <div className="rounded-lg bg-primary/5 px-3 py-2 text-sm text-text-secondary">
                <p>
                  <strong className="text-text-primary">Depart:</strong>{" "}
                  {formatDisplayDate(leave)}
                </p>
              </div>
              <TextareaField
                name="notes"
                label="Stop notes (optional)"
                placeholder="Highlights, activities, or logistics for this leg…"
              />
              <div className="flex flex-wrap gap-2 pt-2">
                <SubmitButton className="flex-1">Save stop</SubmitButton>
                {onDelete && (
                  <Button type="button" variant="outline" onClick={onDelete}>
                    Remove
                  </Button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </Sheet>
  );
}
