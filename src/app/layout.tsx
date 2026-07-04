import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background font-sans text-text-primary">
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
