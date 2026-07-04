"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Church,
  Coffee,
  Footprints,
  LogIn,
  LogOut,
  MapPin,
  Mountain,
  Palette,
  Play,
  Ship,
  Sparkles,
  TreePine,
  Utensils,
  UtensilsCrossed,
  Bird,
  Building2,
  Clock,
  CalendarClock,
  BookOpen,
} from "lucide-react";
import type { Destination } from "@/data/tour-001";
import { ease, spring } from "@/lib/motion";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  coffee: Coffee,
  museum: Building2,
  walk: Footprints,
  utensils: Utensils,
  hiking: Mountain,
  church: Church,
  camera: Camera,
  palette: Palette,
  kayak: Ship,
  spa: Sparkles,
  bird: Bird,
  wildlife: TreePine,
  boat: Ship,
  culture: Palette,
};

type DetailTab = "overview" | "schedule" | "gallery" | "location";

const tabs: { id: DetailTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "schedule", label: "Day Plan", icon: CalendarClock },
  { id: "gallery", label: "Photos", icon: Camera },
  { id: "location", label: "Location", icon: MapPin },
];

function DetailSection({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5">
        {Icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        )}
        <h4 className="font-heading text-base font-bold text-text-primary md:text-lg">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );
}

function parseScheduleEntry(entry: string) {
  const parts = entry.split(" — ");
  if (parts.length >= 2) {
    return { time: parts[0].trim(), label: parts.slice(1).join(" — ").trim() };
  }
  return { time: null, label: entry };
}

interface DestinationDetailsProps {
  destination: Destination;
  dark?: boolean;
}

