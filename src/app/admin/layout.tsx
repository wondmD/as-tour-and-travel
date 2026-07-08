import type { Metadata } from "next";
import { StaffPortalLayout } from "@/components/admin/StaffPortalLayout";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StaffPortalLayout>{children}</StaffPortalLayout>;
}
