"use client";

import { ArrowRight, Globe2, Plane, Plus, Trash2 } from "lucide-react";
import { Badge, Button, Card, CardContent, EmptyState, Input, Progress } from "@/components/ui";
import type { TravelHub, TravelPlanKind, TravelPlanStop } from "@/lib/types";
import {
  TRAVEL_KIND_DESCRIPTIONS,
  TRAVEL_KIND_LABELS,
  filterHubsForKind,
  formatShortDate,
  hubLabel,
  normalizeTravelStops,
  routeSummary,
  suggestNextArrivalDate,
  travelPlanCompletion,
} from "@/lib/travel-plan";
import { cn } from "@/lib/cn";

interface TravelRouteStripProps {
  stops: TravelPlanStop[];
  onRemove?: (id: string) => void;
  readOnly?: boolean;
}

export function TravelRouteStrip({ stops, onRemove, readOnly }: TravelRouteStripProps) {
  const sorted = normalizeTravelStops(stops);

  if (sorted.length === 0) {
    return (
      <EmptyState
        icon={Globe2}
        title="No stops on your route"
        description="Add cities in the order you will visit them — country and city only, no detailed tour content."
      />
    );
  }

  return (
    <ol className="space-y-0">
      {sorted.map((stop, index) => (
        <li key={stop.id} className="relative flex gap-3 pb-4">
          {index < sorted.length - 1 && (
            <span
              className="absolute start-4 top-10 bottom-0 w-px bg-border"
              aria-hidden
            />
          )}
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-white text-xs font-bold text-primary">
            {stop.sortOrder}
          </span>
          <div className="min-w-0 flex-1 rounded-xl border border-border/70 bg-white px-4 py-3 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-text-secondary">
                  {stop.countryName} · {stop.countryCode}
                </p>
                <p className="font-heading text-base font-bold text-text-primary">
                  {stop.city}
                </p>
                <p className="mt-1 text-xs text-text-secondary">
                  Arrive {formatShortDate(stop.arrivalDate)}
                  {stop.nights > 0
                    ? ` · ${stop.nights} night${stop.nights === 1 ? "" : "s"}`
                    : " · transit"}
                </p>
              </div>
              {!readOnly && onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Remove stop"
                  onClick={() => onRemove(stop.id)}
                >
                  <Trash2 className="size-4 text-danger" />
                </Button>
              )}
            </div>
          </div>
          {index < sorted.length - 1 && (
            <ArrowRight className="absolute -bottom-1 start-3 size-4 text-text-secondary/50 md:hidden" />
          )}
        </li>
      ))}
    </ol>
  );
}

interface TravelKindSelectorProps {
  value: TravelPlanKind;
  onChange: (kind: TravelPlanKind) => void;
}

const KINDS: TravelPlanKind[] = [
  "inbound_international",
  "outbound_international",
  "round_trip_international",
  "domestic",
  "multi_country",
];

export function TravelKindSelector({ value, onChange }: TravelKindSelectorProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {KINDS.map((kind) => (
        <button
          key={kind}
          type="button"
          onClick={() => onChange(kind)}
          className={cn(
            "rounded-xl border px-4 py-3 text-start transition-colors",
            value === kind
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-border/70 bg-white hover:border-primary/30",
          )}
        >
          <p className="font-semibold text-text-primary">{TRAVEL_KIND_LABELS[kind]}</p>
          <p className="mt-0.5 text-xs text-text-secondary">
            {TRAVEL_KIND_DESCRIPTIONS[kind]}
          </p>
        </button>
      ))}
    </div>
  );
}

interface TravelHubPickerProps {
  hubs: TravelHub[];
  kind: TravelPlanKind;
  onAdd: (hub: TravelHub, nights: number) => void;
}

