"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  AssistanceBadge,
  TransportTypeBadge,
} from "@/components/transport/TransportBadges";
import { SubmitButton, TextField, TextareaField } from "@/components/forms";
import { Badge, Button, Card, CardContent, Spinner, toast } from "@/components/ui";
import {
  useCreateTransportBooking,
  useTransportRoute,
} from "@/lib/hooks/use-transport-data";
import { computeTransportTotal, formatDuration, fulfillmentLabel } from "@/lib/transport-booking";
import { useCurrentUser } from "@/lib/stores/auth";

const schema = Yup.object({
  travelDate: Yup.string().required(),
  passengers: Yup.number().min(1).required(),
  pickupLocation: Yup.string(),
  pickupTime: Yup.string(),
  assistanceNotes: Yup.string(),
});

function BookTransportContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeId = params.id as string;
  const user = useCurrentUser();
  const create = useCreateTransportBooking();
  const { data: route, isLoading } = useTransportRoute(routeId);

  const defaultDate = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const defaultPassengers = Number(searchParams.get("passengers") ?? "2");
  const tourRef = searchParams.get("tourRef") ?? undefined;
  const tourId = searchParams.get("tourId") ?? undefined;

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner label="Loading route…" />
      </div>
    );
  }

  if (!route) {
    return <p className="text-text-secondary">Route not found.</p>;
  }

  return (
    <Card static>
      <CardContent className="space-y-6 pt-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <TransportTypeBadge type={route.type} />
            <h1 className="mt-2 font-heading text-2xl font-bold text-text-primary">
              {route.origin} → {route.destination}
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {route.operator} · {formatDuration(route.durationMinutes)}
            </p>
          </div>
          {route.assistanceIncluded && <AssistanceBadge coordinated />}
        </div>

        <p className="rounded-xl bg-primary/5 px-4 py-3 text-sm text-text-secondary">
          {route.assistanceIncluded
            ? "AS Tour will coordinate pickup, meeting point, and on-road assistance — you travel door to door without worrying about local logistics."
            : "Instant booking — show your reference at departure."}
        </p>

        <Badge variant="neutral">
          {fulfillmentLabel(route.fulfillmentType ?? "instant")}
        </Badge>

        {!user ? (
          <div className="space-y-3">
            <p className="text-sm text-text-secondary">Sign in to book this transfer.</p>
            <Link href={`/auth/login?next=/transport/${routeId}`}>
              <Button size="sm">Sign in</Button>
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={{
              travelDate: defaultDate,
              passengers: defaultPassengers,
              pickupLocation: "",
              pickupTime: "08:00",
              assistanceNotes: tourRef
                ? `Linked to tour booking ${tourRef}`
                : "",
            }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const booking = await create.mutateAsync({
                  userId: user.id,
                  customerName: user.fullName,
                  routeId: route.id,
                  travelDate: values.travelDate,
                  passengers: Number(values.passengers),
                  source: tourRef ? "add_on" : "standalone",
                  linkedTourBookingRef: tourRef,
                  linkedTourId: tourId,
                  pickupLocation: values.pickupLocation || undefined,
                  pickupTime: values.pickupTime || undefined,
                  assistanceNotes: values.assistanceNotes || undefined,
                });
                toast.success(`Transfer booked — ${booking.reference}`);
                router.push(`/account/transport/${booking.reference}`);
              } catch {
                toast.error("Could not complete booking");
              }
              setSubmitting(false);
            }}
          >
            <Form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField name="travelDate" label="Travel date" type="date" required />
                <TextField name="passengers" label="Passengers" type="number" required />
                <TextField name="pickupLocation" label="Pickup location" placeholder="Hotel name or address" />
                <TextField name="pickupTime" label="Preferred pickup time" type="time" />
              </div>
              <TextareaField
                name="assistanceNotes"
                label="Notes for our travel team"
                placeholder="Flight number, luggage, accessibility needs…"
              />
              <p className="text-sm">
                Total:{" "}
                <strong className="text-lg text-text-primary">
                  ${computeTransportTotal(route, defaultPassengers).toLocaleString()}
                </strong>
              </p>
              <SubmitButton>Confirm transfer</SubmitButton>
            </Form>
          </Formik>
        )}
      </CardContent>
    </Card>
  );
}

export default function TransportBookPage() {
  return (
    <>
      <Navbar />
      <main className="pattern-surface min-h-dvh py-12">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          <Suspense fallback={<Spinner label="Loading…" />}>
            <BookTransportContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
