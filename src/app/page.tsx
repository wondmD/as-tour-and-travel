import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { WhyTravelWithUs } from "@/components/landing/WhyTravelWithUs";
import { ToursSection } from "@/components/landing/ToursSection";
import { FeaturedDestinations } from "@/components/landing/FeaturedDestinations";
import { Testimonials } from "@/components/landing/Testimonials";
import { TravelGallery } from "@/components/landing/TravelGallery";
import { AboutEthiopia } from "@/components/landing/AboutEthiopia";
import { Newsletter } from "@/components/landing/Newsletter";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Discover Ethiopia",
  description:
    "Book guided Ethiopia tours with AS Tour & Travel — leisure journeys through Addis Ababa, crater lakes, highlands, and Arba Minch. Expert guides, curated itineraries, and unforgettable experiences.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyTravelWithUs />
        <ToursSection />
        <FeaturedDestinations />
        <Testimonials />
        <TravelGallery />
        <AboutEthiopia />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
