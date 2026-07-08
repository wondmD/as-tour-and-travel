"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { SelectField, SubmitButton, TextField } from "@/components/forms";
import { Card, CardContent } from "@/components/ui";
import { DESTINATIONS } from "@/lib/mock/seed";

const schema = Yup.object({
  originDestinationId: Yup.string(),
  destinationDestinationId: Yup.string(),
  travelDate: Yup.string().required("Travel date is required"),
  passengers: Yup.number().min(1).max(12).required(),
  type: Yup.string(),
});

interface TransportSearchFormProps {
  initial?: {
    originDestinationId?: string;
    destinationDestinationId?: string;
    travelDate?: string;
    passengers?: number;
    tourRef?: string;
    tourId?: string;
  };
  onSearch: (values: {
    originDestinationId?: string;
    destinationDestinationId?: string;
    travelDate: string;
    passengers: number;
    type?: string;
  }) => void;
}

export function TransportSearchForm({ initial, onSearch }: TransportSearchFormProps) {
  const published = DESTINATIONS.filter((d) => d.status === "published");
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Card static>
      <CardContent className="pt-6">
        <Formik
          initialValues={{
            originDestinationId: initial?.originDestinationId ?? "",
            destinationDestinationId: initial?.destinationDestinationId ?? "",
            travelDate: initial?.travelDate ?? today,
            passengers: initial?.passengers ?? 2,
            type: "",
          }}
          validationSchema={schema}
          onSubmit={(values) => {
            onSearch({
              originDestinationId: values.originDestinationId || undefined,
              destinationDestinationId: values.destinationDestinationId || undefined,
              travelDate: values.travelDate,
              passengers: Number(values.passengers),
              type: values.type || undefined,
            });
          }}
        >
          <Form className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <SelectField
              name="originDestinationId"
              label="From"
              options={[
                { value: "", label: "Any origin" },
                ...published.map((d) => ({ value: d.id, label: d.name })),
                { value: "addis", label: "Addis Ababa / Airport" },
              ]}
            />
            <SelectField
              name="destinationDestinationId"
              label="To"
              options={[
                { value: "", label: "Any destination" },
                ...published.map((d) => ({ value: d.id, label: d.name })),
              ]}
            />
            <TextField name="travelDate" label="Travel date" type="date" required />
            <TextField name="passengers" label="Passengers" type="number" required />
            <SelectField
              name="type"
              label="Mode"
              options={[
                { value: "", label: "Any" },
                { value: "flight", label: "Flight" },
                { value: "bus", label: "Coach / bus" },
                { value: "private_car", label: "Private transfer" },
              ]}
            />
            <div className="sm:col-span-2 lg:col-span-5">
              <SubmitButton>Find transfers</SubmitButton>
            </div>
          </Form>
        </Formik>
      </CardContent>
    </Card>
  );
}
