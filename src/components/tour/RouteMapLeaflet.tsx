"use client";

import { useEffect, useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import type { Destination } from "@/data/tour-001";
import {
  destinationsToRoute,
  getRouteProgressCoords,
  type LatLngTuple,
  ETHIOPIA_DEFAULT_ZOOM,
  ETHIOPIA_MAP_CENTER,
} from "@/lib/route-geo";
import "leaflet/dist/leaflet.css";

interface RouteMapLeafletProps {
  destinations: Destination[];
  flowProgress: number;
  travelerPosition: LatLngTuple | null;
  carBearing: number;
}

function createStopIcon(day: number) {
  return L.divIcon({
    className: "leaflet-stop-icon-wrapper",
    html: `<div class="leaflet-stop-icon" style="background:#307082;box-shadow:0 0 0 4px rgba(48,112,130,0.25)"><span>${day}</span></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function createCarIcon(bearing: number) {
  return L.divIcon({
    className: "leaflet-car-icon-wrapper",
    html: `<div class="leaflet-car-icon" style="transform:rotate(${bearing}deg)">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <rect x="7" y="9" width="3.5" height="7" rx="1.2" fill="#12212E"/>
        <rect x="21.5" y="9" width="3.5" height="7" rx="1.2" fill="#12212E"/>
        <rect x="7" y="18" width="3.5" height="7" rx="1.2" fill="#12212E"/>
        <rect x="21.5" y="18" width="3.5" height="7" rx="1.2" fill="#12212E"/>
        <rect x="10" y="5" width="12" height="22" rx="4" fill="#EA9940" stroke="#ffffff" stroke-width="1.5"/>
        <rect x="11.5" y="7" width="9" height="8" rx="2" fill="#ffffff" opacity="0.92"/>
        <rect x="11.5" y="18.5" width="9" height="5.5" rx="1.5" fill="#ffffff" opacity="0.45"/>
        <rect x="10.5" y="4" width="4" height="2.5" rx="1" fill="#F0AD63"/>
        <rect x="17.5" y="4" width="4" height="2.5" rx="1" fill="#F0AD63"/>
        <rect x="12" y="25.5" width="8" height="2" rx="0.75" fill="#C97D2E"/>
      </svg>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function MapFitBounds({ route }: { route: LatLngTuple[] }) {
  const map = useMap();

  useEffect(() => {
    if (route.length === 0) return;
    const bounds = L.latLngBounds(route);
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 7, animate: false });
  }, [map, route]);

  return null;
}

export function RouteMapLeaflet({
  destinations,
  flowProgress,
  travelerPosition,
  carBearing,
}: RouteMapLeafletProps) {
  const route = useMemo(() => destinationsToRoute(destinations), [destinations]);
  const progressRoute = useMemo(
    () => getRouteProgressCoords(route, flowProgress),
    [route, flowProgress]
  );

  const carIcon = useMemo(() => createCarIcon(carBearing), [carBearing]);

  return (
    <MapContainer
      center={ETHIOPIA_MAP_CENTER}
      zoom={ETHIOPIA_DEFAULT_ZOOM}
      className="h-full w-full rounded-[18px] z-0"
      scrollWheelZoom
      zoomControl
      attributionControl
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapFitBounds route={route} />

      <Polyline
        positions={route}
        pathOptions={{
          color: "#6CA3A2",
          weight: 8,
          opacity: 0.12,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      <Polyline
        positions={route}
        pathOptions={{
          color: "#307082",
          weight: 5,
          opacity: 0.3,
          lineCap: "round",
          lineJoin: "round",
        }}
      />

      {progressRoute.length > 1 && (
        <Polyline
          positions={progressRoute}
          pathOptions={{
            color: "#EA9940",
            weight: 4,
            opacity: 0.92,
            lineCap: "round",
            lineJoin: "round",
          }}
        />
      )}

      {destinations.map((dest) => (
        <Marker
          key={dest.id}
          position={[dest.coordinates.lat, dest.coordinates.lng]}
          icon={createStopIcon(dest.day)}
        />
      ))}

      {travelerPosition && (
        <Marker position={travelerPosition} icon={carIcon} zIndexOffset={1000} />
      )}
    </MapContainer>
  );
}
