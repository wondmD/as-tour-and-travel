import type { Destination } from "@/data/tour-001";
import { SectionPhotoBackground } from "@/components/ui/SectionPhotoBackground";

interface JourneySectionBackgroundProps {
  destinations: Destination[];
  activeIndex?: number;
}

export function JourneySectionBackground({
  destinations,
  activeIndex = 0,
}: JourneySectionBackgroundProps) {
  const active = destinations[activeIndex] ?? destinations[0];

  if (!active) return null;

  return (
    <SectionPhotoBackground
      src={active.heroImage}
      alt=""
      variant="light"
      crossfadeKey={active.id}
    />
  );
}
