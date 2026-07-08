"use client";

import Link from "next/link";
import { ArrowRight, Calendar, Compass, Heart, MapPin } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Progress,
  Spinner,
  StatusBadge,
} from "@/components/ui";
import { useMyBookings } from "@/lib/hooks/use-travel-data";

export default function AccountOverviewPage() {
  const { data: bookings, isLoading } = useMyBookings();
  const upcoming = bookings?.find((b) => ["confirmed", "pending"].includes(b.status));

  const quickLinks = [
    { label: "Browse tours", href: "/#tours", icon: Compass },
    { label: "My wishlist", href: "/account/wishlist", icon: Heart },
    { label: "Plan a trip", href: "/account/trips", icon: MapPin },
    { label: "My bookings", href: "/account/bookings", icon: Calendar },
  ];

  if (isLoading) return <Spinner label="Loading your account…" />;

  return (
    <>
      <PageHeader
        title="Welcome back"
        description="Your upcoming trip, recent activity, and quick actions."
        actions={
          <Button href="/#tours" size="sm">
            Explore tours <ArrowRight className="size-4" />
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card variant="gradient" className="lg:col-span-3">
          <CardHeader
            actions={
              upcoming ? (
                <StatusBadge status={upcoming.status as "confirmed" | "pending"} />
              ) : null
            }
          >
            <CardTitle>Next departure</CardTitle>
            <CardDescription>
              {upcoming ? upcoming.reference : "No upcoming trips"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {upcoming ? (
              <>
                <div>
                  <p className="font-heading text-2xl font-bold text-text-primary">
                    {upcoming.tourTitle}
                  </p>
                  <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
                    <Calendar className="size-4 text-primary" />
                    {upcoming.departureDate}
                    <Badge variant="accent">{upcoming.travelerCount} travelers</Badge>
                  </p>
                </div>
                <Progress value={68} label="Trip prep checklist" showValue tone="primary" />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" href={`/account/bookings/${upcoming.reference}`}>
                    View booking
                  </Button>
                  <Button size="sm" variant="secondary">
                    Download voucher
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-text-secondary">
                Browse tours and book your next Ethiopia adventure.
              </p>
            )}
          </CardContent>
        </Card>

        <Card static className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 pt-0">
            {quickLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-white/50 px-4 py-3 text-sm font-medium text-text-primary transition-all hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              >
                <span className="flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
                  <Icon className="size-4" />
                </span>
                {label}
                <ArrowRight className="ms-auto size-4 text-text-secondary/50" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card static>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary/80">
              Active bookings
            </p>
            <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-text-primary">
              {bookings?.filter((b) => ["confirmed", "pending"].includes(b.status)).length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card static>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary/80">
              Completed trips
            </p>
            <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-text-primary">
              {bookings?.filter((b) => b.status === "completed").length ?? 0}
            </p>
          </CardContent>
        </Card>
        <Card static>
          <CardContent>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary/80">
              Loyalty points
            </p>
            <p className="mt-1 font-heading text-2xl font-bold tabular-nums text-text-primary">
              840
            </p>
            <p className="text-xs text-text-secondary">Redeem at checkout</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
