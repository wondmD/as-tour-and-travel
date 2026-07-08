import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button, Card, CardContent } from "@/components/ui";
import { Globe2, Map, Plane } from "lucide-react";

export const metadata = {
  title: "Plan your travel",
  description:
    "Design international and domestic journeys to, from, and within Ethiopia with AS Tour assistance.",
};

export default function TravelLandingPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[var(--page-bg)] pb-16 pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <span className="pill-badge">Travel booking</span>
          <h1 className="mt-4 font-heading text-3xl font-bold text-text-primary sm:text-4xl">
            Travel to, from, and across Ethiopia
          </h1>
          <p className="mt-3 max-w-2xl text-lg text-text-secondary">
            Not a tour package — a lighter travel designer for international legs and
            domestic city hops. We help you move effortlessly while you focus on why
            you&apos;re traveling.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/travel/design">
              <Button size="lg">Design your journey</Button>
            </Link>
            <Link href="/account/travel">
              <Button size="lg" variant="secondary">
                My travel plans
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Plane,
                title: "International",
                text: "From your country to Ethiopia, Ethiopia abroad, or round trips with coordinated connections.",
              },
              {
                icon: Map,
                title: "Domestic",
                text: "Book travel within Ethiopia — Addis to Lalibela, Bahir Dar, and more without tour detail.",
              },
              {
                icon: Globe2,
                title: "Multi-country",
                text: "Complex routes across borders — our team handles logistics, not day-by-day sightseeing.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <Card key={title} static variant="solid">
                <CardContent className="pt-6">
                  <Icon className="size-8 text-primary" strokeWidth={1.5} />
                  <h2 className="mt-3 font-heading font-bold text-text-primary">{title}</h2>
                  <p className="mt-1 text-sm text-text-secondary">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <p className="mt-10 text-sm text-text-secondary">
            Looking for a full tour with day-by-day destinations and activities?{" "}
            <Link href="/tours/tour-001" className="font-semibold text-primary hover:underline">
              Browse tour packages
            </Link>{" "}
            or{" "}
            <Link href="/tours/request" className="font-semibold text-primary hover:underline">
              request a custom tour
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
