"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Destination } from "@/data/tour-001";
import { FadeIn } from "@/components/ui/FadeIn";
import { DestinationDetails } from "@/components/tour/DestinationDetails";
import { JourneySectionBackground } from "@/components/tour/JourneySectionBackground";
import { RouteRoadTrack } from "@/components/tour/RouteRoadTrack";
import { ShareStopButton } from "@/components/tour/ShareStopButton";
import { TourRouteMap } from "@/components/tour/TourRouteMap";
import { destinationMoods } from "@/lib/tour-utils";
import { ease } from "@/lib/motion";

interface TourRouteExplorerProps {
  destinations: Destination[];
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 48 : -48,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -48 : 48,
    opacity: 0,
  }),
};

function DetailPanelHeader({
  activeIndex,
  total,
  moodLabel,
  destination,
  onPrevious,
  onNext,
}: {
  activeIndex: number;
  total: number;
  moodLabel?: string;
  destination: Destination;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Stop {activeIndex + 1} of {total}
        </p>
        {moodLabel && (
          <p className="font-heading text-sm font-semibold text-text-secondary">
            {moodLabel}
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <ShareStopButton stopId={destination.id} stopName={destination.name} />
        <div className="glass-card-journey flex items-center rounded-xl p-1">
          <button
            type="button"
            onClick={onPrevious}
            disabled={activeIndex === 0}
            aria-label="Previous stop"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-primary/8 disabled:opacity-30 sm:h-9 sm:w-9"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="px-2 font-heading text-sm font-bold text-text-primary">
            {activeIndex + 1}/{total}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={activeIndex === total - 1}
            aria-label="Next stop"
            className="flex h-10 w-10 items-center justify-center rounded-lg text-text-primary transition-colors hover:bg-primary/8 disabled:opacity-30 sm:h-9 sm:w-9"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function TourRouteExplorer({ destinations }: TourRouteExplorerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const activeDestination = destinations[activeIndex];
  const mood = destinationMoods[activeDestination?.id ?? ""];

  const navigateTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(destinations.length - 1, index));
      setDirection(clamped > activeIndex ? 1 : clamped < activeIndex ? -1 : 0);
      setActiveIndex(clamped);
      window.history.replaceState(null, "", `#${destinations[clamped].id}`);
    },
    [destinations, activeIndex]
  );

  const goPrevious = () => navigateTo(activeIndex - 1);
  const goNext = () => navigateTo(activeIndex + 1);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const idx = destinations.findIndex((d) => d.id === hash);
    if (idx >= 0) {
      setDirection(0);
      setActiveIndex(idx);
    }
  }, [destinations]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        navigateTo(activeIndex - 1);
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        navigateTo(activeIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, navigateTo]);

  const routeProgress =
    destinations.length > 1 ? activeIndex / (destinations.length - 1) : 1;

  return (
    <section
      id="tour-route"
      className="scroll-mt-24 relative overflow-hidden py-10 sm:py-14 md:py-20 lg:py-24"
    >
      <JourneySectionBackground
        destinations={destinations}
        activeIndex={activeIndex}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <FadeIn blur className="mb-8 text-center sm:mb-10 md:mb-16">
          <span className="pill-badge mb-4">Interactive Itinerary</span>
          <h2 className="font-heading text-2xl font-bold gradient-text sm:text-3xl md:text-4xl">
            Your Journey
          </h2>
          <p className="mx-auto mt-3 max-w-xl px-2 text-sm text-text-secondary sm:text-base">
            Slide through each stop along the road — tap a destination on the route
            or use the arrows to explore.
          </p>
        </FadeIn>

        <div className="flex flex-col gap-6">
          <RouteRoadTrack
            destinations={destinations}
            activeIndex={activeIndex}
            progress={routeProgress}
            onSelect={navigateTo}
          />

          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,340px)] xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-8">
            <div className="flex min-w-0 flex-col gap-6">
              <div
                id={activeDestination.id}
                className="relative scroll-mt-28 overflow-hidden"
              >
                <DetailPanelHeader
                  activeIndex={activeIndex}
                  total={destinations.length}
                  moodLabel={mood?.label}
                  destination={activeDestination}
                  onPrevious={goPrevious}
                  onNext={goNext}
                />

                <div className="relative min-h-0 sm:min-h-[360px] md:min-h-[420px]">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={activeDestination.id}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease }}
                    >
                      <DestinationDetails destination={activeDestination} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 glass-card-journey rounded-[18px] p-2.5 shadow-lg sm:gap-3 sm:rounded-[22px] sm:p-3 lg:hidden">
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={activeIndex === 0}
                  className="flex min-h-11 items-center gap-1 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary disabled:opacity-30 sm:gap-1.5 sm:px-4"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                <div className="min-w-0 text-center">
                  <p className="truncate font-heading text-sm font-bold text-text-primary">
                    {activeDestination.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    Day {activeDestination.day} · Stop {activeIndex + 1} of{" "}
                    {destinations.length}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={activeIndex === destinations.length - 1}
                  className="flex min-h-11 items-center gap-1 rounded-xl bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary disabled:opacity-30 sm:gap-1.5 sm:px-4"
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <aside className="min-w-0 lg:sticky lg:top-28 lg:self-start">
              <TourRouteMap destinations={destinations} layout="sidebar" />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
