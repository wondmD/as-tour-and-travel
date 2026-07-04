"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger } from "@/components/ui/Stagger";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { FadeIn } from "@/components/ui/FadeIn";
import { cardHover, spring } from "@/lib/motion";
import { ethiopiaImages } from "@/lib/images";
import { TOUR_001_SLUG } from "@/lib/constants";

const destinations = [
  {
    name: "Lalibela",
    region: "Amhara Region",
    description: "Rock-hewn churches carved from solid volcanic rock in the 12th century.",
    image: ethiopiaImages.lalibela,
  },
  {
    name: "Simien Mountains",
    region: "Northern Highlands",
    description: "UNESCO World Heritage peaks home to gelada baboons and dramatic escarpments.",
    image: ethiopiaImages.simien,
  },
  {
    name: "Omo Valley",
    region: "Southern Ethiopia",
    description: "One of the most culturally diverse regions on Earth with ancient tribal traditions.",
    image: ethiopiaImages.omoValley,
  },
  {
    name: "Danakil Depression",
    region: "Afar Region",
    description: "One of the hottest places on Earth with otherworldly sulfur springs and salt flats.",
    image: ethiopiaImages.danakil,
  },
];

export function FeaturedDestinations() {
  return (
    <Section id="destinations" pattern="diagonal" tone="alt" mesh>
      <SectionHeading
        eyebrow="Explore Ethiopia"
        title="Featured Destinations"
        description="Beyond our signature Tour 001, discover the diverse landscapes and cultures that make Ethiopia one of Africa's most captivating destinations."
        gradient
      />

      <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {destinations.map((dest) => (
          <StaggerItem key={dest.name}>
            <motion.article whileHover={cardHover} className="glass-card group overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-[20px]">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-secondary-light">
                    {dest.region}
                  </p>
                  <h3 className="mt-1 font-heading text-xl font-bold text-white">
                    {dest.name}
                  </h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-text-secondary">
                  {dest.description}
                </p>
              </div>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn className="mt-12 text-center" delay={0.2}>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} transition={spring}>
          <Link
            href={`/tours/${TOUR_001_SLUG}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-primary/5 px-6 py-3 font-semibold text-primary ring-1 ring-primary/10 transition-colors hover:bg-primary/10 hover:ring-primary/20"
          >
            View Tour 001 Itinerary
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </FadeIn>
    </Section>
  );
}
