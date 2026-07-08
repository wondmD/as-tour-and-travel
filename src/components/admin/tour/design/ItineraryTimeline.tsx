"use client";

import Image from "next/image";
import { Calendar, GripVertical, MapPin, Moon, Pencil, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Badge, Button, EmptyState, Progress } from "@/components/ui";
import {
  computeTourDurationDays,
  departureDate,
  formatDisplayDate,
  formatShortDate,
} from "@/lib/tour-itinerary";
import type { TourItineraryStop } from "@/lib/types";
import { cn } from "@/lib/cn";

interface ItineraryTimelineProps {
  tourStartDate: string;
  stops: TourItineraryStop[];
  selectedStopId: string | null;
  onSelectStop: (id: string) => void;
  onRemoveStop: (id: string) => void;
  onMoveStop: (id: string, direction: "up" | "down") => void;
  onAddStop: () => void;
}

export function ItineraryTimeline({
  tourStartDate,
  stops,
  selectedStopId,
  onSelectStop,
  onRemoveStop,
  onMoveStop,
  onAddStop,
}: ItineraryTimelineProps) {
  const durationDays = computeTourDurationDays(stops, tourStartDate);
  const progress =
    stops.length === 0 ? 0 : Math.min((stops.length / 5) * 100, 100);

  if (stops.length === 0) {
    return (
      <div className="glass-card flex min-h-[420px] flex-col items-center justify-center p-8">
        <EmptyState
          icon={MapPin}
          title="No destinations on the route yet"
          description="Pick destinations from the catalog on the right — each stop gets an arrival date on the timeline."
          action={
            <Button size="sm" onClick={onAddStop}>
              <Plus className="size-4" />
              Add first stop
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Route progress strip — inspired by RouteRoadTrack */}
      <div className="glass-card p-4">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          <span>Day 1 · {formatShortDate(tourStartDate)}</span>
          <span>{stops.length} stops · {durationDays} days</span>
          <span>Day {durationDays}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
            animate={{ width: `${Math.max(progress, 8)}%` }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {stops.map((stop, index) => (
            <button
              key={stop.id}
              type="button"
              onClick={() => onSelectStop(stop.id)}
              className={cn(
                "flex shrink-0 flex-col items-center gap-1 rounded-xl border px-2 py-1.5 text-center transition-colors",
                selectedStopId === stop.id
                  ? "border-accent bg-accent/10"
                  : "border-border/60 bg-white/60 hover:border-primary/30",
              )}
            >
              <span className="text-[10px] font-bold text-text-secondary">
                Day {stop.dayNumber}
              </span>
              <span className="max-w-[4.5rem] truncate text-xs font-semibold text-text-primary">
                {stop.destinationName}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Vertical timeline */}
      <div className="relative space-y-0">
        {/* Tour start anchor */}
        <div className="relative flex gap-4 pb-6">
          <div className="flex w-10 shrink-0 flex-col items-center">
            <div className="flex size-10 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-xs font-bold text-primary">
              1
            </div>
            <div className="mt-1 w-0.5 flex-1 bg-gradient-to-b from-primary/40 to-secondary/30" />
          </div>
          <div className="glass-card flex-1 p-4">
            <Badge variant="primary" dot>
              Tour start
            </Badge>
            <p className="mt-2 font-heading text-lg font-bold text-text-primary">
              Departure day
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-text-secondary">
              <Calendar className="size-3.5" />
              {formatDisplayDate(tourStartDate)}
            </p>
            <p className="mt-2 text-xs text-text-secondary">
              Day 1 — international arrival, briefing, or domestic connection before the first
              destination stop.
            </p>
          </div>
        </div>

        {stops.map((stop, index) => {
          const isSelected = selectedStopId === stop.id;
          const isLast = index === stops.length - 1;
          const leaveDate = departureDate(stop.arrivalDate, stop.nights);

          return (
            <div key={stop.id} className="relative flex gap-4 pb-6">
              <div className="flex w-10 shrink-0 flex-col items-center">
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-full border-2 text-xs font-bold",
                    isSelected
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-secondary bg-white text-secondary",
                  )}
                >
                  {stop.dayNumber}
                </div>
                {!isLast && (
                  <div className="mt-1 w-0.5 flex-1 bg-gradient-to-b from-secondary/40 to-accent/30" />
                )}
              </div>

              <motion.div
                layout
                className={cn(
                  "glass-card group flex-1 overflow-hidden transition-shadow",
                  isSelected && "ring-2 ring-accent/40",
                )}
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative aspect-[16/10] w-full shrink-0 sm:w-36 md:w-44">
                    <Image
                      src={stop.coverImage ?? "/images/stock/ethiopian-highlands.jpg"}
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                          Arrives {formatShortDate(stop.arrivalDate)}
                        </p>
                        <h3 className="font-heading text-lg font-bold text-text-primary">
                          {stop.destinationName}
                        </h3>
                        <p className="text-xs text-text-secondary">{stop.country}</p>
                      </div>
                      <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Move up"
                          disabled={index === 0}
                          onClick={() => onMoveStop(stop.id, "up")}
                        >
                          <GripVertical className="size-4 rotate-90" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Edit stop"
                          onClick={() => onSelectStop(stop.id)}
                        >
                          <Pencil className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label="Remove stop"
                          onClick={() => onRemoveStop(stop.id)}
                        >
                          <Trash2 className="size-4 text-danger" />
                        </Button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
                        <Calendar className="size-3" />
                        Arrival · {formatDisplayDate(stop.arrivalDate)}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-secondary/10 px-2.5 py-1 text-xs font-medium text-secondary">
                        <Moon className="size-3" />
                        {stop.nights} {stop.nights === 1 ? "night" : "nights"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">
                        Depart · {formatShortDate(leaveDate)}
                      </span>
                    </div>

                    {stop.notes && (
                      <p className="mt-3 text-sm text-text-secondary">{stop.notes}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface DesignSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function DesignSection({ title, description, children }: DesignSectionProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="font-heading text-base font-bold text-text-primary">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function BuilderProgress({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-3">
      <Progress value={value} max={100} className="flex-1" />
      <span className="text-xs font-semibold tabular-nums text-text-secondary">
        {value}%
      </span>
    </div>
  );
}
