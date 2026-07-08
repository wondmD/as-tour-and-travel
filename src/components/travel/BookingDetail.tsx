"use client";

import type { Booking } from "@/lib/types";
import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatusBadge,
  type StatusKind,
} from "@/components/ui";

interface BookingDetailProps {
  booking: Booking;
  showCustomer?: boolean;
  customerName?: string;
  actions?: React.ReactNode;
}

export function BookingDetail({
  booking,
  showCustomer,
  customerName,
  actions,
}: BookingDetailProps) {
  return (
    <div className="space-y-4">
      <Card static>
        <CardHeader actions={actions}>
          <CardTitle>{booking.reference}</CardTitle>
          <CardDescription>{booking.tourTitle}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Detail label="Departure" value={booking.departureDate} />
          <Detail label="Travelers" value={String(booking.travelerCount)} />
          <Detail label="Amount" value={`$${booking.amountUsd.toLocaleString()}`} />
          <div>
            <p className="text-xs font-medium text-text-secondary">Status</p>
            <div className="mt-1 flex flex-wrap gap-2">
              <StatusBadge status={booking.status as StatusKind} />
              <Badge variant={booking.paymentStatus === "successful" ? "success" : "warning"}>
                {booking.paymentStatus}
              </Badge>
            </div>
          </div>
          {showCustomer && customerName && (
            <Detail label="Customer" value={customerName} />
          )}
        </CardContent>
      </Card>

      <Card static>
        <CardHeader>
          <CardTitle>Travelers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {booking.travelers.map((t, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/50 px-4 py-3">
              <Avatar name={t.fullName} size="sm" />
              <div>
                <p className="text-sm font-medium text-text-primary">{t.fullName}</p>
                <p className="text-xs text-text-secondary">
                  {[t.nationality, t.dateOfBirth].filter(Boolean).join(" · ") || "Details on file"}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {booking.specialRequests && (
        <Card static>
          <CardHeader>
            <CardTitle>Special requests</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-secondary">{booking.specialRequests}</p>
          </CardContent>
        </Card>
      )}

      <Card static>
        <CardHeader>
          <CardTitle>Cancellation policy</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-text-secondary">
            {booking.cancellationPolicy}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p className="mt-0.5 text-sm font-semibold text-text-primary">{value}</p>
    </div>
  );
}
