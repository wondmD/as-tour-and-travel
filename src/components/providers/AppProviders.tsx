"use client";

import { type ReactNode } from "react";
import { BookTourProvider } from "@/components/booking/BookTourProvider";
import { TranslationProvider } from "@/components/i18n/TranslationProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <TranslationProvider>
      <BookTourProvider>{children}</BookTourProvider>
    </TranslationProvider>
  );
}
