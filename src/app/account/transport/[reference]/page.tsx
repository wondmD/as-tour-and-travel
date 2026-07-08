"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, Clock, MapPin, Phone, User } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  AssistanceBadge,
  TransportBookingStatusBadge,
  TransportTypeBadge,
} from "@/components/transport/TransportBadges";
import { Badge, Button, Card, CardContent, Spinner } from "@/components/ui";
import { useTransportBooking } from "@/lib/hooks/use-transport-data";
import { fulfillmentLabel } from "@/lib/transport-booking";

export default function AccountTransportDetailPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data: booking, isLoading } = useTransportBooking(reference);

  if (isLoading) {
    return <Spinner label="Loading transfer…" className="py-20" />;
  }

  if (!booking) {
    return <p className="text-text-secondary">Transfer not found.</p>;
  }

  return (
    <>
      <PageHeader
        title={booking.reference}
        description={`${booking.origin} → ${booking.destination}`}
        actions={
          booking.linkedTourBookingRef ? (
            <Link href={`/account/bookings/${booking.linkedTourBookingRef}`}>
              <Button variant="soft" size="sm">
                View tour booking
              </Button>
            </Link>
          ) : undefined
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card static>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-wrap gap-2">
              <TransportTypeBadge type={booking.routeType} />
              <TransportBookingStatusBadge status={booking.status} />
              {booking.coordinatedByCompany && <AssistanceBadge coordinated />}
            </div>
            <dl className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Calendar className="mt-0.5 size-4 shrink-0 text-text-secondary" />
                <div>
                  <dt className="font-medium text-text-primary">Travel date</dt>
                  <dd className="text-text-secondary">{booking.travelDate}</dd>
                </div>
              </div>
              <div className="flex gap-2">
                <User className="mt-0.5 size-4 shrink-0 text-text-secondary" />
                <div>
                  <dt className="font-medium text-text-primary">Passengers</dt>
                  <dd className="text-text-secondary">{booking.passengers}</dd>
                </div>
              </div>
              <div>
                <dt className="font-medium text-text-primary">Operator</dt>
                <dd className="text-text-secondary">{booking.operator}</dd>
              </div>
              <div>
                <dt className="font-medium text-text-primary">Total</dt>
                <dd className="text-lg font-bold text-text-primary">
                  ${booking.amountUsd.toLocaleString()}
                </dd>
              </div>
              <Badge variant="neutral">
                {fulfillmentLabel(booking.fulfillmentType)}
              </Badge>
            </dl>
          </CardContent>
        </Card>

        {booking.coordinatedByCompany && (
          <Card static variant="solid">
            <CardContent className="space-y-4 pt-6">
              <h2 className="font-heading text-lg font-bold text-text-primary">
                AS Tour travel assistance
              </h2>
              <p className="text-sm text-text-secondary">
                Our team coordinates this leg — you will receive pickup details before
                travel day.
              </p>
              <dl className="space-y-3 text-sm">
                {booking.pickupLocation && (
                  <div className="flex gap-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-medium">Pickup</dt>
                      <dd className="text-text-secondary">{booking.pickupLocation}</dd>
                    </div>
                  </div>
                )}
                {booking.pickupTime && (
                  <div className="flex gap-2">
                    <Clock className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-medium">Time</dt>
                      <dd className="text-text-secondary">{booking.pickupTime}</dd>
                    </div>
                  </div>
                )}
                {booking.meetingPoint && (
                  <div>
                    <dt className="font-medium text-text-primary">Meeting point</dt>
                    <dd className="text-text-secondary">{booking.meetingPoint}</dd>
                  </div>
                )}
                {booking.driverName && (
                  <div className="flex gap-2">
                    <User className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-medium">Driver / coordinator</dt>
                      <dd className="text-text-secondary">{booking.driverName}</dd>
                    </div>
                  </div>
                )}
                {booking.driverPhone && (
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-medium">Contact</dt>
                      <dd className="text-text-secondary">{booking.driverPhone}</dd>
                    </div>
                  </div>
                )}
                {booking.assistanceNotes && (
                  <div className="rounded-lg bg-primary/5 p-3 text-text-secondary">
                    {booking.assistanceNotes}
                  </div>
                )}
              </dl>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
}
