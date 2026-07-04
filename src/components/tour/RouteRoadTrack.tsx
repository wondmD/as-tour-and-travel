"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Destination } from "@/data/tour-001";
import { spring } from "@/lib/motion";

interface RouteRoadTrackProps {
  destinations: Destination[];
  activeIndex: number;
  progress: number;
  onSelect: (index: number) => void;
  className?: string;
}

export function RouteRoadTrack({
  destinations,
  activeIndex,
  progress,
  onSelect,
  className = "",
}: RouteRoadTrackProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const stopRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    stopRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeIndex]);

  return (
    <div
      className={`relative mb-6 md:mb-0 ${className}`}
      aria-label="Tour route progress"
    >
      {/* Progress bar — mobile-first */}
      <div className="mb-4 px-1">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-text-secondary">
          <span>Day 1</span>
          <span>
            Day {destinations[activeIndex]?.day} of {destinations.length}
          </span>
          <span>Day {destinations[destinations.length - 1]?.day}</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-primary/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-secondary to-accent"
            animate={{ width: `${Math.max(progress * 100, 4)}%` }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Scrollable road strip — works on all screen sizes */}
      <div
        ref={scrollRef}
        className="-mx-4 overflow-x-auto px-4 pb-2 scrollbar-none snap-x snap-mandatory sm:-mx-6 sm:px-6 md:mx-0 md:px-0"
      >
        <div className="relative flex min-w-max items-end gap-0 pt-2">
          {/* Road bed behind stops */}
          <div
            className="pointer-events-none absolute left-4 right-4 top-[2.75rem] h-3 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 sm:top-[3rem]"
            aria-hidden
          />

          {destinations.map((dest, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const isLast = index === destinations.length - 1;

            return (
              <div key={dest.id} className="flex shrink-0 snap-center items-end">
                <motion.button
                  ref={(el) => {
                    stopRefs.current[index] = el;
                  }}
                  type="button"
                  onClick={() => onSelect(index)}
                  aria-current={isActive ? "step" : undefined}
                  aria-label={`Day ${dest.day}: ${dest.name}`}
                  animate={{ scale: isActive ? 1 : 0.95, y: isActive ? -4 : 0 }}
                  whileTap={{ scale: 0.92 }}
                  transition={spring}
                  className="relative z-10 flex w-[4.5rem] flex-col items-center gap-2 px-1 outline-none sm:w-[5rem] md:w-[5.5rem]"
                >
                  <motion.div
                    animate={{
                      boxShadow: isActive
                        ? "0 0 0 4px rgba(234,153,64,0.2), 0 8px 24px rgba(234,153,64,0.25)"
                        : "0 2px 8px rgba(15,23,42,0.08)",
                    }}
                    className={`relative overflow-hidden rounded-xl border-2 sm:rounded-2xl ${
                      isActive
                        ? "border-accent bg-white"
                        : isPast
                          ? "border-secondary/50 bg-white"
                          : "border-white bg-white/95"
                    } ${
                      isActive
                        ? "h-14 w-14 sm:h-16 sm:w-16 md:h-[4.25rem] md:w-[4.25rem]"
                        : "h-11 w-11 sm:h-12 sm:w-12"
                    }`}
                  >
                    <Image
                      src={dest.thumbnail}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                    <span
                      className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent text-center font-bold text-white ${
                        isActive ? "py-0.5 text-[8px] sm:text-[9px]" : "py-px text-[7px]"
                      }`}
                    >
                      {dest.day}
                    </span>
                  </motion.div>

                  <p
                    className={`line-clamp-2 w-full text-center font-heading text-[9px] font-bold leading-tight sm:text-[10px] md:text-xs ${
                      isActive ? "text-text-primary" : "text-text-secondary/80"
                    }`}
                  >
                    {isActive ? dest.name : `Stop ${index + 1}`}
                  </p>
                </motion.button>

                {/* Connector segment */}
                {!isLast && (
                  <div
                    className={`mb-6 h-0.5 w-4 shrink-0 sm:w-6 md:w-8 ${
                      index < activeIndex
                        ? "bg-gradient-to-r from-secondary to-primary"
                        : "bg-primary/15"
                    }`}
                    aria-hidden
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-2 text-center text-[11px] text-text-secondary md:hidden">
        Swipe the route to browse all stops
      </p>
    </div>
  );
}
