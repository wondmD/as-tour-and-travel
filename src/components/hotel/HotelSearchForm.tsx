"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { SubmitButton, TextField } from "@/components/forms";
import { Checkbox, Label } from "@/components/ui";

const schema = Yup.object({
  city: Yup.string(),
  checkIn: Yup.string().required("Required"),
  checkOut: Yup.string()
    .required("Required")
    .test("after-checkin", "Must be after check-in", function (value) {
      const { checkIn } = this.parent;
      return !checkIn || !value || value > checkIn;
    }),
  guests: Yup.number().min(1).max(8).required(),
  instantOnly: Yup.boolean(),
});

export interface HotelSearchFormValues {
  city: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  instantOnly: boolean;
}

interface HotelSearchFormProps {
  initial?: Partial<HotelSearchFormValues>;
  compact?: boolean;
}

export function HotelSearchForm({ initial, compact }: HotelSearchFormProps) {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Formik<HotelSearchFormValues>
      initialValues={{
        city: initial?.city ?? "",
        checkIn: initial?.checkIn ?? today,
        checkOut: initial?.checkOut ?? "",
        guests: initial?.guests ?? 2,
        instantOnly: initial?.instantOnly ?? false,
      }}
      validationSchema={schema}
      onSubmit={(values) => {
        const params = new URLSearchParams({
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          guests: String(values.guests),
        });
        if (values.city) params.set("city", values.city);
        if (values.instantOnly) params.set("instantOnly", "1");
        router.push(`/hotels?${params.toString()}`);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form
          className={
            compact
              ? "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
              : "glass-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5"
          }
        >
          <TextField name="city" label="City" placeholder="e.g. Lalibela" />
          <TextField name="checkIn" label="Check-in" type="date" required />
          <TextField name="checkOut" label="Check-out" type="date" required />
          <TextField name="guests" label="Guests" type="number" required />
          <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
            <Label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={values.instantOnly}
                onCheckedChange={(v) => setFieldValue("instantOnly", Boolean(v))}
              />
              Instant confirm only
            </Label>
            <SubmitButton className="w-full sm:w-auto">
              <Search className="size-4" /> Search stays
            </SubmitButton>
          </div>
        </Form>
      )}
    </Formik>
  );
}
