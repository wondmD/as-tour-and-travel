"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

interface SectionPhotoBackgroundProps {
  src: string;
  alt: string;
  variant?: "dark" | "light";
  /** When set, crossfades the image when this value changes */
  crossfadeKey?: string;
}

export function SectionPhotoBackground({
  src,
  alt,
  variant = "dark",
  crossfadeKey,
}: SectionPhotoBackgroundProps) {
  const image = (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      sizes="100vw"
    />
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {crossfadeKey ? (
        <AnimatePresence mode="sync">
          <motion.div
            key={crossfadeKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            {image}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="absolute inset-0">{image}</div>
      )}

      {variant === "dark" ? (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-text-primary/90 via-primary/80 to-text-primary/95" />
          <div className="hero-grid-overlay absolute inset-0 opacity-50" />
          <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 animate-blob rounded-full bg-secondary/15 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 animate-blob-reverse rounded-full bg-accent/10 blur-[100px]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/78 to-white/92" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.07] via-transparent to-secondary/[0.08]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(248,250,252,0.75)_70%)]" />
          <div className="hero-grid-overlay absolute inset-0 opacity-25" />
          <div className="pointer-events-none absolute left-1/4 top-1/4 h-64 w-64 animate-blob rounded-full bg-primary/10 blur-[100px]" />
          <div className="pointer-events-none absolute bottom-1/3 right-1/5 h-56 w-56 animate-blob-reverse rounded-full bg-secondary/10 blur-[100px]" />
        </>
      )}
    </div>
  );
}
