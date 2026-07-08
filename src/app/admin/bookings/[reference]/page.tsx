"use client";

import { useParams } from "next/navigation";
import { PageHeader } from "@/components/dashboard";
import { BookingDetail } from "@/components/travel/BookingDetail";
import { Button, Spinner, toast } from "@/components/ui";
import {
  useBooking,
  useConfirmBooking,
} from "@/lib/hooks/use-travel-data";
import { ALL_TRAVELERS } from "@/lib/mock/seed";
import { useRequireRole } from "@/components/auth/AuthGuard";

export default function AdminBookingDetailPage() {
  const params = useParams();
  const reference = params.reference as string;
  const { data: booking, isLoading } = useBooking(reference);
  const confirm = useConfirmBooking();
  const canOps = useRequireRole(["admin", "staff"]);

  if (isLoading) return <Spinner label="Loading…" />;
  if (!booking) return <p>Not found</p>;

  const customer = ALL_TRAVELERS.find((u) => u.id === booking.userId);

  return (
    <>
      <PageHeader
        title={booking.reference}
        description={`Managed by ${customer?.fullName ?? "Unknown"}`}
        actions={
          canOps && booking.status === "pending" ? (
            <>
              <Button
                size="sm"
                variant="success"
                loading={confirm.isPending}
                onClick={async () => {
                  await confirm.mutateAsync(booking.id);
                  toast.success("Booking confirmed + payment marked successful");
                }}
              >
                Confirm booking
              </Button>
              <Button size="sm" variant="danger" onClick={() => toast.info("Refund flow — mock")}>
                Cancel & refund
              </Button>
            </>
          ) : null
        }
      />
      <BookingDetail
        booking={booking}
        showCustomer
        customerName={customer?.fullName}
      />
    </>
  );
}
