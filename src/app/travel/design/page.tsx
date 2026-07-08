import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { TravelDesigner } from "@/components/travel/TravelDesigner";

export const metadata = {
  title: "Design your travel",
  description: "Plan international or domestic travel with AS Tour & Travel.",
};

export default function TravelDesignPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--page-bg)] pb-16 pt-24">
        <div className="px-4 sm:px-6">
          <TravelDesigner />
        </div>
      </main>
      <Footer />
    </>
  );
}
