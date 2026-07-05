"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Keyboard, X } from "lucide-react";

const STORAGE_KEY = "as-tour-itinerary-hint";

export function KeyboardHintToast() {
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(STORAGE_KEY) === "dismissed") return;

    const mobileQuery = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mobileQuery.matches);

    const timer = window.setTimeout(() => setVisible(true), 1200);
    const hideTimer = window.setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "dismissed");
    }, mobileQuery.matches ? 9000 : 6000);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "dismissed");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className="pointer-events-none fixed inset-x-0 z-[60] bottom-[calc(5.5rem+env(safe-area-inset-bottom,0px))] px-3 sm:px-4 lg:bottom-[calc(6rem+env(safe-area-inset-bottom,0px))]"
        >
          <div className="pointer-events-auto mx-auto w-full max-w-md rounded-2xl border border-border/60 bg-surface/95 p-3 shadow-xl backdrop-blur-md sm:max-w-lg sm:p-4 lg:max-w-xl">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                {isMobile ? (
                  <span className="flex items-center gap-0.5" aria-hidden>
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <Keyboard className="h-4 w-4" aria-hidden />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-snug text-text-primary">
                  {isMobile
                    ? "Tip: tap the arrows to move between stops"
                    : "Tip: use arrow keys to move between stops"}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {isMobile
                    ? "Use Prev / Next below the itinerary, or tap stops on the route strip."
                    : "← → or ↑ ↓ to browse the itinerary"}
                </p>
              </div>

              <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss tip"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={dismiss}
              className="mt-3 w-full min-h-10 rounded-xl bg-primary/10 px-3 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15 sm:mt-4"
            >
              Got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
