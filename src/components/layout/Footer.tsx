"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { NAV_LINKS, JOINT_TOUR_ORGANIZERS, ORGANIZER_CONTACT, SISTER_COMPANY, TOUR_001_SLUG } from "@/lib/constants";
import { FadeIn } from "@/components/ui/FadeIn";
import { Logo } from "@/components/brand/Logo";
import { OrganizerPartners } from "@/components/brand/OrganizerPartners";
import { ease } from "@/lib/motion";

const certifications = [
  "Ethiopian Tourism Commission Licensed",
  "IATA Accredited Agent",
  "ATA Member (African Travel Association)",
  "Fully Insured Operations",
];

export function Footer() {
  return (
    <footer id="contact" className="relative overflow-hidden bg-text-primary text-white">
      <div className="hero-grid-overlay absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 animate-blob rounded-full bg-primary/20 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-5 sm:py-16 md:px-6 lg:px-8">
        <FadeIn direction="up">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-1">
              <Link href="/" className="group mb-4 inline-block">
                <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Logo theme="light" />
                </motion.div>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-white/55">
                Curating unforgettable journeys through Ethiopia for international
                travelers since 2010. Licensed, insured, and locally owned.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/50">
                {JOINT_TOUR_ORGANIZERS.description}
              </p>
              <OrganizerPartners
                variant="compact"
                theme="light"
                className="mt-4"
                showDescription={false}
              />
              <p className="mt-2 text-xs text-white/45" dir="rtl" lang="ar">
                {SISTER_COMPANY.nameAr} — {SISTER_COMPANY.officeAr}
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease }}
            >
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-white/35">
                Navigation
              </h3>
              <ul className="space-y-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/65 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/tours/${TOUR_001_SLUG}`}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    Tour 001
                  </Link>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5, ease }}
            >
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-white/35">
                Contact
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-white/65">
                  <Phone className="h-4 w-4 shrink-0 text-secondary-light" />
                  <span className="notranslate">{ORGANIZER_CONTACT.phone}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-white/65">
                  <Mail className="h-4 w-4 shrink-0 text-secondary-light" />
                  <span className="notranslate">{ORGANIZER_CONTACT.email}</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease }}
            >
              <h3 className="mb-4 font-heading text-sm font-semibold uppercase tracking-wider text-white/35">
                Certifications
              </h3>
              <ul className="space-y-2">
                {certifications.map((item) => (
                  <li key={item} className="text-sm text-white/65">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </FadeIn>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/8 pt-8 md:flex-row"
        >
          <p className="text-sm text-white/40">
            &copy; {new Date().getFullYear()} AS Tour & Travel. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-white/40">
            <Link href="/privacy" className="transition-colors hover:text-white/70">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white/70">
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
