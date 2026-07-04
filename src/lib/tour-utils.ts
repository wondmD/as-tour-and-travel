export function getDaysUntilDeparture(departureDate: string): number {
  const target = new Date(departureDate);
  if (Number.isNaN(target.getTime())) return 0;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const departure = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate()
  );

  return Math.max(0, Math.ceil((departure.getTime() - today.getTime()) / 86400000));
}

export const destinationMoods: Record<
  string,
  { ring: string; glow: string; label: string }
> = {
  "sheraton-addis": {
    ring: "ring-primary/20",
    glow: "shadow-primary/10",
    label: "Capital arrival",
  },
  entoto: {
    ring: "ring-secondary/25",
    glow: "shadow-secondary/10",
    label: "Highland mist",
  },
  "kuriftu-resort": {
    ring: "ring-amber-400/25",
    glow: "shadow-amber-400/10",
    label: "Lakeside calm",
  },
  "arba-minch": {
    ring: "ring-orange-400/25",
    glow: "shadow-orange-400/10",
    label: "Rift Valley warmth",
  },
  harar: {
    ring: "ring-indigo-400/30",
    glow: "shadow-indigo-500/15",
    label: "Historic finale",
  },
};
