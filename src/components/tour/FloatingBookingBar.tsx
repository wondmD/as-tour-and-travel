"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import type { Tour } from "@/data/tour-001";
import { Button } from "@/components/ui/Button";

interface FloatingBookingBarProps {
  tour: Tour;
}

export function FloatingBookingBar({ tour }: FloatingBookingBarProps) {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [600, 900], [0, 1]);
  const y = useTransform(scrollY, [600, 900], [24, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 p-3 md:p-4"
    >
      <div className="pointer-events-auto mx-auto flex max-w-3xl items-center justify-between gap-4 rounded-[20px] border border-border/50 bg-surface/95 px-4 py-3 shadow-2xl shadow-primary/10 backdrop-blur-md md:px-6">
        <div className="min-w-0">
          <p className="truncate font-heading text-sm font-bold text-text-primary md:text-base">
            {tour.title}
          </p>
          <p className="text-xs text-text-secondary md:text-sm">
            From{" "}
            <span className="font-semibold text-primary">
              ${tour.startingPrice.toLocaleString()}
            </span>
            / person · {tour.availableSeats} seats left
          </p>
        </div>
        <Button href="#booking" variant="accent" className="shrink-0 !px-5 !py-2.5 !text-sm">
          Reserve Seat
        </Button>
      </div>
    </motion.div>
  );
}
