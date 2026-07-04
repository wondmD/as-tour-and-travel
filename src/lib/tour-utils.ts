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
  "addis-arrival": {
    ring: "ring-primary/20",
    glow: "shadow-primary/10",
    label: "Capital welcome",
  },
  "addis-museums-entoto": {
    ring: "ring-secondary/25",
    glow: "shadow-secondary/10",
    label: "Culture & highlands",
  },
  "entoto-nature": {
    ring: "ring-emerald-400/25",
    glow: "shadow-emerald-400/10",
    label: "Mountain leisure",
  },
  "bishoftu-lakeside": {
    ring: "ring-amber-400/25",
    glow: "shadow-amber-400/10",
    label: "Lakeside calm",
  },
  "bishoftu-addis": {
    ring: "ring-primary/20",
    glow: "shadow-primary/10",
    label: "City free time",
  },
  "wonchi-crater": {
    ring: "ring-teal-400/25",
    glow: "shadow-teal-400/10",
    label: "Highland crater",
  },
  "wonchi-addis": {
    ring: "ring-primary/20",
    glow: "shadow-primary/10",
    label: "Scenic return",
  },
  "arba-minch-dorze": {
    ring: "ring-orange-400/25",
    glow: "shadow-orange-400/10",
    label: "Dorze culture",
  },
  "arba-minch-chamo": {
    ring: "ring-orange-400/25",
    glow: "shadow-orange-400/10",
    label: "Wildlife & springs",
  },
  departure: {
    ring: "ring-slate-400/25",
    glow: "shadow-slate-400/10",
    label: "Farewell day",
  },
};
