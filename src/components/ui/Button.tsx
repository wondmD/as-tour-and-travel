"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { spring } from "@/lib/motion";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "outline";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-primary to-primary-light text-white hover:opacity-95 btn-glow-primary",
  secondary:
    "glass text-text-primary border border-border/80 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5",
  accent:
    "bg-gradient-to-r from-accent to-accent-light text-white hover:opacity-95 btn-glow-accent",
  ghost: "text-text-primary hover:bg-primary/5",
  outline:
    "border border-white/30 text-white hover:bg-white/10 backdrop-blur-md bg-white/5",
};

const MotionLink = motion.create(Link);

export function Button({
  children,
  href,
  variant = "primary",
  className = "",
  onClick,
  type = "button",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2";

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <MotionLink
        href={href}
        className={classes}
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        transition={spring}
      >
        {children}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={spring}
    >
      {children}
    </motion.button>
  );
}
