"use client";

import { type ReactNode } from "react";
import { BookTourProvider } from "@/components/booking/BookTourProvider";
import { TranslationProvider } from "@/components/i18n/TranslationProvider";
import { Toaster } from "@/components/ui/Toaster";
import { QueryProvider } from "./QueryProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <TranslationProvider>
        <BookTourProvider>
          {children}
          <Toaster />
        </BookTourProvider>
      </TranslationProvider>
    </QueryProvider>
  );
}
