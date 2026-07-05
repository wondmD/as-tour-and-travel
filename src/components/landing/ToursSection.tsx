"use client";

import { motion } from "framer-motion";
import { Calendar, Users } from "lucide-react";
import { tour001 } from "@/data/tour-001";
import { JOINT_TOUR_ORGANIZERS } from "@/lib/constants";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { Button } from "@/components/ui/Button";
import { OrganizerPartners } from "@/components/brand/OrganizerPartners";
import { BookTourButton } from "@/components/booking/BookTourButton";
import { spring } from "@/lib/motion";

export function ToursSection() {
  const tour = tour001;

  return (
    <Section id="tours" pattern="grid" tone="default" mesh className="mesh-blobs-accent">
      <SectionHeading
        eyebrow="Our Signature Tour"
        title={tour.title}
        description={`${JOINT_TOUR_ORGANIZERS.description} ${tour.subtitle}`}
        gradient
      />

      <FadeIn scale>
        <motion.div
          whileHover={{ y: -6 }}
          transition={spring}
          className="gradient-border glass-strong overflow-hidden rounded-[18px] sm:rounded-[20px]"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3">
            <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark p-4 text-white sm:p-6 md:p-8 lg:col-span-1">
              <motion.div
                animate={{ x: [0, 20, 0], y: [0, -15, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
              />
              <div className="pointer-events-none absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-secondary/20 blur-2xl" />
              <div className="relative">
                <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold ring-1 ring-white/20 backdrop-blur-sm sm:px-3 sm:text-xs">
                  {tour.status}
                </span>
                <h3 className="mt-3 font-heading text-lg font-bold leading-snug sm:mt-4 sm:text-xl md:text-2xl">
                  {tour.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/75 sm:mt-3 sm:text-sm">
                  {tour.subtitle}
                </p>

                {tour.jointlyOrganized && (
                  <div className="mt-4 rounded-xl bg-white/10 p-3 ring-1 ring-white/15 backdrop-blur-sm sm:mt-5 sm:p-4">
                    <OrganizerPartners variant="card" theme="light" showDescription={false} />
                  </div>
                )}

                <div className="mt-5 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:mt-8 sm:gap-3 lg:grid-cols-1">
                  <div className="flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs backdrop-blur-sm sm:text-sm">
                    <Calendar className="h-4 w-4 shrink-0 text-secondary-light" />
                    <span className="min-w-0 leading-tight">
                      Departs {tour.departureDate}
                    </span>
                  </div>
                  <div className="flex min-h-11 items-center gap-2 rounded-xl bg-white/10 px-3 py-2.5 text-xs backdrop-blur-sm sm:text-sm">
                    <Users className="h-4 w-4 shrink-0 text-secondary-light" />
                    <span className="min-w-0 leading-tight">
                      {tour.availableSeats} of {tour.totalSeats} seats available
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex min-w-0 flex-col justify-between gap-6 p-4 sm:gap-8 sm:p-6 md:p-8 lg:col-span-2">
              <div className="min-w-0">
                <h4 className="font-heading text-sm font-semibold text-text-primary sm:text-base">
                  Journey Route
                </h4>

                {/* Mobile: compact vertical list */}
                <ul className="mt-3 max-h-52 space-y-1.5 overflow-y-auto pr-1 scrollbar-none sm:mt-4 sm:hidden">
                  {tour.destinations.map((dest) => (
                    <li
                      key={dest.id}
                      className="flex items-start gap-2.5 rounded-xl bg-primary/5 px-2.5 py-2 ring-1 ring-primary/8"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-secondary/10 text-[10px] font-bold text-primary">
                        {dest.day}
                      </span>
                      <span className="min-w-0 pt-0.5 text-xs font-medium leading-snug text-text-primary">
                        {dest.name}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Tablet+: horizontal route strip */}
                <div className="-mx-1 mt-4 hidden overflow-x-auto px-1 pb-2 scrollbar-none sm:block">
                  <div className="flex min-w-max items-center gap-2">
                    {tour.destinations.map((dest, i) => (
                      <motion.span
                        key={dest.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.04, ...spring }}
                        className="flex shrink-0 items-center gap-1.5 sm:gap-2"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-secondary/10 text-[10px] font-bold text-primary ring-1 ring-primary/10 sm:h-8 sm:w-8 sm:rounded-xl sm:text-xs">
                          {dest.day}
                        </span>
                        <span className="max-w-[6rem] truncate text-xs font-medium text-text-primary md:max-w-none md:text-sm">
                          {dest.name}
                        </span>
                        {i < tour.destinations.length - 1 && (
                          <span className="text-primary/30">→</span>
                        )}
                      </motion.span>
                    ))}
                  </div>
                </div>

                <p className="mt-4 text-xs leading-relaxed text-text-secondary sm:mt-6 sm:text-sm">
                  {tour.summary}
                </p>
              </div>

              <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-3">
                <Button
                  href={`/tours/${tour.slug}`}
                  variant="primary"
                  className="w-full sm:flex-1"
                >
                  Explore Full Itinerary
                </Button>
                <BookTourButton variant="accent" className="w-full sm:flex-1">
                  Book Tour
                </BookTourButton>
              </div>
            </div>
          </div>
        </motion.div>
      </FadeIn>
    </Section>
  );
}
