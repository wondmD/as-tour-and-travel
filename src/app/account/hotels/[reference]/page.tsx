"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard";
import {
  HotelBookingStatusBadge,
  HotelFulfillmentBadge,
} from "@/components/hotel/HotelBadges";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Spinner,
} from "@/components/ui";
import { useHotelBooking } from "@/lib/hooks/use-hotel-data";

export default function AccountHotelDetailPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data: booking, isLoading } = useHotelBooking(reference);

  if (isLoading) return <Spinner label="Loading…" />;
  if (!booking) return <p>Booking not found.</p>;

  return (
    <>
      <PageHeader
        title={booking.reference}
        description={booking.hotelName}
        actions={
          <Link href="/account/hotels">
            <Button variant="ghost" size="sm">
              All stays
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <Card static>
          <CardHeader>
            <CardTitle className="text-base">Stay details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-text-secondary">Room:</span>{" "}
              <strong>{booking.roomTypeName}</strong>
            </p>
            <p>
              <span className="text-text-secondary">Check-in:</span> {booking.checkIn}
            </p>
            <p>
              <span className="text-text-secondary">Check-out:</span> {booking.checkOut}
            </p>
            <p>
              <span className="text-text-secondary">Guests:</span> {booking.guests}
            </p>
            <p>
              <span className="text-text-secondary">Nights:</span> {booking.nights}
            </p>
            <p>
              <span className="text-text-secondary">Total:</span>{" "}
              <strong className="tabular-nums">${booking.amountUsd.toLocaleString()}</strong>
            </p>
            {booking.linkedTourBookingRef && (
              <p>
                <span className="text-text-secondary">Linked tour:</span>{" "}
                <Link
                  href={`/account/bookings/${booking.linkedTourBookingRef}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {booking.linkedTourBookingRef}
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        <Card static>
          <CardHeader
            actions={<HotelBookingStatusBadge status={booking.status} />}
          >
            <CardTitle className="text-base">Booking status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <HotelFulfillmentBadge type={booking.fulfillmentType} />
            {booking.status === "pending_confirmation" && (
              <p className="rounded-xl bg-warning/10 px-3 py-2 text-text-secondary">
                Your request was received. Our team is confirming availability with the
                property — you will be notified by email and in-app.
              </p>
            )}
            {booking.status === "confirmed" && booking.confirmedAt && (
              <p className="text-text-secondary">
                Confirmed on {new Date(booking.confirmedAt).toLocaleString()}
              </p>
            )}
            {booking.status === "declined" && booking.declinedReason && (
              <p className="rounded-xl bg-danger/10 px-3 py-2 text-danger">
                {booking.declinedReason}
              </p>
            )}
            <p className="text-text-secondary">
              Payment: <strong>{booking.paymentStatus}</strong>
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
