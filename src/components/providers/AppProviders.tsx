"use client";

import { type ReactNode } from "react";
import { BookTourProvider } from "@/components/booking/BookTourProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return <BookTourProvider>{children}</BookTourProvider>;
}
