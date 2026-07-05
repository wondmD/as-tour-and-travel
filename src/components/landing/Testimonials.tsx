"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger } from "@/components/ui/Stagger";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { ethiopiaImages } from "@/lib/images";
import { cardHover, spring } from "@/lib/motion";

const testimonials = [
  {
    name: "Sarah Mitchell",
    country: "United Kingdom",
    avatar: ethiopiaImages.testimonials.avatar1,
    rating: 5,
    text: "Our Tour 001 experience exceeded every expectation. From the coffee ceremony in Addis to the Lake Chamo boat safari, every moment felt thoughtfully curated. Our guide Solomon was extraordinary.",
  },
  {
    name: "James Chen",
    country: "Australia",
    avatar: ethiopiaImages.testimonials.avatar2,
    rating: 5,
    text: "As a photographer, I was blown away by the diversity of landscapes in just five days. AS Tour understood exactly what I needed — early morning shoots, local access, and zero rushed moments.",
  },
  {
    name: "Elena Rodriguez",
    country: "Spain",
    avatar: ethiopiaImages.testimonials.avatar3,
    rating: 5,
    text: "Traveling solo as a woman, safety was my top concern. AS Tour made me feel completely secure while delivering the most authentic cultural experiences I've had in 30 countries of travel.",
  },
];

export function Testimonials() {
  return (
    <Section pattern="surface" tone="surface" mesh>
      <SectionHeading
        eyebrow="Testimonials"
        title="Stories From Our Travelers"
        description="Join hundreds of international adventurers who have discovered Ethiopia with us."
        gradient
      />

      <Stagger className="grid gap-5 md:grid-cols-3">
        {testimonials.map((item) => (
          <StaggerItem key={item.name}>
            <motion.div whileHover={cardHover} className="glass-card relative flex h-full flex-col p-6 md:p-8">
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/8" />
              </motion.div>
              <div className="mb-4 flex gap-1">
                {Array.from({ length: item.rating }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 300 }}
                  >
                    <Star className="h-4 w-4 fill-accent text-accent" />
                  </motion.div>
                ))}
              </div>
              <p className="flex-1 text-sm leading-relaxed text-text-secondary">
                &ldquo;{item.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3 border-t border-border/60 pt-6">
                <motion.div whileHover={{ scale: 1.1 }} transition={spring}>
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="rounded-full object-cover ring-2 ring-primary/10"
                  />
                </motion.div>
                <div>
                  <p className="font-heading font-semibold text-text-primary">
                    {item.name}
                  </p>
                  <p className="text-xs text-text-secondary">{item.country}</p>
                </div>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
