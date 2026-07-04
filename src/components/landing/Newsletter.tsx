"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/ui/FadeIn";
import { ease, spring } from "@/lib/motion";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <Section pattern="dots" tone="surface" mesh className="!py-24">
      <div className="mx-auto max-w-3xl text-center">
        <SectionHeading
          eyebrow="Stay Inspired"
          title="Join Our Travel Community"
          description="Receive curated travel stories, exclusive tour announcements, and insider tips for exploring Ethiopia."
          gradient
        />

        <FadeIn scale>
          <motion.div
            whileHover={{ y: -4 }}
            transition={spring}
            className="gradient-border glass-strong mx-auto max-w-xl p-8"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.35, ease }}
                  className="flex flex-col items-center gap-3"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary"
                  >
                    <Sparkles className="h-6 w-6" />
                  </motion.div>
                  <p className="font-heading text-lg font-semibold text-secondary">
                    Thank you for subscribing!
                  </p>
                  <p className="text-sm text-text-secondary">
                    We&apos;ll send you the latest from Ethiopia soon.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="flex-1 rounded-2xl border border-border/60 bg-background/80 px-5 py-3.5 text-sm text-text-primary placeholder:text-text-secondary/50 backdrop-blur-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15"
                    aria-label="Email address"
                  />
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={spring}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary-light px-6 py-3.5 text-sm font-semibold text-white btn-glow-primary"
                  >
                    Subscribe
                    <Send className="h-4 w-4" />
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </FadeIn>
      </div>
    </Section>
  );
}
