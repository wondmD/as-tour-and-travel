"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { Stagger } from "@/components/ui/Stagger";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { ethiopiaImages } from "@/lib/images";
import { cardHover } from "@/lib/motion";

const facts = [
  { label: "Years of History", value: "3000+" },
  { label: "UNESCO Sites", value: "12" },
  { label: "Endemic Species", value: "200+" },
  { label: "Ethnic Groups", value: "80+" },
];

export function AboutEthiopia() {
  return (
    <section
      id="about-ethiopia"
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div className="absolute inset-0">
        <Image
          src={ethiopiaImages.aboutEthiopia}
          alt="Pilgrims celebrating at Lalibela, Ethiopia"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-text-primary/90 via-primary/80 to-text-primary/95" />
        <div className="hero-grid-overlay absolute inset-0 opacity-50" />
      </div>

      <div className="pointer-events-none absolute left-1/4 top-1/3 h-72 w-72 animate-blob rounded-full bg-secondary/15 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-64 w-64 animate-blob-reverse rounded-full bg-accent/10 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The Cradle of Humanity"
          title="About Ethiopia"
          description="Ethiopia is a land of extraordinary contrasts — ancient civilizations and modern cities, towering mountains and deep rift valleys, Orthodox traditions and Islamic heritage."
          light
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn direction="left" blur>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="glass-dark space-y-4 rounded-[20px] p-6 leading-relaxed text-white/80 md:p-8"
            >
              <p>
                As the only African nation never colonized, Ethiopia preserves a unique
                cultural identity found nowhere else on the continent. It is the birthplace
                of coffee, home to the Ark of the Covenant legend, and the site where
                Lucy — our 3.2-million-year-old ancestor — was discovered.
              </p>
              <p>
                From the rock-hewn churches of Lalibela to the otherworldly Danakil
                Depression, from the gelada baboons of the Simien Mountains to the
                ancient walled city of Harar, Ethiopia rewards curious travelers with
                experiences that feel genuinely otherworldly.
              </p>
              <p>
                With AS Tour & Travel, you explore this remarkable country with expert
                guides who understand both its complexities and its wonders — ensuring
                every encounter is respectful, safe, and profoundly moving.
              </p>
            </motion.div>
          </FadeIn>

          <Stagger className="grid grid-cols-2 gap-4">
            {facts.map((fact) => (
              <StaggerItem key={fact.label}>
                <motion.div whileHover={cardHover} className="glass-dark rounded-[20px] p-6 text-center">
                  <AnimatedCounter
                    value={fact.value}
                    className="font-heading text-3xl font-bold text-white md:text-4xl"
                  />
                  <p className="mt-2 text-sm text-white/55">{fact.label}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
