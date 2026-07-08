"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import { CustomTourStatusBadge } from "@/components/tour/TourTypeBadge";
import { SubmitButton, TextField, TextareaField } from "@/components/forms";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  Label,
  Spinner,
  Textarea,
  toast,
} from "@/components/ui";
import {
  useAssignCustomTourReview,
  useConfirmCustomTour,
  useCustomTourRequest,
  useRejectCustomTour,
  useSubmitCustomProposal,
} from "@/lib/hooks/use-custom-tour-data";
import { useSession } from "@/lib/stores/auth";
import { useState } from "react";

const proposalSchema = Yup.object({
  title: Yup.string().required(),
  itinerarySummary: Yup.string().required().min(20),
  durationDays: Yup.number().min(1).required(),
  priceUsd: Yup.number().min(1).required(),
  validUntil: Yup.string().required(),
  notes: Yup.string(),
});

export default function AdminCustomTourDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const session = useSession();
  const { data, isLoading } = useCustomTourRequest(id);
  const confirm = useConfirmCustomTour();
  const reject = useRejectCustomTour();
  const assign = useAssignCustomTourReview();
  const submitProposal = useSubmitCustomProposal();
  const canOps = useRequireRole(["admin", "staff"]);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [proposalOpen, setProposalOpen] = useState(false);

  if (isLoading) return <Spinner label="Loading…" />;
  if (!data) return <p>Not found</p>;

  const { request, proposal } = data;
  const staffName = session?.user.fullName ?? "Staff";

  return (
    <>
      <PageHeader
        title={request.reference}
        description={request.customerName}
        actions={
          <>
            <Button variant="ghost" size="sm" onClick={() => router.push("/admin/custom-tours")}>
              Back
            </Button>
            {canOps && request.status === "submitted" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={async () => {
                  await assign.mutateAsync({
                    id: request.id,
                    staffId: session!.user.id,
                    staffName,
                  });
                  toast.success("Marked under review");
                }}
              >
                Start review
              </Button>
            )}
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card static>
          <CardHeader actions={<CustomTourStatusBadge status={request.status} />}>
            <CardTitle className="text-base">Request details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>Destinations: {request.destinationNames.join(", ")}</p>
            <p>Travelers: {request.travelerCount}</p>
            {request.budgetUsd && <p>Budget: ${request.budgetUsd}</p>}
            {request.notes && <p className="rounded-xl bg-primary/4 p-3">{request.notes}</p>}
          </CardContent>
        </Card>

        {proposal && (
          <Card static>
            <CardHeader>
              <CardTitle className="text-base">Proposal sent</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="font-medium">{proposal.title}</p>
              <p className="mt-2 text-text-secondary">{proposal.itinerarySummary}</p>
              <p className="mt-2">
                ${proposal.priceUsd} · {proposal.durationDays} days
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {canOps && !["confirmed", "rejected"].includes(request.status) && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={async () => {
              await confirm.mutateAsync({ id: request.id, staffName });
              toast.success("Confirmed");
            }}
          >
            Confirm as-is
          </Button>
          <Button size="sm" onClick={() => setProposalOpen(true)}>
            Send customized proposal
          </Button>
          <Button variant="danger" size="sm" onClick={() => setRejectOpen(true)}>
            Reject
          </Button>
        </div>
      )}

      <Dialog
        open={rejectOpen}
        onOpenChange={setRejectOpen}
        title="Reject request"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRejectOpen(false)}>Cancel</Button>
            <Button
              variant="danger"
              onClick={async () => {
                await reject.mutateAsync({
                  id: request.id,
                  reason: rejectReason || "Unable to accommodate requested dates.",
                  staffName,
                });
                toast.info("Request rejected");
                setRejectOpen(false);
              }}
            >
              Reject
            </Button>
          </>
        }
      >
        <Label htmlFor="reject-reason">Reason (shown to traveler)</Label>
        <Textarea
          id="reject-reason"
          className="mt-1"
          rows={3}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Dialog>

      <Dialog
        open={proposalOpen}
        onOpenChange={setProposalOpen}
        title="Customized proposal"
        size="lg"
      >
        <Formik
          initialValues={{
            title: `Custom: ${request.destinationNames.slice(0, 2).join(" & ")}`,
            itinerarySummary: "",
            durationDays: request.durationDays ?? 7,
            priceUsd: request.budgetUsd ?? 2500,
            validUntil: "2026-08-15",
            notes: "",
          }}
          validationSchema={proposalSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await submitProposal.mutateAsync({
              requestId: request.id,
              ...values,
              durationDays: Number(values.durationDays),
              priceUsd: Number(values.priceUsd),
              createdByName: staffName,
            });
            toast.success("Proposal sent");
            setProposalOpen(false);
            setSubmitting(false);
          }}
        >
          {() => (
            <Form className="space-y-3">
              <TextField name="title" label="Proposal title" required />
              <TextareaField name="itinerarySummary" label="Itinerary summary" required />
              <TextField name="durationDays" label="Days" type="number" required />
              <TextField name="priceUsd" label="Price USD (per person)" type="number" required />
              <TextField name="validUntil" label="Valid until" type="date" required />
              <TextareaField name="notes" label="Notes" />
              <SubmitButton>Send proposal</SubmitButton>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
