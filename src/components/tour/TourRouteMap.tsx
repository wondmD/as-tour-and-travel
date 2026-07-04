"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Destination } from "@/data/tour-001";
import {
  destinationsToRoute,
  getBearingOnRoute,
  getPositionOnRoute,
  type LatLngTuple,
} from "@/lib/route-geo";
import { ease } from "@/lib/motion";

const RouteMapLeaflet = dynamic(
  () =>
    import("@/components/tour/RouteMapLeaflet").then((m) => m.RouteMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[380px] items-center justify-center rounded-[18px] bg-background-alt text-sm text-text-secondary">
        Loading map…
      </div>
    ),
  }
);

interface TourRouteMapProps {
  destinations: Destination[];
  layout?: "default" | "sidebar";
}

const LOOP_DURATION_MS = 22000;

export function TourRouteMap({
  destinations,
  layout = "default",
}: TourRouteMapProps) {
  const route = useMemo(() => destinationsToRoute(destinations), [destinations]);
  const containerRef = useRef<HTMLDivElement>(null);

  const [flowProgress, setFlowProgress] = useState(0);
  const [travelerPosition, setTravelerPosition] = useState<LatLngTuple | null>(
    null
  );
  const [carBearing, setCarBearing] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Continuous car animation — independent from itinerary selection
  useEffect(() => {
    if (!isVisible || route.length < 2) return;

    const startTime = performance.now();
    let raf = 0;

    const run = (now: number) => {
      const elapsed = (now - startTime) % LOOP_DURATION_MS;
      const t = elapsed / LOOP_DURATION_MS;

      setFlowProgress(t);
      setTravelerPosition(getPositionOnRoute(route, t));
      setCarBearing(getBearingOnRoute(route, t));

      raf = requestAnimationFrame(run);
    };

    raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [isVisible, route]);

  useEffect(() => {
    if (route.length > 0) {
      setTravelerPosition(getPositionOnRoute(route, 0));
    }
  }, [route]);

  const isSidebar = layout === "sidebar";

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className={`overflow-hidden rounded-[18px] border border-border/50 bg-surface/90 shadow-lg shadow-primary/5 backdrop-blur-md sm:rounded-[22px] ${
        isSidebar ? "h-full" : "mb-8 sm:mb-10"
      }`}
    >
      <div className="flex flex-col gap-1 border-b border-border/40 px-3 py-2.5 sm:px-4 sm:py-3 md:px-5">
        <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Route Overview
        </p>
        <h3 className="font-heading text-sm font-bold text-text-primary sm:text-base md:text-lg">
          Your path across Ethiopia
        </h3>
        {!isSidebar && (
          <p className="text-xs text-text-secondary">Pinch to zoom, drag to pan</p>
        )}
      </div>

      <div
        className={`relative p-2 sm:p-3 ${
          isSidebar
            ? "h-[240px] sm:h-[280px] md:h-[320px] lg:h-[min(520px,70vh)] lg:min-h-[420px]"
            : "h-[260px] sm:h-[320px] md:h-[380px] md:p-4 lg:h-[440px]"
        }`}
      >
        <RouteMapLeaflet
          destinations={destinations}
          flowProgress={flowProgress}
          travelerPosition={travelerPosition}
          carBearing={carBearing}
        />
      </div>
    </motion.div>
  );
}
