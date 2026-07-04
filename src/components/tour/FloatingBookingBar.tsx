"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import type { Tour } from "@/data/tour-001";
import { BookTourButton } from "@/components/booking/BookTourButton";

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
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 safe-bottom"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl p-3 sm:p-4">
        <div className="flex flex-col gap-3 rounded-[20px] border border-border/50 bg-surface/95 px-4 py-3 shadow-2xl shadow-primary/10 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 font-heading text-sm font-bold text-text-primary sm:truncate sm:text-base">
              {tour.title}
            </p>
            <p className="mt-0.5 text-xs text-text-secondary sm:text-sm">
              {tour.availableSeats} seats left · Departs {tour.departureDate}
            </p>
          </div>
          <BookTourButton
            variant="accent"
            className="w-full shrink-0 !px-5 !py-3 !text-sm sm:w-auto"
          >
            Contact Us
          </BookTourButton>
        </div>
      </div>
    </motion.div>
  );
}
