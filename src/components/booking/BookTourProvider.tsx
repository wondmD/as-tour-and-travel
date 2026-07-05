"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock, Mail, Phone, X } from "lucide-react";
import { OrganizerPartners } from "@/components/brand/OrganizerPartners";
import { ORGANIZER_CONTACT } from "@/lib/constants";
import { ease } from "@/lib/motion";

interface BookTourContextValue {
  open: () => void;
  close: () => void;
}

const BookTourContext = createContext<BookTourContextValue | null>(null);

export function useBookTour() {
  const ctx = useContext(BookTourContext);
  if (!ctx) {
    throw new Error("useBookTour must be used within BookTourProvider");
  }
  return ctx;
}

export function BookTourProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  return (
    <BookTourContext.Provider value={{ open, close }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center p-3 sm:items-center sm:p-4">
            <motion.button
              type="button"
              aria-label="Close booking dialog"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-text-primary/60 backdrop-blur-sm"
              onClick={close}
            />

            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="book-tour-title"
              initial={{ opacity: 0, y: 32, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.3, ease }}
              className="relative z-10 w-full max-w-md overflow-hidden rounded-[22px] border border-border/50 bg-surface shadow-2xl shadow-primary/10"
            >
              <div className="bg-gradient-to-br from-primary via-primary to-primary-dark px-5 py-5 text-white sm:px-6 sm:py-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                      Book with us
                    </p>
                    <h2
                      id="book-tour-title"
                      className="mt-1 font-heading text-xl font-bold sm:text-2xl"
                    >
                      Ready to join the tour?
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-white/75">
                      Contact our team directly — we&apos;ll help you reserve your
                      seat and answer any questions.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    aria-label="Close"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white transition-colors hover:bg-white/20"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                <OrganizerPartners variant="compact" theme="dark" showDescription />

                <div>
                  <p className="font-heading text-sm font-semibold text-text-primary">
                    {ORGANIZER_CONTACT.name}
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm text-text-secondary">
                    <li className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 shrink-0 text-primary" />
                      <span className="notranslate">{ORGANIZER_CONTACT.phone}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 shrink-0 text-primary" />
                      <span className="notranslate">{ORGANIZER_CONTACT.email}</span>
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Clock className="h-4 w-4 shrink-0 text-primary" />
                      {ORGANIZER_CONTACT.hours}
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <a
                    href={ORGANIZER_CONTACT.phoneHref}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-accent to-accent-light px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 btn-glow-accent"
                  >
                    <Phone className="h-4 w-4" />
                    Call Now
                  </a>
                  <a
                    href={ORGANIZER_CONTACT.emailHref}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-primary to-primary-light px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-95 btn-glow-primary"
                  >
                    <Mail className="h-4 w-4" />
                    Contact Now
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </BookTourContext.Provider>
  );
}
