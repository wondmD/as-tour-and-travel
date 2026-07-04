"use client";

import { motion } from "framer-motion";
import { FadeIn } from "./FadeIn";
import { ease } from "@/lib/motion";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  gradient?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  gradient = false,
}: SectionHeadingProps) {
  return (
    <FadeIn
      blur
      className={`mb-8 sm:mb-12 md:mb-16 ${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease }}
          className={`pill-badge mb-4 ${light ? "pill-badge-light" : ""}`}
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, delay: 0.08, ease }}
        className={`font-heading text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl ${
          light ? "text-white" : gradient ? "gradient-text" : "text-text-primary"
        }`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.16, ease }}
          className={`mt-3 text-base leading-relaxed sm:mt-4 sm:text-lg ${
            light ? "text-white/75" : "text-text-secondary"
          }`}
        >
          {description}
        </motion.p>
      )}
    </FadeIn>
  );
}
