"use client";

import { motion } from "framer-motion";

interface PassportStampProps {
  name: string;
  day: number;
  region: string;
  visited?: boolean;
  className?: string;
}

export function PassportStamp({
  name,
  day,
  region,
  visited = false,
  className = "",
}: PassportStampProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
      animate={{
        opacity: visited ? 1 : 0.35,
        scale: visited ? 1 : 0.92,
        rotate: visited ? -8 : -4,
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className={`pointer-events-none select-none ${className}`}
      aria-hidden
    >
      <div
        className={`flex h-[4.5rem] w-[4.5rem] flex-col items-center justify-center rounded-full border-[3px] border-dashed ${
          visited
            ? "border-primary/50 text-primary"
            : "border-border/60 text-text-secondary/50"
        } bg-surface/80 p-1 text-center shadow-sm`}
      >
        <span className="text-[7px] font-bold uppercase tracking-[0.2em]">
          AS Tour
        </span>
        <span className="font-heading text-[11px] font-bold leading-tight">
          Day {day}
        </span>
        <span className="mt-0.5 max-w-[3.5rem] truncate text-[7px] font-semibold uppercase leading-tight">
          {name.split(" ")[0]}
        </span>
        <span className="max-w-[3.75rem] truncate text-[6px] uppercase opacity-70">
          {region}
        </span>
      </div>
    </motion.div>
  );
}
