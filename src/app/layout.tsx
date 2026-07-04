import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "AS Tour & Travel | Discover Ethiopia",
  description:
    "Experience Ethiopia's breathtaking landscapes, ancient history, and vibrant cultures through professionally guided tours for international travelers.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased">
      <body className="min-h-full flex flex-col bg-background font-sans text-text-primary">
        <AppProviders>
          <ScrollProgress />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
