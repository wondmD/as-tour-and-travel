import type { Metadata } from "next";
import type { Tour } from "@/data/tour-001";
import { AS_TOUR, ORGANIZER_CONTACT, SISTER_COMPANY, TOUR_001_SLUG } from "@/lib/constants";

export const brandAssets = {
  logo: "/logo.png",
  ogImage: "/og-image.png",
  ogImageWidth: 554,
  ogImageHeight: 190,
} as const;

export const siteConfig = {
  name: "AS Tour & Travel",
  tagline: "Discover Ethiopia",
  description:
    "Experience Ethiopia's breathtaking landscapes, ancient history, and vibrant cultures through professionally guided tours for international travelers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://astourtravel.com",
  locale: "en_US",
  defaultOgImage: brandAssets.ogImage,
  defaultOgImageWidth: brandAssets.ogImageWidth,
  defaultOgImageHeight: brandAssets.ogImageHeight,
  keywords: [
    "Ethiopia tours",
    "Ethiopia travel",
    "Addis Ababa tours",
    "Arba Minch tour",
    "Ethiopia leisure tour",
    "guided tours Ethiopia",
    "AS Tour and Travel",
    "Ethiopia vacation",
    "Lake Chamo safari",
    "Wonchi crater lake",
    "Ethiopia group travel",
  ],
} as const;

export function absoluteUrl(path = ""): string {
  const base = siteConfig.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

const sharedOpenGraph = {
  type: "website" as const,
  locale: siteConfig.locale,
  siteName: siteConfig.name,
};

const sharedTwitter = {
  card: "summary_large_image" as const,
};

export function createPageMetadata({
  title,
  description,
  path = "",
  ogImage = siteConfig.defaultOgImage,
  ogImageAlt,
  ogImageWidth,
  ogImageHeight,
  keywords,
  noIndex = false,
}: {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  keywords?: string[];
  noIndex?: boolean;
}): Metadata {
  const url = absoluteUrl(path);
  const imageAlt = ogImageAlt ?? `${title} — ${siteConfig.name}`;
  const imageWidth =
    ogImageWidth ??
    (ogImage === siteConfig.defaultOgImage ? siteConfig.defaultOgImageWidth : undefined);
  const imageHeight =
    ogImageHeight ??
    (ogImage === siteConfig.defaultOgImage ? siteConfig.defaultOgImageHeight : undefined);

  return {
    title,
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      ...sharedOpenGraph,
      title,
      description,
      url,
      images: [
        {
          url: ogImage,
          alt: imageAlt,
          ...(imageWidth && imageHeight
            ? { width: imageWidth, height: imageHeight }
            : {}),
        },
      ],
    },
    twitter: {
      ...sharedTwitter,
      title,
      description,
      images: [ogImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
  };
}

export function createTourMetadata(tour: Tour): Metadata {
  return createPageMetadata({
    title: tour.title,
    description: tour.summary,
    path: `/tours/${tour.slug}`,
    ogImage: tour.coverImage,
    ogImageAlt: `${tour.title} — ${tour.duration}, departs ${tour.departureDate}`,
    keywords: [
      ...siteConfig.keywords,
      tour.title,
      "10 day Ethiopia tour",
      "Addis Ababa to Arba Minch",
      tour.departureDate,
    ],
  });
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl(brandAssets.logo),
    description: siteConfig.description,
    email: ORGANIZER_CONTACT.email,
    telephone: ORGANIZER_CONTACT.phone,
    areaServed: {
      "@type": "Country",
      name: "Ethiopia",
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(brandAssets.logo),
      },
    },
  };
}

export function tourJsonLd(tour: Tour) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.summary,
    url: absoluteUrl(`/tours/${tour.slug}`),
    image: absoluteUrl(tour.coverImage),
    touristType: "International travelers",
    itinerary: {
      "@type": "ItemList",
      numberOfItems: tour.destinations.length,
      itemListElement: tour.destinations.map((dest, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: `Day ${dest.day}: ${dest.name}`,
        item: {
          "@type": "TouristDestination",
          name: dest.name,
          description: dest.introduction,
          address: dest.address,
          geo: {
            "@type": "GeoCoordinates",
            latitude: dest.coordinates.lat,
            longitude: dest.coordinates.lng,
          },
        },
      })),
    },
    provider: tour.jointlyOrganized
      ? [
          {
            "@type": "TravelAgency",
            name: AS_TOUR.name,
            url: siteConfig.url,
            telephone: ORGANIZER_CONTACT.phone,
            email: ORGANIZER_CONTACT.email,
            logo: absoluteUrl(brandAssets.logo),
          },
          {
            "@type": "Organization",
            name: SISTER_COMPANY.nameEn,
            alternateName: SISTER_COMPANY.nameAr,
            description: SISTER_COMPANY.officeEn,
            logo: absoluteUrl(SISTER_COMPANY.logo),
            parentOrganization: {
              "@type": "TravelAgency",
              name: AS_TOUR.name,
            },
          },
        ]
      : {
          "@type": "TravelAgency",
          name: siteConfig.name,
          url: siteConfig.url,
          telephone: ORGANIZER_CONTACT.phone,
          email: ORGANIZER_CONTACT.email,
        },
  };
}

export const sitemapRoutes = [
  { path: "", changeFrequency: "weekly" as const, priority: 1 },
  {
    path: `/tours/${TOUR_001_SLUG}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  },
];
