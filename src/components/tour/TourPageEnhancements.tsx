"use client";

import type { Tour } from "@/data/tour-001";
import { FloatingBookingBar } from "@/components/tour/FloatingBookingBar";
import { KeyboardHintToast } from "@/components/tour/KeyboardHintToast";

interface TourPageEnhancementsProps {
  tour: Tour;
}

export function TourPageEnhancements({ tour }: TourPageEnhancementsProps) {
  return (
    <>
      <FloatingBookingBar tour={tour} />
      <KeyboardHintToast />
    </>
  );
}
