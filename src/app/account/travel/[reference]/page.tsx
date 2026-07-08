"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Headphones, Pencil } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  TravelPlanStatusBadge,
  TravelRouteStrip,
} from "@/components/travel/TravelDesignerParts";
import { TRAVEL_KIND_LABELS } from "@/lib/travel-plan";
import { Button, Card, CardContent, Spinner } from "@/components/ui";
import { useTravelPlanByRef } from "@/lib/hooks/use-travel-plan-data";

export default function AccountTravelDetailPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data: plan, isLoading } = useTravelPlanByRef(reference);

  if (isLoading) return <Spinner label="Loading…" className="py-16" />;
  if (!plan) return <p className="text-text-secondary">Travel plan not found.</p>;

  const canEdit = plan.status === "draft" || plan.status === "quoted";

  return (
    <>
      <PageHeader
        title={plan.name}
        description={`${plan.reference} · ${TRAVEL_KIND_LABELS[plan.kind]}`}
        toolbar={<TravelPlanStatusBadge status={plan.status} />}
        actions={
          canEdit ? (
            <Link href={`/account/travel/${reference}/edit`}>
              <Button size="sm" variant="soft">
                <Pencil className="size-4" />
                Edit route
              </Button>
            </Link>
          ) : undefined
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card static className="lg:col-span-2" variant="solid">
          <CardContent className="pt-6">
            <h2 className="font-heading font-bold text-text-primary">Route</h2>
            <div className="mt-4">
              <TravelRouteStrip stops={plan.stops} readOnly />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card static variant="solid">
            <CardContent className="space-y-3 pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-text-secondary">Travelers</span>
                <span className="font-semibold">{plan.travelerCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Dates</span>
                <span className="font-semibold">
                  {plan.startDate}
                  {plan.endDate ? ` → ${plan.endDate}` : ""}
                </span>
              </div>
              {plan.quotedUsd && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">Quote</span>
                  <span className="text-lg font-bold text-primary">
                    ${plan.quotedUsd.toLocaleString()}
                  </span>
                </div>
              )}
              {plan.assistanceRequested && (
                <p className="flex items-center gap-2 rounded-lg bg-success/8 px-3 py-2 text-success">
                  <Headphones className="size-4" />
                  AS Tour travel assistance requested
                </p>
              )}
            </CardContent>
          </Card>

          {plan.notes && (
            <Card static variant="solid">
              <CardContent className="pt-6">
                <h3 className="text-sm font-bold text-text-primary">Your notes</h3>
                <p className="mt-2 text-sm text-text-secondary">{plan.notes}</p>
              </CardContent>
            </Card>
          )}

          {plan.staffNotes && (
            <Card static variant="solid">
              <CardContent className="pt-6">
                <h3 className="text-sm font-bold text-text-primary">From AS Tour</h3>
                <p className="mt-2 text-sm text-text-secondary">{plan.staffNotes}</p>
              </CardContent>
            </Card>
          )}

          {plan.status === "quoted" && (
            <Link href={`/transport?travelDate=${plan.startDate}&passengers=${plan.travelerCount}`}>
              <Button fullWidth variant="soft">
                Book transfers for this trip
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
