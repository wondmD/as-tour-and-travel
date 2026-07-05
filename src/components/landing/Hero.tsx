"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { tour001 } from "@/data/tour-001";
import { ethiopiaImages } from "@/lib/images";
import { Button } from "@/components/ui/Button";
import { BookTourButton } from "@/components/booking/BookTourButton";
import { OrganizerPartners } from "@/components/brand/OrganizerPartners";
import { DepartureCountdown } from "@/components/ui/DepartureCountdown";
import { TextReveal } from "@/components/ui/TextReveal";
import { TrustRibbon } from "@/components/landing/TrustRibbon";
import { ease, spring, staggerContainer, staggerItem } from "@/lib/motion";

const cardStats = (tour: typeof tour001) => [
  { icon: Clock, label: tour.duration },
  { icon: MapPin, label: `${tour.destinationCount} Destinations` },
  { icon: Calendar, label: tour.departureDate },
  { icon: Users, label: `${tour.availableSeats} seats left` },
];

export function Hero() {
  const tour = tour001;
  const { scrollY } = useScroll();
  const imageY = useTransform(scrollY, [0, 600], [0, 120]);
  const contentY = useTransform(scrollY, [0, 600], [0, 40]);
  const imageScale = useTransform(scrollY, [0, 600], [1.05, 1.15]);

  return (
    <section
      id="home"
      className="relative flex min-h-[100dvh] items-center overflow-hidden"
    >
      <motion.div className="absolute inset-0" style={{ y: imageY, scale: imageScale }}>
        <Image
          src={ethiopiaImages.landingHero}
          alt="Ethiopian highlands landscape near Lalibela"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-black/50 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      <div className="hero-grid-overlay absolute inset-0" />

      <div className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 animate-blob rounded-full bg-secondary/20 blur-[100px]" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 animate-blob-reverse rounded-full bg-primary/25 blur-[100px]" />

      <motion.div
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-12 pt-24 sm:px-5 sm:pb-16 sm:pt-28 md:px-6 lg:px-8 lg:pt-36"
        style={{ y: contentY }}
      >
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="pill-badge pill-badge-light mb-5"
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
              Premium Guided Tours
            </motion.span>

            <TextReveal
              text="Discover the Beauty of Ethiopia"
              as="h1"
              delay={0.2}
              className="font-heading text-3xl font-bold leading-[1.1] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
            />

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.75, ease }}
              className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:mt-6 sm:text-lg"
            >
              Experience Ethiopia&apos;s breathtaking landscapes, ancient history,
              vibrant cultures, and unforgettable adventures through professionally
              guided tours.
            </motion.p>

            <DepartureCountdown
              departureDate={tour.departureDate}
              availableSeats={tour.availableSeats}
              light
              className="mt-6"
            />

            <TrustRibbon compact />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 48, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease }}
            whileHover={{ y: -8, transition: spring }}
            className="gradient-border glass-strong animate-float overflow-hidden p-4 sm:p-6 md:p-8"
            style={{ perspective: 1000 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />

            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5, ease }}
                className="mb-4 flex items-center justify-between"
              >
                <h2 className="font-heading text-lg font-semibold text-text-primary">
                  Upcoming Tour
                </h2>
                <span className="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary ring-1 ring-secondary/20">
                  {tour.status}
                </span>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
                className="font-heading text-lg font-bold text-text-primary sm:text-xl md:text-2xl"
              >
                {tour.title}
              </motion.h3>

              {tour.jointlyOrganized && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.5, ease }}
                  className="mt-4 rounded-xl bg-background/70 p-3 ring-1 ring-border/50 backdrop-blur-sm sm:mt-5 sm:p-4"
                >
                  <OrganizerPartners variant="card" theme="dark" showDescription={false} />
                </motion.div>
              )}

              <DepartureCountdown
                departureDate={tour.departureDate}
                availableSeats={tour.availableSeats}
                className="mt-4 hidden sm:block"
              />

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="mt-4 grid grid-cols-2 gap-2 sm:mt-6 sm:gap-3"
              >
                {cardStats(tour).map(({ icon: Icon, label }) => (
                  <motion.div
                    key={label}
                    variants={staggerItem}
                    whileHover={{ scale: 1.03, transition: spring }}
                    className="flex items-center gap-2 rounded-xl bg-background/80 px-2.5 py-2 text-xs text-text-secondary ring-1 ring-border/50 sm:gap-2.5 sm:px-3 sm:py-2.5 sm:text-sm"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-primary" />
                    {label}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5, ease }}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <Button href={`/tours/${tour.slug}`} variant="primary" className="flex-1">
                  Explore Tour
                </Button>
                <BookTourButton variant="accent" className="flex-1">
                  Book Tour
                </BookTourButton>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
