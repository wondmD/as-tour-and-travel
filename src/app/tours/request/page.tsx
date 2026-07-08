import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CustomTourRequestForm } from "@/components/tour/CustomTourRequestForm";

export const metadata = {
  title: "Request a custom tour",
  description: "Design your own Ethiopia itinerary with help from AS Tour & Travel.",
};

export default function CustomTourRequestPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--page-bg)] pb-16 pt-24">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <h1 className="font-heading text-3xl font-bold text-text-primary">
            Request a custom tour
          </h1>
          <p className="mt-2 text-text-secondary">
            Select destinations, dates, and group size. Our team will confirm, customize a
            proposal, or suggest alternatives — usually within 2 business days.
          </p>
          <div className="mt-8">
            <CustomTourRequestForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
