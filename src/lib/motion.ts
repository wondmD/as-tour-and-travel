import type { Transition, Variants } from "framer-motion";

export const ease = [0.22, 1, 0.36, 1] as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 24,
};

export const smooth: Transition = {
  duration: 0.6,
  ease,
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay, ease },
  }),
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay, ease },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, delay, ease },
  }),
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, delay, ease },
  }),
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: (delay = 0) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, delay, ease },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

export const cardHover = {
  y: -8,
  transition: spring,
};

export const viewport = {
  once: true,
  margin: "-60px" as const,
};
