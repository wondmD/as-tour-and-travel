"use client";

import { Suspense } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { SelectField, SubmitButton } from "@/components/forms";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  toast,
} from "@/components/ui";
import { HotelFulfillmentBadge } from "@/components/hotel/HotelBadges";
import { useCreateHotelBooking } from "@/lib/hooks/use-hotel-data";
import {
  canInstantBook,
  computeStayTotal,
  nightsBetween,
} from "@/lib/hotel-booking";
import { hotelMockDb } from "@/lib/hooks/use-hotel-data";
import type { Hotel, HotelRoom } from "@/lib/types";
import { useSession } from "@/lib/stores/auth";

interface HotelBookingPanelProps {
  hotel: Hotel;
  rooms: HotelRoom[];
  checkIn: string;
  checkOut: string;
  guests: number;
  linkedTourBookingRef?: string;
}

export function HotelBookingPanel({
  hotel,
  rooms,
  checkIn,
  checkOut,
  guests,
  linkedTourBookingRef,
}: HotelBookingPanelProps) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const create = useCreateHotelBooking();

  const eligibleRooms = useMemo(
    () =>
      rooms.filter((r) => {
        if (r.maxGuests < guests) return false;
        if (hotel.fulfillmentType === "on_request") return true;
        return canInstantBook(
          hotel,
          r,
          hotelMockDb.inventoryNights,
          checkIn,
          checkOut,
          guests,
        );
      }),
    [rooms, hotel, checkIn, checkOut, guests],
  );

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    return (
      <Card static>
        <CardContent className="py-6 text-sm text-text-secondary">
          Select valid check-in and check-out dates to book.
        </CardContent>
      </Card>
    );
  }

  if (eligibleRooms.length === 0) {
    return (
      <Card static>
        <CardContent className="py-6 text-sm text-text-secondary">
          No rooms available for {guests} guest(s) on these dates.
          {hotel.fulfillmentType !== "on_request" &&
            " Try different dates or search on-request properties."}
        </CardContent>
      </Card>
    );
  }

  const schema = Yup.object({
    roomTypeId: Yup.string().required("Select a room"),
  });

  return (
    <Card static>
      <CardHeader>
        <CardTitle className="text-base">Book this stay</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2 text-sm text-text-secondary">
          <span>
            {checkIn} → {checkOut} ({nights} night{nights > 1 ? "s" : ""})
          </span>
          <span>·</span>
          <span>{guests} guest{guests > 1 ? "s" : ""}</span>
        </div>
        <HotelFulfillmentBadge type={hotel.fulfillmentType} />

        {!session ? (
          <div className="rounded-xl bg-primary/6 p-4 text-sm">
            <p className="text-text-secondary">Sign in to complete your booking.</p>
            <Button
              className="mt-3"
              size="sm"
              onClick={() =>
                router.push(
                  `/auth/login?redirect=${encodeURIComponent(`${pathname}?${searchParams.toString()}`)}`,
                )
              }
            >
              Sign in
            </Button>
          </div>
        ) : (
          <Formik
            initialValues={{ roomTypeId: eligibleRooms[0]?.id ?? "" }}
            validationSchema={schema}
            onSubmit={async (values, { setSubmitting }) => {
              try {
                const booking = await create.mutateAsync({
                  hotelId: hotel.id,
                  roomTypeId: values.roomTypeId,
                  checkIn,
                  checkOut,
                  guests,
                  source: linkedTourBookingRef ? "add_on" : "standalone",
                  linkedTourBookingRef,
                });
                toast.success(
                  booking.status === "confirmed"
                    ? "Room confirmed instantly!"
                    : "Request submitted — we will confirm within 24h.",
                );
                router.push(`/account/hotels/${booking.reference}`);
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Booking failed");
              }
              setSubmitting(false);
            }}
          >
            {({ values }) => {
              const room = eligibleRooms.find((r) => r.id === values.roomTypeId);
              const total = room
                ? computeStayTotal(room.rateUsd, checkIn, checkOut)
                : 0;
              const instant =
                room &&
                canInstantBook(
                  hotel,
                  room,
                  hotelMockDb.inventoryNights,
                  checkIn,
                  checkOut,
                  guests,
                );

              return (
                <Form className="space-y-4">
                  <SelectField
                    name="roomTypeId"
                    label="Room type"
                    options={eligibleRooms.map((r) => ({
                      value: r.id,
                      label: `${r.name} — $${r.rateUsd}/night`,
                    }))}
                    required
                  />
                  {room && (
                    <div className="rounded-xl border border-border/80 bg-white/50 px-4 py-3 text-sm">
                      <div className="flex justify-between font-semibold text-text-primary">
                        <span>Total</span>
                        <span className="tabular-nums">${total.toLocaleString()}</span>
                      </div>
                      <p className="mt-1 text-xs text-text-secondary">
                        {instant
                          ? "Instant confirmation — room reserved immediately."
                          : `Subject to availability — confirmed within ${hotel.confirmationSlaHours ?? 24} hours.`}
                      </p>
                    </div>
                  )}
                  <SubmitButton fullWidth>
                    {hotel.fulfillmentType === "on_request"
                      ? "Submit request"
                      : "Book now"}
                  </SubmitButton>
                </Form>
              );
            }}
          </Formik>
        )}
      </CardContent>
    </Card>
  );
}
