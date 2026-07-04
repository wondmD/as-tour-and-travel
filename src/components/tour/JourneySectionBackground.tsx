import Image from "next/image";
import type { Destination } from "@/data/tour-001";

interface JourneySectionBackgroundProps {
  destinations: Destination[];
  activeIndex?: number;
}

export function JourneySectionBackground({
  destinations,
  activeIndex = 0,
}: JourneySectionBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* Base animated mesh */}
      <div className="journey-mesh-base absolute inset-0" />

      {/* Floating gradient orbs */}
      <div className="journey-orb journey-orb-1" />
      <div className="journey-orb journey-orb-2" />
      <div className="journey-orb journey-orb-3" />
      <div className="journey-orb journey-orb-4" />

      {/* Subtle destination photo wash */}
      <div className="absolute inset-0 grid grid-cols-2 opacity-[0.07] sm:grid-cols-3 lg:grid-cols-5">
        {destinations.map((dest, i) => (
          <div
            key={dest.id}
            className={`relative min-h-[100px] transition-opacity duration-700 lg:min-h-0 ${
              i === activeIndex ? "opacity-100" : "opacity-40"
            }`}
          >
            <Image
              src={dest.heroImage}
              alt=""
              fill
              className="scale-110 object-cover blur-[2px]"
              sizes="20vw"
            />
          </div>
        ))}
      </div>

      {/* Vignette + glass scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/55 to-white/75" />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.06]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(248,250,252,0.85)_75%)]" />

      {/* Fine grid overlay */}
      <div className="pattern-grid absolute inset-0 opacity-[0.18]" />
    </div>
  );
}
