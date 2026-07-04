"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { staggerContainer, staggerContainerFast } from "@/lib/motion";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  fast?: boolean;
  as?: "div" | "ul";
}

export function Stagger({
  children,
  className,
  fast = false,
  as = "div",
}: StaggerProps) {
  const Component = motion[as];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={fast ? staggerContainerFast : staggerContainer}
      className={className}
    >
      {children}
    </Component>
  );
}