export function TravelHubPicker({ hubs, kind, onAdd }: TravelHubPickerProps) {
  const filtered = filterHubsForKind(hubs, kind);
  const ethiopia = filtered.filter((h) => h.isEthiopia);
  const international = filtered.filter((h) => !h.isEthiopia);

  const renderGroup = (title: string, list: TravelHub[]) =>
    list.length > 0 && (
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-text-secondary">
          {title}
        </p>
        <div className="flex flex-wrap gap-2">
          {list.map((hub) => (
            <button
              key={hub.id}
              type="button"
              onClick={() => onAdd(hub, hub.isEthiopia ? 2 : 0)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-white px-3 py-2 text-sm font-medium text-text-primary hover:border-primary/40 hover:bg-primary/5"
            >
              <Plus className="size-3.5 text-primary" />
              {hubLabel(hub)}
            </button>
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-4">
      <p className="text-xs text-text-secondary">
        Tap a city to add it to your route. Stops are simple country + city — not full tour
        destinations.
      </p>
      {renderGroup("Ethiopia", ethiopia)}
      {renderGroup("International", international)}
    </div>
  );
}

export function TravelDesignerProgress({ stops, name, travelerCount }: {
  stops: TravelPlanStop[];
  name: string;
  travelerCount: number;
}) {
  const pct = travelPlanCompletion({ name, stops, travelerCount });
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-secondary">
        <span>Route: {routeSummary(stops)}</span>
        <span>{pct}%</span>
      </div>
      <Progress value={pct} max={100} />
    </div>
  );
}

export function TravelPlanStatusBadge({ status }: { status: string }) {
  const variant =
    status === "confirmed"
      ? "success"
      : status === "quoted"
        ? "info"
        : status === "submitted"
          ? "warning"
          : status === "cancelled"
            ? "neutral"
            : "neutral";
  return (
    <Badge variant={variant} className="capitalize">
      {status.replace(/_/g, " ")}
    </Badge>
  );
}

export function TravelDesignerHeader() {
  return (
    <div className="flex items-start gap-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Plane className="size-5" />
      </span>
      <div>
        <Badge variant="primary" dot>
          Travel designer
        </Badge>
        <h1 className="mt-2 font-heading text-2xl font-bold text-text-primary">
          Design your journey
        </h1>
        <p className="mt-1 max-w-xl text-sm text-text-secondary">
          Plan international or domestic travel — from abroad to Ethiopia, Ethiopia abroad, or
          city-to-city within a country. AS Tour coordinates the connections.
        </p>
      </div>
    </div>
  );
}

interface StopEditorRowProps {
  stop: TravelPlanStop;
  onChange: (patch: Partial<TravelPlanStop>) => void;
}

export function StopEditorRow({ stop, onChange }: StopEditorRowProps) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      <div className="sm:col-span-1">
        <p className="text-sm font-semibold text-text-primary">
          {stop.city}, {stop.countryName}
        </p>
      </div>
      <label className="space-y-1">
        <span className="text-xs text-text-secondary">Arrival</span>
        <Input
          type="date"
          value={stop.arrivalDate}
          onChange={(e) => onChange({ arrivalDate: e.target.value })}
        />
      </label>
      <label className="space-y-1">
        <span className="text-xs text-text-secondary">Nights (0 = transit)</span>
        <Input
          type="number"
          min={0}
          max={30}
          value={stop.nights}
          onChange={(e) => onChange({ nights: Number(e.target.value) })}
        />
      </label>
    </div>
  );
}

export function useTravelStopActions(
  stops: TravelPlanStop[],
  setStops: (s: TravelPlanStop[]) => void,
  kind: TravelPlanKind,
) {
  const addHub = (hub: TravelHub, defaultNights: number) => {
    const arrivalDate = suggestNextArrivalDate(stops);
    const stop: TravelPlanStop = {
      id: `ts-${Date.now().toString(36)}`,
      hubId: hub.id,
      countryCode: hub.countryCode,
      countryName: hub.countryName,
      city: hub.city,
      arrivalDate,
      nights: defaultNights,
      sortOrder: stops.length + 1,
    };
    setStops(normalizeTravelStops([...stops, stop]));
  };

  const removeStop = (id: string) => {
    setStops(normalizeTravelStops(stops.filter((s) => s.id !== id)));
  };

  const updateStop = (id: string, patch: Partial<TravelPlanStop>) => {
    setStops(
      normalizeTravelStops(
        stops.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      ),
    );
  };

  return { addHub, removeStop, updateStop };
}
