"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  clearGoogleTranslateCookie,
  getCookieLanguage,
  getLanguageOption,
  GOOGLE_TRANSLATE_CONTAINER_ID,
  GOOGLE_TRANSLATE_SCRIPT_ID,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  setGoogleTranslateCookie,
  waitForTranslateSelect,
  type LanguageCode,
} from "@/lib/i18n";

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement?: new (
          options: Record<string, unknown>,
          containerId: string
        ) => unknown;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

interface LanguageSwitcherProps {
  theme?: "light" | "dark";
  className?: string;
  onSelect?: () => void;
}

export function LanguageSwitcher({
  theme = "dark",
  className = "",
  onSelect,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [language, setLanguage] = useState<LanguageCode>("en");

  const selectedLanguage = useMemo(
    () => getLanguageOption(language),
    [language]
  );

  const isLight = theme === "light";

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

  useEffect(() => {
    const storedLanguage =
      (window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null) ??
      null;
    const initialLanguage = storedLanguage ?? getCookieLanguage() ?? "en";
    setLanguage(initialLanguage);

    window.googleTranslateElementInit = () => {
      const container = document.getElementById(GOOGLE_TRANSLATE_CONTAINER_ID);
      if (
        !container ||
        !window.google?.translate?.TranslateElement ||
        container.childNodes.length > 0
      ) {
        setIsReady(true);
        return;
      }

      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          includedLanguages: "en,ar",
          autoDisplay: false,
          layout: 0,
        },
        GOOGLE_TRANSLATE_CONTAINER_ID
      );

      setIsReady(true);
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
      return;
    }

    if (document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) return;

    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const syncLanguage = async () => {
      const activeLanguage =
        (window.localStorage.getItem(LANGUAGE_STORAGE_KEY) as LanguageCode | null) ??
        language;
      const selectedOption = getLanguageOption(activeLanguage);
      const select = await waitForTranslateSelect();

      if (activeLanguage === "en") {
        clearGoogleTranslateCookie();
        setGoogleTranslateCookie("en");
        if (select && select.value !== "en") {
          select.value = "en";
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
        setLanguage("en");
        return;
      }

      if (!select) return;

      setGoogleTranslateCookie(selectedOption.googleCode);
      if (select.value !== selectedOption.googleCode) {
        select.value = selectedOption.googleCode;
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }

      setLanguage(activeLanguage);
    };

    const timer = window.setTimeout(() => {
      void syncLanguage();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [isReady, pathname, language]);

  const handleLanguageChange = async (nextLanguage: LanguageCode) => {
    const selectedOption = getLanguageOption(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    setLanguage(nextLanguage);
    setIsOpen(false);
    onSelect?.();

    if (nextLanguage === "en") {
      clearGoogleTranslateCookie();
      setGoogleTranslateCookie("en");
      window.location.reload();
      return;
    }

    const select = await waitForTranslateSelect();
    if (!select) {
      setGoogleTranslateCookie(selectedOption.googleCode);
      window.location.reload();
      return;
    }

    setGoogleTranslateCookie(selectedOption.googleCode);
    select.value = selectedOption.googleCode;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  };

  return (
    <div ref={wrapperRef} className={`notranslate relative ${className}`}>
      <div id={GOOGLE_TRANSLATE_CONTAINER_ID} className="hidden" aria-hidden />

      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Change language"
        className={`inline-flex h-10 min-h-10 items-center gap-1.5 rounded-xl px-3 text-xs font-semibold transition-colors sm:gap-2 sm:px-3.5 sm:text-sm ${
          isLight
            ? "border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/15"
            : "border border-border/60 bg-surface text-text-primary shadow-sm hover:border-primary/20 hover:bg-primary/5"
        }`}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Globe className="h-4 w-4 shrink-0" aria-hidden />
        <span>{selectedLanguage.shortLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`}
          aria-hidden
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className={`absolute end-0 top-full z-50 mt-2 min-w-40 rounded-2xl border p-1.5 shadow-xl sm:min-w-44 ${
            isLight
              ? "border-white/15 bg-text-primary/95 text-white backdrop-blur-md"
              : "border-border/60 bg-surface text-text-primary"
          }`}
        >
          {LANGUAGE_OPTIONS.map((option) => (
            <button
              key={option.code}
              type="button"
              role="menuitem"
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                isLight
                  ? "hover:bg-white/10"
                  : "hover:bg-primary/8 hover:text-primary"
              }`}
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
