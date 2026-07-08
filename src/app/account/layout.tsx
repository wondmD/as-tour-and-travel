import type { Metadata } from "next";
import { TravelerPortalLayout } from "@/components/portal/TravelerPortalLayout";

export const metadata: Metadata = {
  title: "My Account",
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TravelerPortalLayout>{children}</TravelerPortalLayout>;
}
