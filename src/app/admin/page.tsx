"use client";

import { useRouter } from "next/navigation";
import {
  CalendarCheck,
  Download,
  Plus,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Progress,
  Select,
  Skeleton,
  StatCard,
  StatusBadge,
  toast,
  type StatusKind,
} from "@/components/ui";
import { useAdminStats, useAllBookings } from "@/lib/hooks/use-travel-data";
import { ALL_TRAVELERS } from "@/lib/mock/seed";
import type { Booking } from "@/lib/types";

const chartAxisStyle = { fontSize: 11, fill: "#4a5c66" };

const bookingColumns: ColumnDef<Booking, unknown>[] = [
  {
    accessorKey: "reference",
    header: "Reference",
    cell: ({ row }) => (
      <span className="font-semibold text-primary">{row.original.reference}</span>
    ),
  },
  {
    accessorKey: "userId",
    header: "Customer",
    cell: ({ row }) => {
      const customer = ALL_TRAVELERS.find((u) => u.id === row.original.userId);
      return (
        <span className="flex items-center gap-2.5">
          <Avatar name={customer?.fullName ?? "?"} size="xs" />
          <span className="font-medium">{customer?.fullName ?? "—"}</span>
        </span>
      );
    },
  },
  { accessorKey: "tourTitle", header: "Tour" },
  { accessorKey: "departureDate", header: "Departure" },
  {
    accessorKey: "travelerCount",
    header: "Travelers",
    cell: ({ row }) => (
      <span className="tabular-nums">{row.original.travelerCount}</span>
    ),
  },
  {
    accessorKey: "amountUsd",
    header: "Amount",
    cell: ({ row }) => (
      <span className="font-semibold tabular-nums">
        ${row.original.amountUsd.toLocaleString()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status as StatusKind} />
    ),
  },
];

export default function AdminOverviewPage() {
  const router = useRouter();
  const [range, setRange] = useState("30d");
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: bookings, isLoading: bookingsLoading } = useAllBookings();

  const recentBookings = [...(bookings ?? [])]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 7);

  return (
    <>
      <PageHeader
        title="Overview"
        description="Bookings, revenue, and activity across all tours — powered by mock data."
        actions={
          <>
            <Select
              value={range}
              onValueChange={setRange}
              className="min-h-9 w-40 rounded-xl py-1.5"
              options={[
                { value: "7d", label: "Last 7 days" },
                { value: "30d", label: "Last 30 days" },
                { value: "90d", label: "Last quarter" },
                { value: "12m", label: "Last 12 months" },
              ]}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push("/admin/reports")}
            >
              <Download className="size-4" /> Export
            </Button>
            <Button size="sm" onClick={() => router.push("/admin/tours")}>
              <Plus className="size-4" /> New tour
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))
        ) : (
          <>
            <StatCard
              label="Revenue"
              value={`$${stats?.totalRevenue.toLocaleString() ?? 0}`}
              icon={Wallet}
              tone="primary"
              delta={16.4}
              trend={[8, 11, 9, 14, 12, 19, 22, 27, stats?.totalRevenue ?? 0]}
            />
            <StatCard
              label="Bookings"
              value={String(stats?.bookingCount ?? 0)}
              icon={CalendarCheck}
              tone="accent"
              delta={9.8}
              trend={stats?.revenueByMonth.map((m) => m.bookings) ?? []}
            />
            <StatCard
              label="Active travelers"
              value={String(stats?.activeTravelers ?? 0)}
              icon={Users}
              tone="info"
              delta={21.2}
            />
            <StatCard
              label="Pending reviews"
              value={String(stats?.pendingReviews ?? 0)}
              icon={TrendingUp}
              tone="success"
            />
          </>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <Card static className="xl:col-span-3">
          <CardHeader actions={<Badge variant="primary" dot>Mock data</Badge>}>
            <CardTitle>Revenue trend</CardTitle>
            <CardDescription>Gross booking value per month (USD)</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats?.revenueByMonth ?? []}
                margin={{ top: 8, right: 8, bottom: 0, left: -12 }}
              >
                <defs>
                  <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#307082" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#307082" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,112,130,0.1)" vertical={false} />
                <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                <YAxis
                  tick={chartAxisStyle}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `$${v / 1000}k`}
                />
                <ChartTooltip
                  cursor={{ stroke: "rgba(48,112,130,0.25)" }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(212,203,190,0.8)",
                    background: "rgba(255,255,255,0.95)",
                    fontSize: 12,
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#307082"
                  strokeWidth={2.5}
                  fill="url(#revenue-fill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card static className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Bookings by destination</CardTitle>
            <CardDescription>All non-cancelled reservations</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats?.bookingsByDestination ?? []}
                layout="vertical"
                margin={{ top: 0, right: 12, bottom: 0, left: 8 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,112,130,0.1)" horizontal={false} />
                <XAxis type="number" tick={chartAxisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="destination"
                  tick={chartAxisStyle}
                  axisLine={false}
                  tickLine={false}
                  width={72}
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(48,112,130,0.06)" }}
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(212,203,190,0.8)",
                    background: "rgba(255,255,255,0.95)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="bookings" fill="#6ca3a2" radius={[0, 8, 8, 0]} barSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <Card static>
            <CardHeader
              actions={
                <Button variant="ghost" size="sm" onClick={() => router.push("/admin/bookings")}>
                  View all
                </Button>
              }
            >
              <CardTitle>Recent bookings</CardTitle>
              <CardDescription>Latest reservations across all departures</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <DataTable
                columns={bookingColumns}
                data={recentBookings}
                loading={bookingsLoading}
                pageSize={5}
                onRowClick={(row) => router.push(`/admin/bookings/${row.reference}`)}
              />
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-2">
          <Card static>
            <CardHeader>
              <CardTitle>Departure capacity</CardTitle>
              <CardDescription>Seats sold per active tour</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {(stats?.topTours ?? []).map((tour) => {
                const percent =
                  tour.capacity > 0
                    ? Math.round((tour.sold / tour.capacity) * 100)
                    : 0;
                return (
                  <div key={tour.name}>
                    <div className="mb-1.5 flex items-baseline justify-between gap-3">
                      <p className="truncate text-sm font-medium text-text-primary">
                        {tour.name}
                      </p>
                      <p className="shrink-0 text-xs tabular-nums text-text-secondary">
                        {tour.sold}/{tour.capacity} seats
                      </p>
                    </div>
                    <Progress
                      value={tour.sold}
                      max={tour.capacity}
                      tone={percent >= 85 ? "warning" : "primary"}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
