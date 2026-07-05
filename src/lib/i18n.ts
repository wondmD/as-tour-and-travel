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
export const GOOGLE_TRANSLATE_CONTAINER_ID = "google_translate_element";
export const GOOGLE_TRANSLATE_SCRIPT_ID = "google-translate-script";
export const GOOGLE_TRANSLATE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

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

export async function waitForTranslateSelect(retries = 40, delay = 150) {
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
