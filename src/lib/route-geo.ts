import type { Destination } from "@/data/tour-001";

export type LatLngTuple = [number, number];

export function destinationsToRoute(destinations: Destination[]): LatLngTuple[] {
  return destinations.map((d) => [d.coordinates.lat, d.coordinates.lng]);
}

/** Interpolate position along route (t: 0–1) */
export function getPositionOnRoute(route: LatLngTuple[], t: number): LatLngTuple {
  if (route.length === 0) return [0, 0];
  if (route.length === 1) return route[0];

  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * (route.length - 1);
  const seg = Math.min(Math.floor(scaled), route.length - 2);
  const localT = scaled - seg;
  const [latA, lngA] = route[seg];
  const [latB, lngB] = route[seg + 1];

  return [latA + (latB - latA) * localT, lngA + (lngB - lngA) * localT];
}

/** Build polyline coords for traveled portion (0–1 progress) */
export function getRouteProgressCoords(
  route: LatLngTuple[],
  t: number
): LatLngTuple[] {
  if (route.length === 0) return [];
  if (t <= 0) return [route[0]];
  if (t >= 1) return route;

  const scaled = t * (route.length - 1);
  const seg = Math.floor(scaled);
  const localT = scaled - seg;
  const coords = route.slice(0, seg + 1);
  const [latA, lngA] = route[seg];
  const [latB, lngB] = route[Math.min(seg + 1, route.length - 1)];

  coords.push([latA + (latB - latA) * localT, lngA + (lngB - lngA) * localT]);
  return coords;
}

/** Bearing in degrees (0 = north) for car rotation along route */
export function getBearingOnRoute(route: LatLngTuple[], t: number): number {
  const delta = 0.003;
  const t1 = Math.max(0, t - delta);
  const t2 = Math.min(1, t + delta);
  const [lat1, lng1] = getPositionOnRoute(route, t1);
  const [lat2, lng2] = getPositionOnRoute(route, t2);

  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const rLat1 = (lat1 * Math.PI) / 180;
  const rLat2 = (lat2 * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(rLat2);
  const x =
    Math.cos(rLat1) * Math.sin(rLat2) -
    Math.sin(rLat1) * Math.cos(rLat2) * Math.cos(dLng);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

export const ETHIOPIA_MAP_CENTER: LatLngTuple = [9.15, 40.5];
export const ETHIOPIA_DEFAULT_ZOOM = 6;
