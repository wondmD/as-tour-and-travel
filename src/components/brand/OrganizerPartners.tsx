import Image from "next/image";
import { AS_TOUR, JOINT_TOUR_ORGANIZERS, SISTER_COMPANY } from "@/lib/constants";
import { brandAssets } from "@/lib/seo";

type OrganizerPartnersVariant = "hero" | "card" | "compact" | "feature";
type OrganizerPartnersTheme = "light" | "dark";

interface OrganizerPartnersProps {
  variant?: OrganizerPartnersVariant;
  theme?: OrganizerPartnersTheme;
  className?: string;
  showDescription?: boolean;
}

export function OrganizerPartners({
  variant = "compact",
  theme = "dark",
  className = "",
  showDescription = true,
}: OrganizerPartnersProps) {
  const isLight = theme === "light";
  const logoHeight =
    variant === "feature"
      ? "h-14 w-14 sm:h-16 sm:w-16 lg:h-[4.5rem] lg:w-[4.5rem]"
      : variant === "hero"
        ? "h-11 w-11 sm:h-12 sm:w-12"
        : variant === "card"
          ? "h-10 w-10"
          : "h-9 w-9";

  const labelClass = isLight
    ? variant === "feature"
      ? "text-white/70"
      : "text-white/65"
    : "text-text-secondary";
  const textClass = isLight ? "text-white/80" : "text-text-secondary";
  const nameClass = isLight ? "text-white" : "text-text-primary";
  const dividerClass = isLight ? "bg-white/20" : "bg-border";
  const isFeature = variant === "feature";

  return (
    <div className={className}>
      <p
        className={`font-bold uppercase tracking-widest ${
          isFeature
            ? "text-xs sm:text-sm"
            : "text-[10px] sm:text-xs"
        } ${labelClass}`}
      >
        {JOINT_TOUR_ORGANIZERS.label}
      </p>

      <div
        className={`mt-2 flex items-center gap-2.5 sm:gap-3 ${
          variant === "hero" || isFeature ? "mt-3 sm:mt-4" : ""
        } ${isFeature ? "gap-3 sm:gap-4" : ""}`}
      >
        <div className={`relative shrink-0 ${logoHeight} notranslate`}>
          <Image
            src={brandAssets.logo}
            alt={AS_TOUR.name}
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>

        <span
          className={`font-semibold ${
            isFeature ? "text-sm sm:text-base" : "text-xs"
          } ${isLight ? "text-white/50" : "text-text-secondary/70"}`}
          aria-hidden
        >
          +
        </span>

        <div className={`relative shrink-0 ${logoHeight} notranslate`}>
          <Image
            src={SISTER_COMPANY.logo}
            alt={SISTER_COMPANY.nameEn}
            fill
            className="object-contain"
            sizes="48px"
          />
        </div>

        <div className="min-w-0">
          <p
            className={`notranslate font-heading font-semibold leading-tight ${nameClass} ${
              isFeature ? "text-sm sm:text-base lg:text-lg" : "text-xs sm:text-sm"
            }`}
          >
            {AS_TOUR.name}
          </p>
          <p
            className={`notranslate mt-0.5 leading-tight ${textClass} ${
              isFeature ? "text-xs sm:text-sm lg:text-base" : "text-[10px] sm:text-xs"
            }`}
          >
            {SISTER_COMPANY.nameEn}
          </p>
          <p
            className={`mt-0.5 leading-tight ${textClass} ${
              isFeature ? "text-xs sm:text-sm" : "hidden text-[10px] sm:block"
            }`}
          >
            {SISTER_COMPANY.officeEn}
          </p>
        </div>
      </div>

      {showDescription && variant !== "compact" && (
        <>
          <div className={`${isFeature ? "my-4" : "my-3"} h-px ${dividerClass}`} />
          <p
            className={`leading-relaxed ${textClass} ${
              isFeature ? "text-sm sm:text-base" : "text-xs"
            }`}
          >
            {JOINT_TOUR_ORGANIZERS.description}
          </p>
          <p
            className={`mt-2 font-heading leading-relaxed ${nameClass} ${
              isFeature ? "text-base sm:text-lg" : "text-sm"
            } notranslate`}
            dir="rtl"
            lang="ar"
          >
            {SISTER_COMPANY.nameAr} — {SISTER_COMPANY.officeAr}
          </p>
        </>
      )}
    </div>
  );
}
