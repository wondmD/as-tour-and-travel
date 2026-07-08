"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { type ReactNode } from "react";
import { spring } from "@/lib/motion";
import { cn } from "@/lib/cn";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "ghost"
  | "outline"
  | "danger"
  | "success"
  | "soft";

type ButtonSize = "xs" | "sm" | "md" | "lg" | "icon";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  "aria-label"?: string;
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
  danger:
    "bg-gradient-to-r from-danger to-[#d4736c] text-white hover:opacity-95 shadow-[0_4px_14px_rgba(196,85,77,0.3)]",
  success:
    "bg-gradient-to-r from-success to-[#48a684] text-white hover:opacity-95 shadow-[0_4px_14px_rgba(47,143,107,0.3)]",
  soft: "bg-primary/8 text-primary hover:bg-primary/14 border border-primary/10",
};

const sizes: Record<ButtonSize, string> = {
  xs: "min-h-7 px-2.5 py-1 text-xs rounded-lg gap-1",
  sm: "min-h-9 px-3.5 py-1.5 text-sm rounded-xl gap-1.5",
  md: "min-h-11 px-5 py-3 text-sm rounded-2xl gap-2 sm:px-6",
  lg: "min-h-13 px-7 py-3.5 text-base rounded-2xl gap-2.5",
  icon: "size-10 rounded-xl p-0",
};

const MotionLink = motion.create(Link);

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  type = "button",
  disabled = false,
  loading = false,
  fullWidth = false,
  "aria-label": ariaLabel,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const classes = cn(
    "inline-flex items-center justify-center font-semibold transition-colors duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2",
    sizes[size],
    variants[variant],
    fullWidth && "w-full",
    isDisabled && "pointer-events-none opacity-55 saturate-50",
    className,
  );

  const content = (
    <>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </>
  );

  const hoverMotion = isDisabled
    ? {}
    : { whileHover: { scale: 1.03, y: -2 }, whileTap: { scale: 0.97 } };

  if (href && !isDisabled) {
    return (
      <MotionLink
        href={href}
        className={classes}
        aria-label={ariaLabel}
        {...hoverMotion}
        transition={spring}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={classes}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={loading || undefined}
      {...hoverMotion}
      transition={spring}
    >
      {content}
    </motion.button>
  );
}
