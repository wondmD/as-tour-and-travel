"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { type ReactNode } from "react";
import { ease } from "@/lib/motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  scale?: boolean;
  blur?: boolean;
}

const directionOffset = {
  up: { y: 32 },
  down: { y: -32 },
  left: { x: 36 },
  right: { x: -36 },
  none: {},
};

export function FadeIn({
  children,
  delay = 0,
  direction = "up",
  scale = false,
  blur = false,
  className,
  ...props
}: FadeInProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directionOffset[direction],
        ...(scale ? { scale: 0.94 } : {}),
        ...(blur ? { filter: "blur(8px)" } : {}),
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
