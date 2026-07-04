"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard } from "lucide-react";

export function KeyboardHintToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("as-tour-keyboard-hint") === "dismissed") return;

    const timer = setTimeout(() => setVisible(true), 1200);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("as-tour-keyboard-hint", "dismissed");
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="fixed bottom-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-2xl border border-border/60 bg-surface/95 px-4 py-3 shadow-xl backdrop-blur-md lg:bottom-8"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Keyboard className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Tip: use arrow keys to move between stops
            </p>
            <p className="text-xs text-text-secondary">← → or ↑ ↓ to browse the itinerary</p>
          </div>
          <button
            type="button"
            onClick={() => {
              setVisible(false);
              sessionStorage.setItem("as-tour-keyboard-hint", "dismissed");
            }}
            className="ml-2 text-xs font-semibold text-primary hover:underline"
          >
            Got it
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
