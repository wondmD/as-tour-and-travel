import type { Metadata } from "next";
import { AppProviders } from "@/components/providers/AppProviders";
import { JsonLd } from "@/components/seo/JsonLd";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import {
  brandAssets,
  organizationJsonLd,
  siteConfig,
  websiteJsonLd,
} from "@/lib/seo";
import "./fonts.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.defaultOgImage,
        width: siteConfig.defaultOgImageWidth,
        height: siteConfig.defaultOgImageHeight,
        alt: `${siteConfig.name} — guided tours across Ethiopia`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: brandAssets.logo,
    apple: brandAssets.logo,
  },
  alternates: {
    canonical: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth antialiased" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://translate.google.com" />
        <link rel="preconnect" href="https://translate.googleapis.com" />
      </head>
      <body className="min-h-full flex flex-col bg-background font-sans text-text-primary">
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <AppProviders>
          <ScrollProgress />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
