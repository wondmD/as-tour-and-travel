import { type SVGProps } from "react";

type LogoVariant = "full" | "compact" | "icon";
type LogoTheme = "light" | "dark";

interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  className?: string;
}

/** Formal corporate mark — navy badge with refined AS monogram */
function LogoMark({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
      {...props}
    >
      {/* Outer badge */}
      <rect x="1" y="1" width="46" height="46" rx="5" fill="#0F6CBD" />
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="5"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1"
        fill="none"
      />

      {/* Inner frame */}
      <rect
        x="5"
        y="5"
        width="38"
        height="38"
        rx="2"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth="0.75"
        fill="none"
      />

      {/* A — formal serif-inspired letterform */}
      <path
        d="M13.5 31.5 L17.25 17.5 L21 31.5 Z M14.85 26.25 H19.65"
        fill="white"
        fillRule="evenodd"
      />

      {/* S — formal letterform */}
      <path
        d="M29.75 17.75 C26.75 17.75 25.25 19.15 25.25 20.85 C25.25 22.55 26.65 23.15 28.45 23.65 C30.45 24.2 31.75 24.85 31.75 26.65 C31.75 28.85 29.55 30.25 27 30.25 C25.15 30.25 23.55 29.65 22.5 28.55 L23.85 27.35 C24.65 28.15 25.85 28.65 27.05 28.65 C28.55 28.65 29.55 27.75 29.55 26.55 C29.55 25.15 28.15 24.55 26.35 24.05 C24.35 23.5 23.25 22.65 23.25 21 C23.25 19.05 25.15 17.75 27.85 17.75 C29.35 17.75 30.65 18.25 31.55 19.05 L30.35 20.45 C29.65 19.75 28.75 17.75 29.75 17.75 Z"
        fill="white"
      />

      {/* Accent rule */}
      <rect x="10" y="35.5" width="28" height="1.25" rx="0.5" fill="#10B981" opacity="0.85" />
    </svg>
  );
}

const textColors: Record<LogoTheme, { primary: string; secondary: string; rule: string }> = {
  light: {
    primary: "text-white",
    secondary: "text-white/75",
    rule: "bg-white/25",
  },
  dark: {
    primary: "text-text-primary",
    secondary: "text-text-secondary",
    rule: "bg-border",
  },
};

export function Logo({
  variant = "full",
  theme = "dark",
  className = "",
}: LogoProps) {
  const colors = textColors[theme];
  const iconSize =
    variant === "icon" ? "h-10 w-10" : variant === "compact" ? "h-9 w-9" : "h-10 w-10";

  if (variant === "icon") {
    return <LogoMark className={`${iconSize} shrink-0 ${className}`} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={`${iconSize} shrink-0`} />

      {variant === "full" && (
        <>
          <span
            className={`hidden h-8 w-px shrink-0 sm:block ${colors.rule}`}
            aria-hidden
          />
          <div className="flex min-w-0 flex-col justify-center leading-none">
            <span
              className={`font-heading text-[0.95rem] font-semibold tracking-[0.02em] sm:text-base ${colors.primary}`}
            >
              AS Tour &amp; Travel
            </span>
            <span
              className={`mt-1 text-[0.62rem] font-medium uppercase tracking-[0.22em] ${colors.secondary}`}
            >
              Ethiopia
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export function LogoIcon({ className = "" }: { className?: string }) {
  return <LogoMark className={`h-10 w-10 shrink-0 ${className}`} />;
}
