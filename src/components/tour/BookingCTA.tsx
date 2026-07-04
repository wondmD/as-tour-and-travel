"use client";

import { motion } from "framer-motion";
import { Calendar, Check, Users } from "lucide-react";
import type { Tour } from "@/data/tour-001";
import { Button } from "@/components/ui/Button";
import { FadeIn } from "@/components/ui/FadeIn";
import { ease } from "@/lib/motion";

interface BookingCTAProps {
  tour: Tour;
}

export function BookingCTA({ tour }: BookingCTAProps) {
  return (
    <section
      id="booking"
      className="scroll-mt-24 relative overflow-hidden pattern-grid bg-background py-20 md:py-28 mesh-blobs mesh-blobs-accent"
    >
      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <FadeIn scale blur>
          <motion.div
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35, ease }}
            className="gradient-border overflow-hidden shadow-2xl shadow-primary/10"
          >
            <div className="grid lg:grid-cols-2">
              <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark p-8 text-white md:p-12">
                <motion.div
                  animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                  className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-3xl"
                />
                <div className="hero-grid-overlay absolute inset-0 opacity-40" />

                <div className="relative">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease }}
                    className="font-heading text-3xl font-bold md:text-4xl"
                  >
                    Ready to Explore Ethiopia?
                  </motion.h2>
                  <p className="mt-4 leading-relaxed text-white/75">
                    Secure your seat on Tour 001 — The Grand Ethiopian Experience.
                    Limited availability for our upcoming departure.
                  </p>

                  <div className="mt-8 grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Starting Price", value: `$${tour.startingPrice.toLocaleString()}`, icon: null },
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
                    <Button variant="accent" className="mt-8 !px-10 !py-4 text-base">
                      Book Now
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="glass-strong p-8 md:p-12">
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
              </div>
            </div>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
