"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Languages, Award, MapPinned } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { unsplash } from "@/lib/images";
import { cardHover } from "@/lib/motion";

const guide = {
  name: "Daniel Mekonnen",
  role: "Lead Tour Guide · AS Tour & Travel",
  bio: "Born and raised in Addis Ababa, Daniel has guided international travelers across Ethiopia for over 12 years — from Lalibela's rock churches to the markets of Harar. Fluent in English, Amharic, and French.",
  languages: ["English", "Amharic", "French"],
  highlights: ["12+ years experience", "500+ tours led", "Ethiopia specialist"],
  photo: unsplash("1588349419102-ff038134f2af", 600),
};

export function MeetYourGuide() {
  return (
    <Section id="your-guide" pattern="dots" tone="alt">
      <SectionHeading
        eyebrow="Expert Guidance"
        title="Meet Your Guide"
        description="Travel with someone who knows Ethiopia's history, cultures, and hidden corners — not just the highlights."
        gradient
      />

      <FadeIn blur>
        <motion.div
          whileHover={cardHover}
          className="glass-card mx-auto grid max-w-4xl overflow-hidden lg:grid-cols-[280px_1fr]"
        >
          <div className="relative min-h-[280px] lg:min-h-full">
            <Image
              src={guide.photo}
              alt={guide.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 280px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
            <div className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              Lead Guide
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="font-heading text-2xl font-bold text-text-primary">
              {guide.name}
            </h3>
            <p className="mt-1 text-sm font-medium text-primary">{guide.role}</p>
            <p className="mt-4 leading-relaxed text-text-secondary">{guide.bio}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {guide.languages.map((lang) => (
                <span
                  key={lang}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-3 py-1 text-xs font-semibold text-primary ring-1 ring-primary/10"
                >
                  <Languages className="h-3 w-3" />
                  {lang}
                </span>
              ))}
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {guide.highlights.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-xl bg-background/80 px-3 py-2.5 text-xs font-semibold text-text-secondary ring-1 ring-border/50"
                >
                  {item.includes("years") ? (
                    <Award className="h-4 w-4 shrink-0 text-secondary" />
                  ) : (
                    <MapPinned className="h-4 w-4 shrink-0 text-secondary" />
                  )}
                  {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </FadeIn>
    </Section>
  );
}
