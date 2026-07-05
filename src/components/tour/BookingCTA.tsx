"use client";

import { motion } from "framer-motion";
import { Calendar, Check, Users } from "lucide-react";
import type { Tour } from "@/data/tour-001";
import { OrganizerPartners } from "@/components/brand/OrganizerPartners";
import { BookTourButton } from "@/components/booking/BookTourButton";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionPhotoBackground } from "@/components/ui/SectionPhotoBackground";
import { ethiopiaImages } from "@/lib/images";
import { ease } from "@/lib/motion";

interface BookingCTAProps {
  tour: Tour;
}

export function BookingCTA({ tour }: BookingCTAProps) {
  return (
    <section
      id="booking"
      className="scroll-mt-24 relative overflow-hidden py-14 sm:py-20 md:py-24 lg:py-28"
    >
      <SectionPhotoBackground
        src={ethiopiaImages.arbaMinch.hero}
        alt="Scenic view near Arba Minch, Ethiopia"
        variant="dark"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <FadeIn scale blur>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35, ease }}
            className="gradient-border overflow-hidden shadow-2xl shadow-primary/10"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark p-5 text-white sm:p-8 md:p-12">
                <motion.div
                  animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"
                />
                <div className="hero-grid-overlay absolute inset-0 opacity-40" />

                <div className="relative">
                  {tour.jointlyOrganized && (
                    <div className="mb-6 rounded-2xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur-sm">
                      <OrganizerPartners variant="card" theme="light" />
                    </div>
                  )}

                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease }}
                    className="font-heading text-2xl font-bold sm:text-3xl md:text-4xl"
                  >
                    Ready to Explore Ethiopia?
                  </motion.h2>
                  <p className="mt-4 leading-relaxed text-white/75">
                    Secure your seat on {tour.title}. Limited availability for our
                    upcoming departure.
                  </p>

                  <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4">
                    {[
                      { label: "Departure", value: tour.departureDate, icon: Calendar },
                      { label: "Remaining Seats", value: `${tour.availableSeats} of ${tour.totalSeats}`, icon: Users },
                    ].map((stat, i) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1, duration: 0.45, ease }}
                        className="glass-dark rounded-2xl p-4"
                      >
                        {stat.icon && <stat.icon className="mb-1 h-5 w-5 text-secondary-light" />}
                        <p className="text-xs text-white/50">{stat.label}</p>
                        <p className="font-heading text-xl font-bold md:text-2xl">{stat.value}</p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.35, duration: 0.5, ease }}
                  >
                    <BookTourButton variant="accent" className="mt-6 w-full !px-8 !py-3.5 text-base sm:mt-8 sm:w-auto sm:!px-10 sm:!py-4">
                      Book Now
                    </BookTourButton>
                  </motion.div>
                </div>
              </div>

              <div className="glass-strong p-5 sm:p-8 md:p-12">
                <h3 className="font-heading text-xl font-bold text-text-primary">
                  What&apos;s Included
                </h3>
                <ul className="mt-6 space-y-3">
                  {tour.includedServices.map((service, i) => (
                    <motion.li
                      key={service}
                      initial={{ opacity: 0, x: -16 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.06, duration: 0.4, ease }}
                      whileHover={{ x: 4 }}
                      className="flex items-start gap-3 text-sm text-text-secondary"
                    >
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary/10">
                        <Check className="h-3 w-3 text-secondary" />
                      </span>
                      {service}
                    </motion.li>
                  ))}
                </ul>

                {tour.excludedServices.length > 0 && (
                  <>
                    <h3 className="mt-10 font-heading text-xl font-bold text-text-primary">
                      Not Included
                    </h3>
                    <ul className="mt-6 space-y-3">
                      {tour.excludedServices.map((service, i) => (
                        <motion.li
                          key={service}
                          initial={{ opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.06, duration: 0.4, ease }}
                          className="flex items-start gap-3 text-sm text-text-secondary"
                        >
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                            —
                          </span>
                          {service}
                        </motion.li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
