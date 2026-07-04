"use client";

import { motion } from "framer-motion";
import { Shield, Heart, Globe, Award } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger } from "@/components/ui/Stagger";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { cardHover, spring } from "@/lib/motion";

const features = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Licensed guides, insured vehicles, and 24/7 emergency support ensure your peace of mind throughout every journey.",
    color: "from-primary/10 to-primary/5 text-primary",
  },
  {
    icon: Heart,
    title: "Authentic Experiences",
    description:
      "We partner with local communities to offer genuine cultural encounters — not staged performances for tourists.",
    color: "from-secondary/10 to-secondary/5 text-secondary",
  },
  {
    icon: Globe,
    title: "Expert Local Guides",
    description:
      "Our guides are historians, naturalists, and storytellers who bring Ethiopia's rich heritage to life.",
    color: "from-primary/10 to-secondary/5 text-primary",
  },
  {
    icon: Award,
    title: "Premium Comfort",
    description:
      "From boutique lodges to curated dining, every detail is designed for discerning international travelers.",
    color: "from-accent/10 to-accent/5 text-accent",
  },
];

export function WhyTravelWithUs() {
  return (
    <Section pattern="dots" tone="surface" mesh>
      <SectionHeading
        eyebrow="Why Choose Us"
        title="Travel With Confidence"
        description="We're not just tour operators — we're passionate Ethiopians dedicated to sharing our homeland's wonders with the world."
        gradient
      />

      <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <StaggerItem key={feature.title}>
            <motion.div
              whileHover={cardHover}
              className="glass-card group h-full p-6"
            >
              <motion.div
                whileHover={{ scale: 1.12, rotate: 5 }}
                transition={spring}
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color}`}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
              <h3 className="font-heading text-lg font-semibold text-text-primary">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {feature.description}
              </p>
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
