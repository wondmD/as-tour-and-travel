"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { tour001 } from "@/data/tour-001";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger } from "@/components/ui/Stagger";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { FadeIn } from "@/components/ui/FadeIn";
import { cardHover, spring } from "@/lib/motion";
import { TOUR_001_SLUG } from "@/lib/constants";

function truncateText(text: string, maxLength = 120) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function FeaturedDestinations() {
  const destinations = tour001.destinations;

  return (
    <Section id="destinations" pattern="diagonal" tone="alt" mesh>
      <SectionHeading
        eyebrow="Tour 001 Route"
        title="Destinations on This Journey"
        description={`All ${tour001.destinationCount} stops on our ${tour001.duration.toLowerCase()} leisure tour — from Addis Ababa and the highlands to Bishoftu, Wonchi, and Arba Minch in southern Ethiopia.`}
        gradient
      />

      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {destinations.map((dest) => (
          <StaggerItem key={dest.id}>
            <motion.article whileHover={cardHover} className="glass-card group h-full overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[20px]">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={dest.heroImage}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-white/20 backdrop-blur-sm">
                  Day {dest.day}
                </span>
                <div className="absolute bottom-0 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary-light">
                    {dest.region}
                  </p>
                  <h3 className="mt-1 font-heading text-lg font-bold leading-snug text-white sm:text-xl">
                    {dest.name}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-text-secondary">
                  {truncateText(dest.introduction)}
                </p>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn className="mt-12 text-center" delay={0.2}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
          <Link
            href={`/tours/${TOUR_001_SLUG}#tour-route`}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary/5 px-6 py-3 font-semibold text-primary ring-1 ring-primary/10 transition-colors hover:bg-primary/10 hover:ring-primary/20"
          >
            Explore Full Itinerary
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </FadeIn>
    </Section>
  );
}
