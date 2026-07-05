import Image from "next/image";
import { brandAssets } from "@/lib/seo";

type LogoVariant = "full" | "compact" | "icon";
type LogoTheme = "light" | "dark";

interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  className?: string;
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

function LogoMark({
  className = "",
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={brandAssets.logo}
      alt=""
      width={1280}
      height={1280}
      priority={priority}
      className={`object-contain ${className}`}
      sizes="(max-width: 768px) 40px, 44px"
    />
  );
}

export function Logo({
  variant = "full",
  theme = "dark",
  className = "",
}: LogoProps) {
  const colors = textColors[theme];
  const iconSize =
    variant === "icon" ? "h-10 w-10" : variant === "compact" ? "h-9 w-9" : "h-11 w-11";

  if (variant === "icon") {
    return <LogoMark className={`${iconSize} shrink-0 ${className}`} priority />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className={`${iconSize} shrink-0`} priority />

      {variant === "full" && (
        <>
          <span
            className={`hidden h-8 w-px shrink-0 sm:block ${colors.rule}`}
            aria-hidden
          />
          <div className="notranslate flex min-w-0 flex-col justify-center leading-none">
            <span
              className={`font-heading text-sm font-semibold tracking-[0.02em] sm:text-[0.95rem] md:text-base ${colors.primary}`}
              translate="no"
            >
              AS Tour &amp; Travel
            </span>
            <span
              className={`mt-0.5 text-[0.58rem] font-medium uppercase tracking-[0.18em] sm:mt-1 sm:text-[0.62rem] sm:tracking-[0.22em] ${colors.secondary}`}
              translate="no"
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
