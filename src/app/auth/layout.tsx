import type { Metadata } from "next";
import { type ReactNode } from "react";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Auth pages use AuthLayout internally — no shared chrome here. */
export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return children;
}
