export type LanguageCode = "en" | "ar";

export type LanguageOption = {
  code: LanguageCode;
  label: string;
  shortLabel: string;
  googleCode: string;
};

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: "en", label: "English", shortLabel: "EN", googleCode: "en" },
  { code: "ar", label: "العربية", shortLabel: "AR", googleCode: "ar" },
];

export const LANGUAGE_STORAGE_KEY = "as-tour-language";
export const TRANSLATION_PENDING_KEY = "as-tour-translating";
export const GOOGLE_TRANSLATE_CONTAINER_ID = "google_translate_element";
export const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";
export const GOOGLE_TRANSLATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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

export function getCookieLanguage(): LanguageCode | null {
  if (typeof document === "undefined") return null;

  const match = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
  if (!match) return null;

  const value = decodeURIComponent(match[1]);
  const googleCode = value.split("/").filter(Boolean).at(-1) ?? "en";
  return (
    LANGUAGE_OPTIONS.find((option) => option.googleCode === googleCode)?.code ??
    null
  );
}

export function getStoredLanguage(): LanguageCode {
  if (typeof window === "undefined") return "en";

  const stored = window.localStorage.getItem(
    LANGUAGE_STORAGE_KEY
  ) as LanguageCode | null;

  return stored ?? getCookieLanguage() ?? "en";
}

export function setGoogleTranslateCookie(googleCode: string) {
  const value = `/en/${googleCode}`;
  const hostname = window.location.hostname;
  const cookie = `googtrans=${value}; path=/; max-age=${GOOGLE_TRANSLATE_COOKIE_MAX_AGE}`;

  document.cookie = cookie;

  if (hostname.includes(".")) {
    document.cookie = `${cookie}; domain=.${hostname}`;
  }
}

export function clearGoogleTranslateCookie() {
  const hostname = window.location.hostname;
  const expired = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  document.cookie = expired;
  document.cookie = `${expired}; domain=${hostname}`;

  if (hostname.includes(".")) {
    document.cookie = `${expired}; domain=.${hostname}`;
  }
}

export function findTranslateSelect() {
  return document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
}

export async function waitForTranslateSelect(retries = 24, delay = 50) {
  for (let attempt = 0; attempt < retries; attempt += 1) {
    const select = findTranslateSelect();
    if (select) return select;
    await new Promise((resolve) => window.setTimeout(resolve, delay));
  }

  return null;
}

export function getLanguageOption(code: LanguageCode) {
  return (
    LANGUAGE_OPTIONS.find((option) => option.code === code) ?? LANGUAGE_OPTIONS[0]
  );
}

export function isTranslationApplied(code: LanguageCode) {
  const isRtl = document.documentElement.classList.contains("translated-rtl");
  if (code === "ar") return isRtl;
  return !isRtl;
}

export function waitForTranslationComplete(
  code: LanguageCode,
  timeout = 10000
): Promise<void> {
  return new Promise((resolve) => {
    if (isTranslationApplied(code)) {
      resolve();
      return;
    }

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      resolve();
    };

    const observer = new MutationObserver(() => {
      if (isTranslationApplied(code)) finish();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "lang"],
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    const timer = window.setTimeout(finish, timeout);
  });
}

let initPromise: Promise<void> | null = null;

export function initGoogleTranslate(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (initPromise) return initPromise;

  initPromise = new Promise((resolve) => {
    const markReady = () => resolve();

    window.googleTranslateElementInit = () => {
      const container = document.getElementById(GOOGLE_TRANSLATE_CONTAINER_ID);
      if (
        container &&
        window.google?.translate?.TranslateElement &&
        container.childNodes.length === 0
      ) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,ar",
            autoDisplay: false,
            layout: 0,
          },
          GOOGLE_TRANSLATE_CONTAINER_ID
        );
      }
      markReady();
    };

    if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
      return;
    }

    if (document.getElementById(GOOGLE_TRANSLATE_SCRIPT_ID)) {
      void waitForTranslateSelect().then(markReady);
      return;
    }

    const script = document.createElement("script");
    script.id = GOOGLE_TRANSLATE_SCRIPT_ID;
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  });

  return initPromise;
}

export async function applyLanguageTranslation(
  code: LanguageCode
): Promise<{ needsReload: boolean }> {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
  const option = getLanguageOption(code);
  const select = await waitForTranslateSelect();

  if (code === "en") {
    clearGoogleTranslateCookie();
    setGoogleTranslateCookie("en");

    if (select) {
      select.value = "en";
      select.dispatchEvent(new Event("change", { bubbles: true }));
      await waitForTranslationComplete("en", 2500);
      if (isTranslationApplied("en")) {
        return { needsReload: false };
      }
    }

    return { needsReload: true };
  }

  if (!select) {
    setGoogleTranslateCookie(option.googleCode);
    return { needsReload: true };
  }

  setGoogleTranslateCookie(option.googleCode);
  if (select.value !== option.googleCode) {
    select.value = option.googleCode;
    select.dispatchEvent(new Event("change", { bubbles: true }));
  }

  return { needsReload: false };
}
