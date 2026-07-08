"use client";

import { Download } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/dashboard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatCard,
  toast,
} from "@/components/ui";
import { useAdminStats, usePayments } from "@/lib/hooks/use-travel-data";
import { CalendarCheck, Star, Wallet } from "lucide-react";

const chartAxisStyle = { fontSize: 11, fill: "#4a5c66" };

export default function AdminReportsPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: payments } = usePayments();

  const paymentMethods = payments?.reduce(
    (acc, p) => {
      acc[p.method] = (acc[p.method] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const methodChart = paymentMethods
    ? Object.entries(paymentMethods).map(([method, count]) => ({
        method: method.replace("_", " "),
        count,
      }))
    : [];

  return (
    <>
      <PageHeader
        title="Reports"
        description="Revenue, bookings, and operational analytics from mock data."
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toast.info("CSV export — mock")}
          >
            <Download className="size-4" /> Export all
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total revenue"
          value={statsLoading ? "…" : `$${stats?.totalRevenue.toLocaleString() ?? 0}`}
          icon={Wallet}
          tone="primary"
        />
        <StatCard
          label="Bookings"
          value={statsLoading ? "…" : String(stats?.bookingCount ?? 0)}
          icon={CalendarCheck}
          tone="accent"
        />
        <StatCard
          label="Pending reviews"
          value={statsLoading ? "…" : String(stats?.pendingReviews ?? 0)}
          icon={Star}
          tone="info"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card static>
          <CardHeader actions={<Badge variant="primary" dot>Mock</Badge>}>
            <CardTitle>Monthly bookings</CardTitle>
            <CardDescription>Reservation count by month</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.revenueByMonth ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,112,130,0.1)" />
                <XAxis dataKey="month" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <ChartTooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(212,203,190,0.8)",
                    fontSize: 12,
                  }}
                />
                <Line type="monotone" dataKey="bookings" stroke="#6ca3a2" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card static>
          <CardHeader>
            <CardTitle>Payments by method</CardTitle>
            <CardDescription>Successful and pending transactions</CardDescription>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={methodChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(48,112,130,0.1)" vertical={false} />
                <XAxis dataKey="method" tick={chartAxisStyle} axisLine={false} tickLine={false} />
                <YAxis tick={chartAxisStyle} axisLine={false} tickLine={false} allowDecimals={false} />
                <ChartTooltip
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid rgba(212,203,190,0.8)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="#307082" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
