"use client";

import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { tour001 } from "@/data/tour-001";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { spring } from "@/lib/motion";

export function ToursSection() {
  const tour = tour001;

  return (
    <Section id="tours" pattern="grid" tone="default" mesh className="mesh-blobs-accent">
      <SectionHeading
        eyebrow="Our Signature Tour"
        title="Tour 001 — The Grand Ethiopian Experience"
        description="A meticulously crafted five-day journey connecting Ethiopia's capital, highlands, lakes, wildlife, and ancient cities."
        gradient
      />

      <FadeIn scale>
        <motion.div
          whileHover={{ y: -6 }}
          transition={spring}
          className="gradient-border glass-strong overflow-hidden"
        >
          <div className="grid lg:grid-cols-3">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark p-8 text-white lg:col-span-1">
              <motion.div
                animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              />
              <div className="pointer-events-none absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
              <div className="relative">
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold ring-1 ring-white/20 backdrop-blur-sm">
                  {tour.status}
                </span>
                <h3 className="mt-4 font-heading text-2xl font-bold">{tour.title}</h3>
                <p className="mt-3 text-sm text-white/75">{tour.subtitle}</p>
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
                    <Calendar className="h-4 w-4 text-secondary-light" />
                    Departs {tour.departureDate}
                  </div>
                  <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm backdrop-blur-sm">
                    <Users className="h-4 w-4 text-secondary-light" />
                    {tour.availableSeats} of {tour.totalSeats} seats available
                  </div>
                </div>
                <p className="mt-8 font-heading text-4xl font-bold">
                  ${tour.startingPrice.toLocaleString()}
                  <span className="text-lg font-normal text-white/60"> /person</span>
                </p>
              </div>
            </div>

            <div className="flex flex-col justify-between p-8 lg:col-span-2">
              <div>
                <h4 className="font-heading font-semibold text-text-primary">
                  Journey Route
                </h4>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  {tour.destinations.map((dest, i) => (
                    <motion.span
                      key={dest.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, ...spring }}
                      className="flex items-center gap-2"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 text-xs font-bold text-primary ring-1 ring-primary/10">
                        {dest.day}
                      </span>
                      <span className="text-sm font-medium text-text-primary">
                        {dest.name}
                      </span>
                      {i < tour.destinations.length - 1 && (
                        <span className="text-primary/30">→</span>
                      )}
                    </motion.span>
                  ))}
                </div>
                <p className="mt-6 text-sm leading-relaxed text-text-secondary">
                  {tour.summary}
                </p>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href={`/tours/${tour.slug}`} variant="primary">
                  Explore Full Itinerary
                </Button>
                <Button href={`/tours/${tour.slug}#booking`} variant="accent">
                  Reserve Your Seat
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </FadeIn>
    </Section>
  );
}
