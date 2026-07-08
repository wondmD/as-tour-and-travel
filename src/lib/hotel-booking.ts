import type {
  Hotel,
  HotelBooking,
  HotelFulfillmentType,
  HotelRoom,
  HotelSearchQuery,
  InventoryNight,
} from "@/lib/types";

export function nightsBetween(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function datesInStay(checkIn: string, checkOut: string): string[] {
  const nights = nightsBetween(checkIn, checkOut);
  if (nights <= 0) return [];
  const dates: string[] = [];
  const cursor = new Date(checkIn);
  for (let i = 0; i < nights; i++) {
    dates.push(cursor.toISOString().slice(0, 10));
    cursor.setDate(cursor.getDate() + 1);
  }
  return dates;
}

export function availableUnitsForNight(
  inventory: InventoryNight[],
  hotelId: string,
  roomTypeId: string,
  date: string,
): number {
  const row = inventory.find(
    (n) =>
      n.hotelId === hotelId &&
      n.roomTypeId === roomTypeId &&
      n.date === date,
  );
  if (!row) return 0;
  return Math.max(0, row.totalUnits - row.bookedUnits - row.heldUnits);
}

export function minAvailableUnits(
  inventory: InventoryNight[],
  hotelId: string,
  roomTypeId: string,
  checkIn: string,
  checkOut: string,
): number {
  const dates = datesInStay(checkIn, checkOut);
  if (dates.length === 0) return 0;
  return Math.min(
    ...dates.map((d) =>
      availableUnitsForNight(inventory, hotelId, roomTypeId, d),
    ),
  );
}

export function canInstantBook(
  hotel: Hotel,
  room: HotelRoom,
  inventory: InventoryNight[],
  checkIn: string,
  checkOut: string,
  guests: number,
): boolean {
  if (hotel.fulfillmentType === "on_request") return false;
  if (guests > room.maxGuests) return false;
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return false;

  if (hotel.fulfillmentType === "instant") {
    return (
      minAvailableUnits(inventory, hotel.id, room.id, checkIn, checkOut) >= 1
    );
  }

  // allotment — use room-level aggregate as fallback
  if (hotel.fulfillmentType === "allotment") {
    const invMin = minAvailableUnits(
      inventory,
      hotel.id,
      room.id,
      checkIn,
      checkOut,
    );
    if (invMin > 0) return true;
    return room.available >= 1;
  }

  return false;
}

export function computeStayTotal(rateUsd: number, checkIn: string, checkOut: string) {
  return rateUsd * nightsBetween(checkIn, checkOut);
}

export interface HotelSearchResult {
  hotel: Hotel;
  rooms: HotelRoom[];
  fromRateUsd: number;
  instantBook: boolean;
}

export function searchHotels(
  hotels: Hotel[],
  rooms: HotelRoom[],
  inventory: InventoryNight[],
  query: HotelSearchQuery,
): HotelSearchResult[] {
  const nights = nightsBetween(query.checkIn, query.checkOut);
  if (nights < 1) return [];

  return hotels
    .filter((h) => h.status === "active")
    .filter((h) => !query.city || h.city.toLowerCase().includes(query.city.toLowerCase()))
    .filter((h) => !query.instantOnly || h.fulfillmentType !== "on_request")
    .map((hotel) => {
      const hotelRooms = rooms.filter((r) => r.hotelId === hotel.id);
      const bookable = hotelRooms.filter(
        (r) =>
          r.maxGuests >= query.guests &&
          (hotel.fulfillmentType === "on_request" ||
            canInstantBook(hotel, r, inventory, query.checkIn, query.checkOut, query.guests)),
      );
      const instantBook = bookable.some((r) =>
        canInstantBook(hotel, r, inventory, query.checkIn, query.checkOut, query.guests),
      );
      const fromRateUsd =
        bookable.length > 0
          ? Math.min(...bookable.map((r) => r.rateUsd))
          : hotel.avgRateUsd;

      return {
        hotel,
        rooms: hotelRooms,
        fromRateUsd,
        instantBook,
      };
    })
    .filter((r) => r.rooms.length > 0);
}

export function fulfillmentLabel(type: HotelFulfillmentType): string {
  switch (type) {
    case "instant":
      return "Instant confirmation";
    case "allotment":
      return "Instant (allotment)";
    case "on_request":
      return "Confirm within 24h";
  }
}

export function nextHotelReference(existing: HotelBooking[]): string {
  const nums = existing
    .map((b) => parseInt(b.reference.replace("HTL-", ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = nums.length ? Math.max(...nums) + 1 : 1001;
  return `HTL-${next}`;
}

/** Generate inventory rows for seed data. */
export function buildInventorySeed(
  hotelId: string,
  roomTypeId: string,
  totalUnits: number,
  startDate: string,
  dayCount: number,
): InventoryNight[] {
  const rows: InventoryNight[] = [];
  const cursor = new Date(startDate);
  for (let i = 0; i < dayCount; i++) {
    const date = cursor.toISOString().slice(0, 10);
    rows.push({
      id: `inv-${hotelId}-${roomTypeId}-${date}`,
      hotelId,
      roomTypeId,
      date,
      totalUnits,
      bookedUnits: 0,
      heldUnits: 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return rows;
}
