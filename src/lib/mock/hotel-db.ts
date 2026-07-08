import type {
  HotelBooking,
  HotelSearchQuery,
  InventoryNight,
} from "@/lib/types";
import {
  canInstantBook,
  computeStayTotal,
  datesInStay,
  nextHotelReference,
  searchHotels,
} from "@/lib/hotel-booking";
import { mockDb, mockFetch, nextId } from "@/lib/mock/db";

export { searchHotels, canInstantBook, computeStayTotal, fulfillmentLabel, nightsBetween } from "@/lib/hotel-booking";

export function getHotelById(id: string) {
  return mockDb.hotels.find((h) => h.id === id);
}

export function getTourIncludedStays(tourId: string) {
  return mockDb.tourIncludedStays.filter((s) => s.tourId === tourId);
}

export function searchProperties(query: HotelSearchQuery) {
  return searchHotels(
    mockDb.hotels,
    mockDb.hotelRooms,
    mockDb.inventoryNights,
    query,
  );
}

export function getHotelBookingsForUser(userId: string) {
  return mockDb.hotelBookings
    .filter((b) => b.userId === userId)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function getHotelBookingByRef(reference: string) {
  return mockDb.hotelBookings.find((b) => b.reference === reference);
}

export function getPendingHotelBookings() {
  return mockDb.hotelBookings.filter(
    (b) => b.status === "pending_confirmation",
  );
}

function reserveInventory(
  hotelId: string,
  roomTypeId: string,
  checkIn: string,
  checkOut: string,
) {
  const dates = datesInStay(checkIn, checkOut);
  for (const date of dates) {
    const row = mockDb.inventoryNights.find(
      (n) =>
        n.hotelId === hotelId &&
        n.roomTypeId === roomTypeId &&
        n.date === date,
    );
    if (row) {
      row.bookedUnits = Math.min(row.totalUnits, row.bookedUnits + 1);
    }
  }
  syncRoomAggregate(hotelId, roomTypeId);
}

function releaseInventory(
  hotelId: string,
  roomTypeId: string,
  checkIn: string,
  checkOut: string,
) {
  const dates = datesInStay(checkIn, checkOut);
  for (const date of dates) {
    const row = mockDb.inventoryNights.find(
      (n) =>
        n.hotelId === hotelId &&
        n.roomTypeId === roomTypeId &&
        n.date === date,
    );
    if (row) {
      row.bookedUnits = Math.max(0, row.bookedUnits - 1);
    }
  }
  syncRoomAggregate(hotelId, roomTypeId);
}

function syncRoomAggregate(hotelId: string, roomTypeId: string) {
  const room = mockDb.hotelRooms.find((r) => r.id === roomTypeId);
  if (!room) return;
  const today = new Date().toISOString().slice(0, 10);
  const tonight = mockDb.inventoryNights.find(
    (n) =>
      n.hotelId === hotelId &&
      n.roomTypeId === roomTypeId &&
      n.date === today,
  );
  if (tonight) {
    room.available = Math.max(
      0,
      tonight.totalUnits - tonight.bookedUnits - tonight.heldUnits,
    );
  }
}

export interface CreateHotelBookingInput {
  userId: string;
  customerName: string;
  hotelId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  source?: HotelBooking["source"];
  linkedTourBookingRef?: string;
}

export function createHotelBooking(
  input: CreateHotelBookingInput,
): HotelBooking {
  const hotel = getHotelById(input.hotelId);
  const room = mockDb.hotelRooms.find((r) => r.id === input.roomTypeId);
  if (!hotel || !room) throw new Error("Property or room not found");

  const nights = datesInStay(input.checkIn, input.checkOut).length;
  if (nights < 1) throw new Error("Invalid stay dates");

  const amountUsd = computeStayTotal(room.rateUsd, input.checkIn, input.checkOut);
  const instant = canInstantBook(
    hotel,
    room,
    mockDb.inventoryNights,
    input.checkIn,
    input.checkOut,
    input.guests,
  );

  if (hotel.fulfillmentType !== "on_request" && !instant) {
    throw new Error("No availability for selected dates");
  }

  const now = new Date().toISOString();
  const booking: HotelBooking = {
    id: nextId("hb"),
    reference: nextHotelReference(mockDb.hotelBookings),
    userId: input.userId,
    customerName: input.customerName,
    hotelId: hotel.id,
    hotelName: hotel.name,
    roomTypeId: room.id,
    roomTypeName: room.name,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    nights,
    amountUsd,
    status: instant ? "confirmed" : "pending_confirmation",
    fulfillmentType: hotel.fulfillmentType,
    source: input.source ?? "standalone",
    linkedTourBookingRef: input.linkedTourBookingRef,
    createdAt: now,
    confirmedAt: instant ? now : undefined,
    paymentStatus: instant ? "successful" : "pending",
  };

  mockDb.hotelBookings.unshift(booking);

  if (instant) {
    reserveInventory(hotel.id, room.id, input.checkIn, input.checkOut);
    if (hotel.fulfillmentType === "allotment") {
      room.available = Math.max(0, room.available - 1);
    }
    mockDb.notifications.unshift({
      id: nextId("ntf"),
      userId: input.userId,
      title: "Hotel confirmed",
      body: `${booking.reference} — ${hotel.name}, ${booking.checkIn} to ${booking.checkOut}.`,
      read: false,
      createdAt: now,
      category: "hotel",
    });
  } else {
    mockDb.notifications.unshift({
      id: nextId("ntf"),
      userId: input.userId,
      title: "Hotel request received",
      body: `${booking.reference} — we will confirm ${hotel.name} within ${hotel.confirmationSlaHours ?? 24}h.`,
      read: false,
      createdAt: now,
      category: "hotel",
    });
  }

  return booking;
}

export function confirmHotelBooking(id: string): HotelBooking | null {
  const booking = mockDb.hotelBookings.find((b) => b.id === id);
  if (!booking || booking.status !== "pending_confirmation") return null;

  const now = new Date().toISOString();
  booking.status = "confirmed";
  booking.confirmedAt = now;
  booking.paymentStatus = "successful";

  reserveInventory(
    booking.hotelId,
    booking.roomTypeId,
    booking.checkIn,
    booking.checkOut,
  );

  mockDb.notifications.unshift({
    id: nextId("ntf"),
    userId: booking.userId,
    title: "Hotel confirmed",
    body: `${booking.reference} — ${booking.hotelName} is confirmed for your stay.`,
    read: false,
    createdAt: now,
    category: "hotel",
  });

  return booking;
}

export function declineHotelBooking(
  id: string,
  reason: string,
): HotelBooking | null {
  const booking = mockDb.hotelBookings.find((b) => b.id === id);
  if (!booking || booking.status !== "pending_confirmation") return null;

  booking.status = "declined";
  booking.declinedReason = reason;
  booking.paymentStatus = "refunded";

  mockDb.notifications.unshift({
    id: nextId("ntf"),
    userId: booking.userId,
    title: "Hotel unavailable",
    body: `${booking.reference} — ${reason}. A refund will be processed.`,
    read: false,
    createdAt: new Date().toISOString(),
    category: "hotel",
  });

  return booking;
}

export function updateRoomInventory(
  roomId: string,
  patch: { available?: number; total?: number; rateUsd?: number },
) {
  const room = mockDb.hotelRooms.find((r) => r.id === roomId);
  if (!room) return null;
  Object.assign(room, patch);
  return room;
}

export function getInventoryForProperty(hotelId: string, days = 14) {
  const start = new Date();
  const end = new Date();
  end.setDate(end.getDate() + days);
  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);
  return mockDb.inventoryNights.filter(
    (n) =>
      n.hotelId === hotelId &&
      n.date >= startStr &&
      n.date <= endStr,
  );
}

export async function mockHotelFetch<T>(data: T) {
  return mockFetch(data);
}