export function DestinationDetails({ destination, dark = false }: DestinationDetailsProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  return (
    <div
      className={`overflow-hidden rounded-[18px] ring-1 sm:rounded-[22px] ${
        dark
          ? "bg-slate-900 ring-indigo-400/20"
          : "bg-surface ring-border/60 shadow-xl shadow-primary/5"
      }`}
    >
      {/* Hero banner */}
      <div className="group relative aspect-[2/1] overflow-hidden sm:aspect-[21/9]">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1024px) 100vw, 60vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
          {destination.region} · Ethiopia
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-white shadow-lg shadow-accent/30">
            Day {destination.day}
          </span>
          <p className="mt-2 font-heading text-xl font-bold text-white md:text-2xl">
            {destination.name}
          </p>
          <p className="text-sm text-white/70">{destination.region}</p>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={`flex gap-1 overflow-x-auto border-b px-2 py-2 scrollbar-none sm:px-3 md:px-4 ${
          dark ? "border-white/10 bg-slate-900/80" : "border-border/60 bg-surface/95"
        }`}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2.5 text-xs font-semibold transition-colors sm:gap-2 sm:px-3 sm:py-2 sm:text-sm md:px-4 ${
                isActive
                  ? dark
                    ? "bg-indigo-500/20 text-indigo-200"
                    : "bg-primary/10 text-primary"
                  : dark
                    ? "text-white/50 hover:bg-white/5 hover:text-white/80"
                    : "text-text-secondary hover:bg-primary/5 hover:text-text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab panels */}
      <div className={`px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 ${dark ? "text-white" : ""}`}>
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
            >
              <DetailSection title="About This Stop">
                <div
                  className={`rounded-[20px] border p-5 md:p-6 ${
                    dark
                      ? "border-white/10 bg-white/5"
                      : "border-border/60 bg-surface/80"
                  }`}
                >
                  <p
                    className={`text-sm leading-relaxed md:text-base ${
                      dark ? "text-white/75" : "text-text-secondary"
                    }`}
                  >
                    {destination.introduction}
                  </p>
                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div
                      className={`rounded-2xl border-l-4 border-primary p-4 ${
                        dark ? "bg-primary/10" : "bg-primary/5"
                      }`}
                    >
                      <h5
                        className={`font-heading text-sm font-semibold ${
                          dark ? "text-primary-light" : "text-primary"
                        }`}
                      >
                        Historical & Cultural Background
                      </h5>
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          dark ? "text-white/65" : "text-text-secondary"
                        }`}
                      >
                        {destination.history}
                      </p>
                    </div>
                    <div
                      className={`rounded-2xl border-l-4 border-secondary p-4 ${
                        dark ? "bg-secondary/10" : "bg-secondary/5"
                      }`}
                    >
                      <h5 className="font-heading text-sm font-semibold text-secondary">
                        Why It&apos;s Included
                      </h5>
                      <p
                        className={`mt-2 text-sm leading-relaxed ${
                          dark ? "text-white/65" : "text-text-secondary"
                        }`}
                      >
                        {destination.whyIncluded}
                      </p>
                    </div>
                  </div>
                </div>
              </DetailSection>
            </motion.div>
          )}

          {activeTab === "schedule" && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
            >
              <DetailSection title="Day Schedule & Activities" icon={CalendarClock}>
                <div
                  className={`overflow-hidden rounded-[20px] border shadow-sm ${
                    dark
                      ? "border-white/10 bg-white/5"
                      : "border-border/60 bg-surface/90"
                  }`}
                >
                  <div
                    className={`grid grid-cols-1 gap-px sm:grid-cols-3 ${
                      dark ? "bg-white/10" : "bg-border/60"
                    }`}
                  >
                    {[
                      { icon: LogIn, label: "Arrival", value: destination.schedule.arrival, color: "primary" },
                      { icon: Clock, label: "Duration", value: destination.schedule.duration, color: "secondary" },
                      { icon: LogOut, label: "Departure", value: destination.schedule.departure, color: "accent" },
                    ].map(({ icon: Icon, label, value, color }) => (
                      <div
                        key={label}
                        className={`flex items-start gap-3 p-4 ${dark ? "bg-slate-900" : "bg-surface"}`}
                      >
                        <span
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-${color}/10 text-${color}`}
                          style={{
                            backgroundColor:
                              color === "primary"
                                ? "rgba(48,112,130,0.1)"
                                : color === "secondary"
                                  ? "rgba(108,163,162,0.1)"
                                  : "rgba(234,153,64,0.1)",
                            color:
                              color === "primary"
                                ? "#307082"
                                : color === "secondary"
                                  ? "#6CA3A2"
                                  : "#EA9940",
                          }}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {label}
                          </p>
                          <p
                            className={`mt-0.5 text-sm ${
                              dark ? "text-white/65" : "text-text-secondary"
                            }`}
                          >
                            {value}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 md:p-6">
                    <div className="relative space-y-0">
                      <div
                        className="absolute bottom-4 left-[18px] top-4 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent md:left-[19px]"
                        aria-hidden
                      />

                      {destination.schedule.activities.map((entry, index) => {
                        const { time, label } = parseScheduleEntry(entry);
                        const activity = destination.activities[index];
                        const Icon = activity
                          ? iconMap[activity.icon] || UtensilsCrossed
                          : Clock;

                        return (
                          <motion.div
                            key={entry}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.06, duration: 0.35, ease }}
                            className="relative pb-6 last:pb-0"
                          >
                            <div className="flex gap-4">
                              <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-primary to-primary-light shadow-md shadow-primary/20">
                                <Icon className="h-3.5 w-3.5 text-white" />
                              </div>

                              <div className="min-w-0 flex-1">
                                <div
                                  className={`rounded-2xl border p-4 transition-colors ${
                                    dark
                                      ? "border-white/10 bg-white/5 hover:border-white/20"
                                      : "border-border/50 bg-background/60 hover:border-primary/20 hover:bg-background"
                                  }`}
                                >
                                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    {time && (
                                      <span className="font-mono text-xs font-semibold text-primary">
                                        {time}
                                      </span>
                                    )}
                                    <span
                                      className={`text-sm font-medium ${
                                        dark ? "text-white" : "text-text-primary"
                                      }`}
                                    >
                                      {label}
                                    </span>
                                  </div>

                                  {activity && (
                                    <div
                                      className={`mt-3 flex gap-3 border-t pt-3 ${
                                        dark ? "border-white/10" : "border-border/40"
                                      }`}
                                    >
                                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                        <Icon className="h-4 w-4" />
                                      </div>
                                      <div>
                                        <p
                                          className={`font-heading text-sm font-semibold ${
                                            dark ? "text-white" : "text-text-primary"
                                          }`}
                                        >
                                          {activity.title}
                                        </p>
                                        <p
                                          className={`mt-0.5 text-xs leading-relaxed ${
                                            dark ? "text-white/60" : "text-text-secondary"
                                          }`}
                                        >
                                          {activity.description}
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}

                      {destination.activities.length >
                        destination.schedule.activities.length && (
                        <div className="relative mt-2 space-y-3 pl-[52px]">
                          {destination.activities
                            .slice(destination.schedule.activities.length)
                            .map((activity) => {
                              const Icon = iconMap[activity.icon] || UtensilsCrossed;
                              return (
                                <div
                                  key={activity.title}
                                  className={`flex gap-3 rounded-2xl border border-dashed p-4 ${
                                    dark
                                      ? "border-white/15 bg-white/5"
                                      : "border-border/60 bg-background/40"
                                  }`}
                                >
                                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <p
                                      className={`font-heading text-sm font-semibold ${
                                        dark ? "text-white" : "text-text-primary"
                                      }`}
                                    >
                                      {activity.title}
                                    </p>
                                    <p
                                      className={`mt-0.5 text-xs ${
                                        dark ? "text-white/60" : "text-text-secondary"
                                      }`}
                                    >
                                      {activity.description}
                                    </p>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DetailSection>
            </motion.div>
          )}

          {activeTab === "gallery" && (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
              className="space-y-8"
            >
              <DetailSection title="Photo Gallery" icon={Camera}>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
                  {destination.gallery.map((src, i) => (
                    <motion.div
                      key={src}
                      whileHover={{ scale: 1.03 }}
                      transition={spring}
                      className={`relative overflow-hidden rounded-2xl ring-1 ring-border/40 ${
                        i === 0 ? "col-span-2 aspect-[2/1] md:col-span-2 md:aspect-[21/9]" : "aspect-square"
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`${destination.name} gallery ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </motion.div>
                  ))}
                </div>
              </DetailSection>

              {destination.videos.length > 0 && (
                <DetailSection title="Videos" icon={Play}>
                  <div className="grid gap-4 md:grid-cols-2">
                    {destination.videos.map((video) => (
                      <div
                        key={video.title}
                        className={`overflow-hidden rounded-2xl ring-1 ${
                          dark ? "ring-white/10" : "ring-border/50"
                        }`}
                      >
                        {activeVideo === video.url ? (
                          <div className="relative aspect-video">
                            <iframe
                              src={video.url}
                              title={video.title}
                              className="absolute inset-0 h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setActiveVideo(video.url)}
                            className="group relative block aspect-video w-full"
                          >
                            <Image
                              src={video.thumbnail}
                              alt={video.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/45">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl"
                              >
                                <Play className="h-6 w-6 fill-primary text-primary" />
                              </motion.div>
                            </div>
                            <p className="absolute bottom-3 left-3 text-sm font-semibold text-white drop-shadow">
                              {video.title}
                            </p>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </DetailSection>
              )}
            </motion.div>
          )}

          {activeTab === "location" && (
            <motion.div
              key="location"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease }}
            >
              <DetailSection title="Location & Coordinates" icon={MapPin}>
                <div
                  className={`rounded-[20px] border p-5 md:p-6 ${
                    dark
                      ? "border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent"
                      : "border-border/60 bg-gradient-to-br from-primary/5 to-transparent"
                  }`}
                >
                  <p
                    className={`flex items-start gap-2.5 text-sm ${
                      dark ? "text-white/70" : "text-text-secondary"
                    }`}
                  >
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {destination.address}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-4 text-sm">
                    <p>
                      <span
                        className={`font-semibold ${dark ? "text-white" : "text-text-primary"}`}
                      >
                        Region
                      </span>
                      <span className={`ml-2 ${dark ? "text-white/60" : "text-text-secondary"}`}>
                        {destination.region}
                      </span>
                    </p>
                    <p>
                      <span
                        className={`font-semibold ${dark ? "text-white" : "text-text-primary"}`}
                      >
                        Coordinates
                      </span>
                      <span
                        className={`ml-2 font-mono text-xs ${dark ? "text-white/60" : "text-text-secondary"}`}
                      >
                        {destination.coordinates.lat.toFixed(4)}°,{" "}
                        {destination.coordinates.lng.toFixed(4)}°
                      </span>
                    </p>
                  </div>
                </div>
              </DetailSection>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
