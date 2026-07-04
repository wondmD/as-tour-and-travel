"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ChevronDown } from "lucide-react";
import type { Tour } from "@/data/tour-001";
import { Button } from "@/components/ui/Button";
import { DepartureCountdown } from "@/components/ui/DepartureCountdown";
import { TextReveal } from "@/components/ui/TextReveal";
import { TourQuickReference } from "@/components/tour/TourQuickReference";
import { ease, spring } from "@/lib/motion";

interface TourHeroProps {
  tour: Tour;
}

export function TourHero({ tour }: TourHeroProps) {
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 500], [0, 100]);
  const imageScale = useTransform(scrollY, [0, 500], [1.05, 1.12]);
  const contentOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  return (
    <section className="relative flex min-h-[72vh] items-end overflow-hidden lg:min-h-[78vh]">
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <Image
          src={tour.coverImage}
          alt={tour.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-black/55 to-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      <div className="hero-grid-overlay absolute inset-0" />

      <div className="pointer-events-none absolute -left-24 top-1/4 h-96 w-96 animate-blob rounded-full bg-secondary/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-72 w-72 animate-blob-reverse rounded-full bg-primary/20 blur-[100px]" />

      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-8 pt-28 md:px-6 lg:px-8 lg:pb-10 lg:pt-32"
      >
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <div className="min-w-0 flex-1 max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="pill-badge pill-badge-light mb-4"
            >
              {tour.status} · {tour.duration}
            </motion.span>

            <TextReveal
              text={tour.title}
              as="h1"
              delay={0.2}
              className="font-heading text-3xl font-bold leading-[1.08] text-white md:text-4xl lg:text-5xl"
            />

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.85, ease }}
              className="mt-4 max-w-2xl text-base leading-relaxed text-white/75 md:text-lg"
            >
              {tour.summary}
            </motion.p>

            <DepartureCountdown
              departureDate={tour.departureDate}
              availableSeats={tour.availableSeats}
              light
              className="mt-4"
            />

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1, ease }}
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 lg:gap-3 xl:grid-cols-4"
            >
              {[
                { icon: Clock, label: "Duration", value: tour.duration },
                { icon: Users, label: "Group Size", value: tour.groupSize },
                { icon: Calendar, label: "Departs", value: tour.departureDate },
                {
                  icon: MapPin,
                  label: "Stops",
                  value: `${tour.destinationCount} destinations`,
                },
              ].map(({ icon: Icon, label, value }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 + i * 0.08, duration: 0.4, ease }}
                  whileHover={{ y: -3, transition: spring }}
                  className="glass-dark rounded-2xl p-3 md:p-4"
                >
                  <Icon className="mb-2 h-4 w-4 text-secondary-light" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">
                    {label}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-white">{value}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease }}
              className="mt-5 flex flex-col gap-4 rounded-[22px] border border-white/10 bg-black/30 p-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between md:p-5"
            >
              <div className="flex items-baseline gap-2">
                <span className="text-sm text-white/50">From</span>
                <span className="font-heading text-3xl font-bold text-white md:text-4xl">
                  ${tour.startingPrice.toLocaleString()}
                </span>
                <span className="text-sm text-white/50">/ person</span>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Button href="#tour-route" variant="outline" className="!text-sm">
                  Explore Itinerary
                </Button>
                <Button href="#booking" variant="accent" className="!px-8">
                  Book Tour
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="mt-5 hidden justify-start lg:flex"
            >
              <Link
                href="#tour-route"
                className="flex flex-col items-center gap-1 text-white/40 transition-colors hover:text-white/70"
              >
                <span className="text-xs font-medium uppercase tracking-widest">
                  Scroll to explore
                </span>
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </Link>
            </motion.div>
          </div>

          <div className="w-full shrink-0 lg:w-[300px] xl:w-[320px]">
            <TourQuickReference destinations={tour.destinations} compact />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
