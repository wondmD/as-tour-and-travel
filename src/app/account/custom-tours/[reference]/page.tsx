"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard";
import { CustomTourStatusBadge } from "@/components/tour/TourTypeBadge";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
  toast,
} from "@/components/ui";
import {
  useAcceptCustomProposal,
  useCustomTourRequestByRef,
} from "@/lib/hooks/use-custom-tour-data";

export default function AccountCustomTourDetailPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data, isLoading } = useCustomTourRequestByRef(reference);
  const accept = useAcceptCustomProposal();

  if (isLoading) return <Spinner label="Loading…" />;
  if (!data) return <p>Not found</p>;

  const { request, proposal } = data;

  return (
    <>
      <PageHeader
        title={request.reference}
        description="Custom tour request"
        actions={
          <Link href="/account/custom-tours">
            <Button variant="ghost" size="sm">
              All requests
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card static>
          <CardHeader actions={<CustomTourStatusBadge status={request.status} />}>
            <CardTitle className="text-base">Your request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-text-secondary">Destinations:</span>{" "}
              {request.destinationNames.join(", ")}
            </p>
            {request.preferredStartDate && (
              <p>
                <span className="text-text-secondary">Dates:</span>{" "}
                {request.preferredStartDate}
                {request.preferredEndDate ? ` → ${request.preferredEndDate}` : ""}
              </p>
            )}
            <p>
              <span className="text-text-secondary">Travelers:</span> {request.travelerCount}
            </p>
            {request.budgetUsd && (
              <p>
                <span className="text-text-secondary">Budget:</span> ${request.budgetUsd}
              </p>
            )}
            {request.notes && (
              <p className="rounded-xl bg-primary/4 p-3 text-text-secondary">{request.notes}</p>
            )}
            {request.rejectionReason && (
              <p className="rounded-xl bg-danger/10 p-3 text-danger">{request.rejectionReason}</p>
            )}
            {request.assignedStaffName && (
              <p className="text-text-secondary">
                Handled by {request.assignedStaffName}
              </p>
            )}
          </CardContent>
        </Card>

        {proposal && (
          <Card static>
            <CardHeader>
              <CardTitle className="text-base">{proposal.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="leading-relaxed text-text-secondary">
                {proposal.itinerarySummary}
              </p>
              <p>
                <strong>{proposal.durationDays} days</strong> ·{" "}
                <strong className="text-primary">${proposal.priceUsd.toLocaleString()}</strong>{" "}
                per person
              </p>
              <p className="text-xs text-text-secondary">
                Valid until {proposal.validUntil} · by {proposal.createdByName}
              </p>
              {proposal.notes && (
                <p className="rounded-xl bg-accent/8 p-3 text-text-secondary">{proposal.notes}</p>
              )}
              {proposal.status === "pending" && request.status === "customized" && (
                <Button
                  size="sm"
                  loading={accept.isPending}
                  onClick={async () => {
                    await accept.mutateAsync(proposal.id);
                    toast.success("Proposal accepted — proceed to booking");
                  }}
                >
                  Accept proposal
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {request.status === "confirmed" && (
          <Card static className="lg:col-span-2">
            <CardContent className="py-4 text-sm">
              Your custom tour is confirmed.{" "}
              <Link href="/account/bookings" className="font-semibold text-primary hover:underline">
                View bookings
              </Link>{" "}
              or contact support to finalize payment.
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
