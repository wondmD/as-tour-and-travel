"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Loader2 } from "lucide-react";
import {
  applyLanguageTranslation,
  getStoredLanguage,
  GOOGLE_TRANSLATE_CONTAINER_ID,
  initGoogleTranslate,
  isTranslationApplied,
  TRANSLATION_PENDING_KEY,
  waitForTranslationComplete,
  type LanguageCode,
} from "@/lib/i18n";

type TranslationContextValue = {
  language: LanguageCode;
  isReady: boolean;
  isTranslating: boolean;
  changeLanguage: (code: LanguageCode) => Promise<void>;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return context;
}

function TranslationOverlay({ language }: { language: LanguageCode }) {
  const title =
    language === "ar" ? "Translating to Arabic…" : "Switching to English…";

  return (
    <div
      className="notranslate fixed inset-0 z-[200] flex items-center justify-center bg-black/45 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/15 bg-text-primary/95 px-8 py-7 text-center text-white shadow-2xl">
        <Loader2 className="h-9 w-9 animate-spin text-secondary-light" aria-hidden />
        <div>
          <p className="font-heading text-base font-semibold">{title}</p>
          <p className="mt-1 text-sm text-white/60">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [isReady, setIsReady] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [overlayLanguage, setOverlayLanguage] = useState<LanguageCode>("en");
  const initialSyncDone = useRef(false);
  const hadPendingReload = useRef(false);

  useEffect(() => {
    const pending = window.sessionStorage.getItem(TRANSLATION_PENDING_KEY);
    if (pending === "en" || pending === "ar") {
      hadPendingReload.current = true;
      setOverlayLanguage(pending);
      setIsTranslating(true);
      window.sessionStorage.removeItem(TRANSLATION_PENDING_KEY);
    }

    void initGoogleTranslate().then(() => {
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady || initialSyncDone.current) return;
    initialSyncDone.current = true;

    const stored = getStoredLanguage();
    setLanguage(stored);

    if (stored === "ar" && !isTranslationApplied("ar")) {
      setOverlayLanguage("ar");
      setIsTranslating(true);

      void applyLanguageTranslation("ar")
        .then(({ needsReload }) => {
          if (needsReload) {
            window.sessionStorage.setItem(TRANSLATION_PENDING_KEY, "ar");
            window.location.reload();
            return;
          }
          return waitForTranslationComplete("ar", 12000);
        })
        .finally(() => setIsTranslating(false));
      return;
    }

    if (hadPendingReload.current) {
      window.setTimeout(() => setIsTranslating(false), 350);
    }
  }, [isReady]);

  const changeLanguage = useCallback(
    async (nextLanguage: LanguageCode) => {
      if (nextLanguage === language && isTranslationApplied(nextLanguage)) {
        return;
      }

      setOverlayLanguage(nextLanguage);
      setIsTranslating(true);
      setLanguage(nextLanguage);

      try {
        const { needsReload } = await applyLanguageTranslation(nextLanguage);

        if (needsReload) {
          window.sessionStorage.setItem(TRANSLATION_PENDING_KEY, nextLanguage);
          window.location.reload();
          return;
        }

        await waitForTranslationComplete(nextLanguage, 12000);
      } finally {
        setIsTranslating(false);
      }
    },
    [language]
  );

  return (
    <TranslationContext.Provider
      value={{ language, isReady, isTranslating, changeLanguage }}
    >
      <div id={GOOGLE_TRANSLATE_CONTAINER_ID} className="hidden" aria-hidden />
      {children}
      {isTranslating && <TranslationOverlay language={overlayLanguage} />}
    </TranslationContext.Provider>
  );
}
