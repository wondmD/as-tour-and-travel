"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Destination } from "@/data/tour-001";
import { spring } from "@/lib/motion";

interface RouteRoadTrackProps {
  destinations: Destination[];
  activeIndex: number;
  progress: number;
  onSelect: (index: number) => void;
}

export function RouteRoadTrack({
  destinations,
  activeIndex,
  progress,
  onSelect,
}: RouteRoadTrackProps) {
  const count = destinations.length;

  const stopPosition = (index: number) =>
    count === 1 ? 50 : (index / (count - 1)) * 100;

  return (
    <div className="relative mb-8 md:mb-10" aria-label="Tour route progress">
      <div className="relative mx-auto max-w-4xl px-6 pt-6 pb-14 md:px-10 md:pt-8 md:pb-16">
        {/* Road bed — dual lanes */}
        <div className="absolute inset-x-6 top-[2.75rem] bottom-10 rounded-2xl border-y-2 border-primary/10 bg-gradient-to-r from-primary/[0.03] via-secondary/[0.05] to-accent/[0.03] md:inset-x-10 md:top-[3rem] md:bottom-11" />

        {/* Traveled progress */}
        <motion.div
          className="absolute top-[2.85rem] bottom-10 left-6 rounded-l-2xl bg-gradient-to-r from-primary/15 via-secondary/12 to-transparent md:top-[3.1rem] md:bottom-11 md:left-10"
          animate={{
            width: `calc((100% - 3rem) * ${Math.max(progress, 0.02)})`,
          }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          aria-hidden
        />

        {/* Center dashed line */}
        <div
          className="absolute left-8 right-8 top-1/2 h-0 -translate-y-[calc(50%-8px)] border-t-2 border-dashed border-primary/12 md:left-12 md:right-12"
          aria-hidden
        />

        {/* Stop nodes along the road */}
        <div className="relative h-24 md:h-28">
          {destinations.map((dest, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;
            const left = stopPosition(index);

            return (
              <motion.button
                key={dest.id}
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isActive ? "step" : undefined}
                aria-label={`Day ${dest.day}: ${dest.name}`}
                animate={{
                  scale: isActive ? 1 : 0.92,
                  y: isActive ? -6 : 0,
                }}
                whileHover={{ scale: isActive ? 1 : 0.98, y: -3 }}
                transition={spring}
                className="absolute top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-2 outline-none"
                style={{ left: `${left}%` }}
              >
                <motion.div
                  animate={{
                    boxShadow: isActive
                      ? "0 0 0 4px rgba(249,115,22,0.22), 0 10px 28px rgba(249,115,22,0.28)"
                      : "0 2px 10px rgba(15,23,42,0.1)",
                  }}
                  className={`relative overflow-hidden rounded-2xl border-2 ${
                    isActive
                      ? "border-accent bg-white"
                      : isPast
                        ? "border-secondary/60 bg-white"
                        : "border-white/90 bg-white/95"
                  } ${isActive ? "h-[4.25rem] w-[4.25rem] md:h-[4.75rem] md:w-[4.75rem]" : "h-11 w-11 md:h-12 md:w-12"}`}
                >
                  <Image
                    src={dest.thumbnail}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={isActive ? "76px" : "48px"}
                  />
                  {isActive && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent py-0.5 text-center text-[8px] font-bold text-white md:text-[9px]">
                      Day {dest.day}
                    </div>
                  )}
                </motion.div>

                <div
                  className={`absolute top-full mt-1 w-max max-w-[96px] text-center ${
                    isActive ? "block" : "hidden sm:block"
                  }`}
                >
                  <p
                    className={`truncate font-heading text-[10px] font-bold md:text-xs ${
                      isActive ? "text-text-primary" : "text-text-secondary/80"
                    }`}
                  >
                    {isActive ? dest.name : `Day ${dest.day}`}
                  </p>
                </div>

                {/* Peg on road */}
                <div
                  className={`absolute -bottom-3 left-1/2 h-2.5 w-0.5 -translate-x-1/2 rounded-full ${
                    isActive ? "bg-accent" : isPast ? "bg-secondary" : "bg-primary/35"
                  }`}
                  aria-hidden
                />
              </motion.button>
            );
          })}

          {/* Moving route marker */}
          <motion.div
            className="absolute top-1/2 z-20 -translate-y-1/2"
            animate={{ left: `${stopPosition(activeIndex)}%` }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            aria-hidden
          >
            <div className="-translate-x-1/2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/45 ring-2 ring-white md:h-8 md:w-8">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 rotate-90 text-white md:h-4 md:w-4"
                  fill="currentColor"
                >
                  <path d="M8 5l8 7-8 7V5z" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
