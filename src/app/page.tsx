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
