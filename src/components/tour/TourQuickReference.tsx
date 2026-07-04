"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Destination } from "@/data/tour-001";
import { ease } from "@/lib/motion";

interface TourQuickReferenceProps {
  destinations: Destination[];
  compact?: boolean;
}

export function TourQuickReference({
  destinations,
  compact = false,
}: TourQuickReferenceProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 1.2, ease }}
      className="glass-dark w-full overflow-hidden rounded-2xl border border-white/10 lg:w-full"
    >
      <div className={`border-b border-white/10 ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-secondary-light">
          Quick Reference
        </p>
        <h2 className="font-heading text-sm font-bold text-white md:text-base">
          Complete Itinerary
        </h2>
      </div>

      <div
        className={`overflow-y-auto p-2 ${compact ? "max-h-[220px] lg:max-h-[260px]" : "max-h-[280px]"}`}
      >
        {destinations.map((dest, index) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 1.3 + index * 0.06, ease }}
          >
            <Link
              href={`#${dest.id}`}
              className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-white/5"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/20">
                <Image
                  src={dest.thumbnail}
                  alt={dest.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="40px"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-secondary-light">
                  Day {dest.day}
                </p>
                <p className="truncate text-sm font-semibold text-white group-hover:text-secondary-light">
                  {dest.name}
                </p>
                <p className="truncate text-xs text-white/50">{dest.region}</p>
              </div>

              <span className="shrink-0 text-sm text-white/30 transition-colors group-hover:text-white/70">
                →
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.aside>
  );
}
