import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";
import { TourHero } from "@/components/tour/TourHero";
import { TourRouteExplorer } from "@/components/tour/TourRouteExplorer";
import { BookingCTA } from "@/components/tour/BookingCTA";
import { TourPageEnhancements } from "@/components/tour/TourPageEnhancements";
import { tour001 } from "@/data/tour-001";
import { createPageMetadata, createTourMetadata, tourJsonLd } from "@/lib/seo";

interface TourPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== tour001.slug) {
    return createPageMetadata({
      title: "Tour Not Found",
      description: "The requested tour could not be found.",
      path: `/tours/${slug}`,
      noIndex: true,
    });
  }

  return createTourMetadata(tour001);
}

export default async function TourPage({ params }: TourPageProps) {
  const { slug } = await params;

  if (slug !== tour001.slug) {
    notFound();
  }

  return (
    <>
      <JsonLd data={tourJsonLd(tour001)} />
      <Navbar />
      <main className="tour-page-main">
        <TourHero tour={tour001} />
        <TourRouteExplorer destinations={tour001.destinations} />
        <BookingCTA tour={tour001} />
        <TourPageEnhancements tour={tour001} />
      </main>
      <Footer />
    </>
  );
}
