"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { getDaysUntilDeparture } from "@/lib/tour-utils";

interface DepartureCountdownProps {
  departureDate: string;
  availableSeats?: number;
  light?: boolean;
  className?: string;
}

export function DepartureCountdown({
  departureDate,
  availableSeats,
  light = false,
  className = "",
}: DepartureCountdownProps) {
  const [days, setDays] = useState(() => getDaysUntilDeparture(departureDate));

  useEffect(() => {
    setDays(getDaysUntilDeparture(departureDate));
    const interval = setInterval(
      () => setDays(getDaysUntilDeparture(departureDate)),
      60000
    );
    return () => clearInterval(interval);
  }, [departureDate]);

  const text = light ? "text-white/70" : "text-text-secondary";
  const strong = light ? "text-white" : "text-text-primary";
  const badge = light
    ? "border-white/15 bg-white/10 text-white"
    : "border-primary/15 bg-primary/5 text-primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-wrap items-center gap-3 ${className}`}
    >
      <div
        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${badge}`}
      >
        <CalendarDays className="h-3.5 w-3.5" />
        <span>
          Departs in{" "}
          <span className={light ? "text-secondary-light" : "text-primary"}>
            {days} {days === 1 ? "day" : "days"}
          </span>
        </span>
      </div>
      <p className={`text-xs ${text}`}>
        <span className={`font-semibold ${strong}`}>{departureDate}</span>
        {availableSeats !== undefined && (
          <>
            {" "}
            ·{" "}
            <span className={light ? "text-accent-light" : "text-accent"}>
              {availableSeats} seats left
            </span>
          </>
        )}
      </p>
    </motion.div>
  );
}
