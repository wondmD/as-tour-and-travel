"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { motion } from "framer-motion";

interface ShareStopButtonProps {
  stopId: string;
  stopName: string;
}

export function ShareStopButton({ stopId, stopName }: ShareStopButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${stopId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: stopName, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* user cancelled or clipboard denied */
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleShare}
      whileTap={{ scale: 0.95 }}
      className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-[11px] font-semibold text-text-secondary transition-colors hover:bg-primary/5 hover:text-primary"
      aria-label={`Share link to ${stopName}`}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-secondary" />
          Link copied
        </>
      ) : (
        <>
          <Link2 className="h-3.5 w-3.5" />
          Share this stop
        </>
      )}
    </motion.button>
  );
}
