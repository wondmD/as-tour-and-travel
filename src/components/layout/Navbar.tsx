"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, TOUR_001_SLUG } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/brand/Logo";
import { ease, spring } from "@/lib/motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease, delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6"
    >
      <motion.nav
        layout
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-colors duration-500 md:px-6 ${
          scrolled
            ? "glass-strong shadow-lg shadow-primary/5"
            : "bg-transparent"
        }`}
        aria-label="Main navigation"
      >
        <Link href="/" className="group">
          <motion.div
            whileHover={{ scale: 1.03 }}
            transition={spring}
          >
            <Logo theme={scrolled ? "dark" : "light"} />
          </motion.div>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_LINKS.map((link, i) => (
            <motion.li
              key={link.href}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05, duration: 0.4, ease }}
            >
              <Link
                href={link.href}
                className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-all hover:bg-primary/5 ${
                  scrolled
                    ? "text-text-secondary hover:text-primary"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </motion.li>
          ))}
        </ul>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5, ease }}
          className="hidden items-center gap-2 lg:flex"
        >
          <Link
            href="/login"
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all hover:bg-primary/5 ${
              scrolled ? "text-text-secondary hover:text-primary" : "text-white/85 hover:text-white"
            }`}
          >
            Login
          </Link>
          <Link
            href="/register"
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
              scrolled
                ? "glass border-border/60 text-text-primary hover:border-primary/20"
                : "border-white/25 bg-white/5 text-white backdrop-blur-sm hover:bg-white/10"
            }`}
          >
            Register
          </Link>
          <Button href={`/tours/${TOUR_001_SLUG}`} variant="accent" className="!py-2.5 !px-5">
            Book Tour
          </Button>
        </motion.div>

        <button
          type="button"
          className={`rounded-xl p-2 transition-colors lg:hidden ${
            scrolled ? "text-text-primary hover:bg-primary/5" : "text-white hover:bg-white/10"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl glass-strong shadow-xl lg:hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.05 } },
                hidden: {},
              }}
              className="flex flex-col gap-1 p-3"
            >
              {NAV_LINKS.map((link) => (
                <motion.div
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -16 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <hr className="my-2 border-border/60" />
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-text-secondary"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-text-secondary"
              >
                Register
              </Link>
              <Button
                href={`/tours/${TOUR_001_SLUG}`}
                variant="accent"
                className="mt-2 w-full"
              >
                Book Tour
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
