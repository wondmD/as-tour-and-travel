"use client";

import { Check, ChevronDown, Globe, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { LANGUAGE_OPTIONS, type LanguageCode } from "@/lib/i18n";
import { useTranslation } from "@/components/i18n/TranslationProvider";

interface LanguageSwitcherProps {
  theme?: "light" | "dark";
  className?: string;
  onSelect?: () => void;
  /** Inline list for constrained parents (e.g. mobile nav). Avoids clipped dropdowns. */
  menuMode?: "dropdown" | "inline";
}

export function LanguageSwitcher({
  theme = "dark",
  className = "",
  onSelect,
  menuMode = "dropdown",
}: LanguageSwitcherProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { language, isReady, isTranslating, changeLanguage } = useTranslation();

  const selectedLanguage = useMemo(
    () => LANGUAGE_OPTIONS.find((option) => option.code === language) ?? LANGUAGE_OPTIONS[0],
    [language]
  );

  const isLight = theme === "light";
  const isInline = menuMode === "inline";
  const isDisabled = !isReady || isTranslating;

  useEffect(() => {
    const closeMenu = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeMenu);
    window.addEventListener("keydown", onEscape);

    return () => {
      document.removeEventListener("mousedown", closeMenu);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  const handleLanguageChange = async (nextLanguage: LanguageCode) => {
    if (nextLanguage === language || isDisabled) return;

    setIsOpen(false);
    onSelect?.();
    await changeLanguage(nextLanguage);
  };

  const menuSurfaceClass = isLight
    ? "border-white/15 bg-text-primary/95 text-white backdrop-blur-md"
    : "border-border/60 bg-surface text-text-primary";

  const menuItemClass = isLight
    ? "hover:bg-white/10"
    : "hover:bg-primary/8 hover:text-primary";

  return (
    <div
      ref={wrapperRef}
      className={`notranslate ${isInline ? "w-full" : "relative"} ${className}`}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Change language"
        disabled={isDisabled}
        className={`inline-flex h-10 min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors sm:gap-2 sm:px-3.5 sm:text-sm ${
          isInline ? "w-full justify-between" : ""
        } ${
          isDisabled ? "cursor-wait opacity-80" : ""
        } ${
          isLight
            ? "border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
            : "border border-border/60 bg-surface text-text-primary shadow-sm hover:border-primary/20 hover:bg-primary/5"
        }`}
        onClick={() => {
          if (!isDisabled) setIsOpen((current) => !current);
        }}
      >
        {isTranslating ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden />
        ) : (
          <Globe className="h-4 w-4 shrink-0" aria-hidden />
        )}
        <span>{selectedLanguage.shortLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {isOpen && !isDisabled && (
        <div
          role="menu"
          className={
            isInline
              ? `mt-2 w-full rounded-2xl border p-1.5 shadow-lg ${menuSurfaceClass}`
              : `absolute end-0 top-full z-[70] mt-2 min-w-40 rounded-2xl border p-1.5 shadow-xl sm:min-w-44 ${menuSurfaceClass}`
          }
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              role="menuitem"
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${menuItemClass}`}
              onClick={() => void handleLanguageChange(option.code)}
            >
              <span>{option.label}</span>
              <span className={isLight ? "text-white/50" : "text-text-secondary"}>
                {language === option.code ? (
                  <Check className="h-4 w-4 text-secondary" aria-hidden />
                ) : (
                  option.shortLabel
                )}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
