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
      <div className="flex h-full min-h-[380px] items-center justify-center rounded-[18px] bg-[#e8eef4] text-sm text-text-secondary">
        Loading map…
      </div>
    ),
  }
);

interface TourRouteMapProps {
  destinations: Destination[];
}

const LOOP_DURATION_MS = 22000;

export function TourRouteMap({ destinations }: TourRouteMapProps) {
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

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease }}
      className="mb-10 overflow-hidden rounded-[22px] border border-border/50 bg-surface/90 shadow-lg shadow-primary/5 backdrop-blur-md"
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-border/40 px-4 py-3 md:px-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
            Route Overview
          </p>
          <h3 className="font-heading text-lg font-bold text-text-primary md:text-xl">
            Your path across Ethiopia
          </h3>
          <p className="mt-1 text-xs text-text-secondary">
            Watch the tour route unfold — scroll to zoom, drag to pan
          </p>
        </div>
      </div>

      <div className="relative h-[380px] p-3 md:h-[440px] md:p-4">
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
