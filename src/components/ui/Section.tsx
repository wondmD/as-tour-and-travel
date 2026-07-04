import { type ReactNode } from "react";

type Pattern = "dots" | "grid" | "diagonal" | "surface" | "none";
type Tone = "default" | "surface" | "alt" | "dark";

interface SectionProps {
  children: ReactNode;
  id?: string;
  pattern?: Pattern;
  tone?: Tone;
  mesh?: boolean;
  className?: string;
  containerClassName?: string;
}

const patternMap: Record<Pattern, string> = {
  dots: "pattern-dots",
  grid: "pattern-grid",
  diagonal: "pattern-diagonal",
  surface: "pattern-surface",
  none: "",
};

const toneMap: Record<Tone, string> = {
  default: "bg-background",
  surface: "bg-surface",
  alt: "bg-background-alt",
  dark: "bg-text-primary text-white",
};

export function Section({
  children,
  id,
  pattern = "none",
  tone = "default",
  mesh = false,
  className = "",
  containerClassName = "",
}: SectionProps) {
  return (
    <section
      id={id}
      className={`relative overflow-hidden py-20 md:py-28 ${toneMap[tone]} ${patternMap[pattern]} ${mesh ? "mesh-blobs" : ""} ${className}`}
    >
      <div className={`relative z-10 mx-auto max-w-7xl px-4 md:px-6 lg:px-8 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}
