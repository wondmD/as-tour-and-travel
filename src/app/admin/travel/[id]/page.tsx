"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import { SubmitButton, TextField, TextareaField } from "@/components/forms";
import {
  TravelPlanStatusBadge,
  TravelRouteStrip,
} from "@/components/travel/TravelDesignerParts";
import { TRAVEL_KIND_LABELS } from "@/lib/travel-plan";
import { Button, Card, CardContent, Spinner, toast } from "@/components/ui";
import {
  useTravelPlan,
  useUpdateTravelPlanStatus,
} from "@/lib/hooks/use-travel-plan-data";

const quoteSchema = Yup.object({
  quotedUsd: Yup.number().min(1).required(),
  staffNotes: Yup.string().required().min(10),
});

export default function AdminTravelDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: plan, isLoading } = useTravelPlan(id);
  const updateStatus = useUpdateTravelPlanStatus();
  const canEdit = useRequireRole(["admin", "staff"]);

  if (isLoading) return <Spinner label="Loading…" className="py-16" />;
  if (!plan) return <p className="text-text-secondary">Not found.</p>;

  return (
    <>
      <PageHeader
        title={plan.name}
        description={`${plan.reference} · ${plan.customerName}`}
        toolbar={<TravelPlanStatusBadge status={plan.status} />}
        actions={
          <Link href="/admin/travel">
            <Button variant="secondary" size="sm">
              All travel plans
            </Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card static variant="solid">
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm text-text-secondary">
              {TRAVEL_KIND_LABELS[plan.kind]} · {plan.travelerCount} traveler
              {plan.travelerCount === 1 ? "" : "s"}
            </p>
            <TravelRouteStrip stops={plan.stops} readOnly />
            {plan.notes && (
              <div className="rounded-lg bg-primary/5 p-3 text-sm text-text-secondary">
                <strong className="text-text-primary">Traveler notes:</strong> {plan.notes}
              </div>
            )}
          </CardContent>
        </Card>

        {canEdit && (
          <Card static variant="solid">
            <CardContent className="pt-6">
              <h2 className="font-heading font-bold text-text-primary">Send quote</h2>
              <Formik
                initialValues={{
                  quotedUsd: plan.quotedUsd ?? "",
                  staffNotes: plan.staffNotes ?? "",
                }}
                validationSchema={quoteSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  await updateStatus.mutateAsync({
                    id: plan.id,
                    status: "quoted",
                    quotedUsd: Number(values.quotedUsd),
                    staffNotes: values.staffNotes,
                  });
                  toast.success("Quote sent");
                  setSubmitting(false);
                }}
              >
                <Form className="mt-4 space-y-4">
                  <TextField name="quotedUsd" label="Quote (USD)" type="number" required />
                  <TextareaField
                    name="staffNotes"
                    label="Message to traveler"
                    required
                  />
                  <div className="flex flex-wrap gap-2">
                    <SubmitButton>Send quote</SubmitButton>
                    {plan.status === "quoted" && (
                      <Button
                        type="button"
                        variant="soft"
                        onClick={() =>
                          updateStatus.mutate(
                            { id: plan.id, status: "confirmed" },
                            { onSuccess: () => toast.success("Confirmed") },
                          )
                        }
                      >
                        Mark confirmed
                      </Button>
                    )}
                    {plan.status === "submitted" && (
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() =>
                          updateStatus.mutate(
                            { id: plan.id, status: "cancelled" },
                            { onSuccess: () => toast.success("Cancelled") },
                          )
                        }
                      >
                        Decline
                      </Button>
                    )}
                  </div>
                </Form>
              </Formik>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
