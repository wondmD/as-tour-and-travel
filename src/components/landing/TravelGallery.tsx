"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger } from "@/components/ui/Stagger";
import { StaggerItem } from "@/components/ui/StaggerItem";
import { ethiopiaImages } from "@/lib/images";
import { spring } from "@/lib/motion";

const galleryImages = [
  {
    src: ethiopiaImages.lalibelaPilgrims,
    alt: "Pilgrims at Lalibela, Ethiopia",
    span: "col-span-2 row-span-2",
  },
  {
    src: ethiopiaImages.simien,
    alt: "Ethiopian highlands near Lalibela",
    span: "col-span-1 row-span-1",
  },
  {
    src: ethiopiaImages.harar.spiceMarket,
    alt: "Spice market in Harar, Ethiopia",
    span: "col-span-1 row-span-1",
  },
  {
    src: ethiopiaImages.omoValley,
    alt: "Omo Valley tribes, southern Ethiopia",
    span: "col-span-1 row-span-1",
  },
  {
    src: ethiopiaImages.kuriftu.lake,
    alt: "Crater lake at Bishoftu, Ethiopia",
    span: "col-span-1 row-span-1",
  },
  {
    src: ethiopiaImages.danakil,
    alt: "Dallol sulfur springs, Danakil Depression",
    span: "col-span-2 row-span-1",
  },
];

export function TravelGallery() {
  return (
    <Section id="gallery" pattern="grid" tone="default">
      <SectionHeading
        eyebrow="Gallery"
        title="Moments From the Journey"
        description="A glimpse into the landscapes, cultures, and experiences awaiting you in Ethiopia."
        gradient
      />

      <Stagger
        fast
        className="grid auto-rows-[180px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4 md:gap-4"
      >
        {galleryImages.map((image) => (
          <StaggerItem key={image.src} className={image.span}>
            <motion.div
              whileHover={{ scale: 1.03, y: -4 }}
              transition={spring}
              className="group relative h-full overflow-hidden rounded-[20px] ring-1 ring-border/50"
            >
              <motion.div
                className="absolute inset-0"
                whileHover={{ scale: 1.12 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"
              />
            </motion.div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
