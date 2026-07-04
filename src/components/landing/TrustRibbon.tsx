"use client";

import { motion } from "framer-motion";
import { Shield, Headphones, Users, Landmark } from "lucide-react";
import { ease } from "@/lib/motion";

const items = [
  { icon: Shield, label: "Licensed local guides" },
  { icon: Headphones, label: "24/7 emergency support" },
  { icon: Users, label: "Small group tours" },
  { icon: Landmark, label: "UNESCO-focused routes" },
];

export function TrustRibbon({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease }}
      className={
        compact
          ? "mt-6"
          : "relative z-20 border-y border-white/10 bg-black/35 backdrop-blur-md"
      }
    >
      <div
        className={
          compact
            ? "mt-6 grid max-w-xl grid-cols-1 gap-y-2.5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3"
            : "mx-auto grid max-w-2xl grid-cols-1 gap-y-3 px-4 py-4 sm:grid-cols-2 sm:gap-x-6 md:px-6"
        }
      >
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs font-semibold text-white/75 md:text-sm"
          >
            <Icon className="h-4 w-4 shrink-0 text-secondary-light" />
            <span className="leading-snug">{label}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
