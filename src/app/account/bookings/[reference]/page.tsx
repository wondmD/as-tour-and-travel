"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/dashboard";
import { BookingDetail } from "@/components/travel/BookingDetail";
import { Button, Dialog, Spinner, toast } from "@/components/ui";
import { useBooking, useCancelBooking } from "@/lib/hooks/use-travel-data";
import { useState } from "react";

export default function BookingDetailPage() {
  const params = useParams();
  const reference = params.reference as string;
  const router = useRouter();
  const { data: booking, isLoading } = useBooking(reference);
  const cancelBooking = useCancelBooking();
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-48 items-center justify-center">
        <Spinner label="Loading booking…" />
      </div>
    );
  }

  if (!booking) {
    return <p className="text-sm text-text-secondary">Booking not found.</p>;
  }

  const canCancel = ["confirmed", "pending"].includes(booking.status);

  return (
    <>
      <PageHeader
        title={booking.reference}
        description={booking.tourTitle}
        actions={
          <>
            <Link
              href={`/hotels?checkIn=${booking.departureDate}&guests=${booking.travelerCount}&tourRef=${booking.reference}`}
            >
              <Button variant="soft" size="sm">
                Add hotel nights
              </Button>
            </Link>
            <Button variant="secondary" size="sm" onClick={() => toast.info("Invoice download — mock PDF")}>
              Download invoice
            </Button>
            {canCancel && (
              <Button variant="danger" size="sm" onClick={() => setConfirmOpen(true)}>
                Cancel booking
              </Button>
            )}
          </>
        }
      />
      <BookingDetail booking={booking} />

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel this booking?"
        description="Refund amount depends on the cancellation policy."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>Keep booking</Button>
            <Button
              variant="danger"
              loading={cancelBooking.isPending}
              onClick={async () => {
                await cancelBooking.mutateAsync(booking.id);
                toast.success("Booking cancelled (mock)");
                setConfirmOpen(false);
                router.push("/account/bookings");
              }}
            >
              Confirm cancellation
            </Button>
          </>
        }
      >
        <p className="text-sm text-text-secondary">{booking.cancellationPolicy}</p>
      </Dialog>
    </>
  );
}
