"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { TourBudgetEditor } from "@/components/admin/tour/TourBudgetEditor";
import { TourExpenseDialog } from "@/components/admin/tour/TourExpenseDialog";
import { TourProfitLossCard } from "@/components/admin/tour/TourProfitLossCard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  DataTable,
  Progress,
  Spinner,
  StatusBadge,
  Tabs,
  toast,
  type StatusKind,
} from "@/components/ui";
import {
  useRemoveTourExpense,
  useTour,
  useTourBudget,
  useTourExpenses,
  useTourFinance,
  useTourIncome,
  useUpdateTourStatus,
} from "@/lib/hooks/use-travel-data";
import {
  EXPENSE_CATEGORY_LABELS,
  formatUsd,
} from "@/lib/tour-finance";
import type { TourExpense, TourIncomeLine } from "@/lib/types";

const CHART_COLORS = [
  "#307082",
  "#6ca3a2",
  "#ea9940",
  "#4d7fa8",
  "#2f8f6b",
  "#a06e1f",
  "#d4736c",
  "#8b6faf",
  "#5c6bc0",
];

const chartAxisStyle = { fontSize: 11, fill: "#4a5c66" };

export default function AdminTourDetailPage() {
  const params = useParams();
  const router = useRouter();
  const tourId = params.id as string;

  const { data: tourData, isLoading: tourLoading } = useTour(tourId);
  const { data: finance, isLoading: financeLoading } = useTourFinance(tourId);
  const { data: income, isLoading: incomeLoading } = useTourIncome(tourId);
  const { data: expenses, isLoading: expensesLoading } = useTourExpenses(tourId);
  const { data: budget, isLoading: budgetLoading } = useTourBudget(tourId);
  const updateStatus = useUpdateTourStatus();
  const removeExpense = useRemoveTourExpense();
  const canEditFinance = useRequireRole(["admin", "staff"]);
  const canEditTour = useRequireRole(["admin", "staff", "content_manager"]);

  if (tourLoading || financeLoading) {
    return <Spinner label="Loading tour…" />;
  }

  if (!tourData?.tour || !finance) {
    return (
      <div className="space-y-4">
        <p className="text-text-secondary">Tour not found.</p>
        <Button variant="soft" size="sm" onClick={() => router.push("/admin/tours")}>
          Back to tours
        </Button>
      </div>
    );
  }

  const { tour, departures } = tourData;

  const expenseChart = Object.entries(finance.expensesByCategory)
    .filter(([, amount]) => amount > 0)
    .map(([category, amount]) => ({
      category: EXPENSE_CATEGORY_LABELS[category as keyof typeof EXPENSE_CATEGORY_LABELS],
      amount,
    }));

  const incomeColumns: ColumnDef<TourIncomeLine, unknown>[] = [
    {
      accessorKey: "bookingReference",
      header: "Booking",
      cell: ({ row }) => (
        <Link
          href={`/admin/bookings/${row.original.bookingReference}`}
          className="font-semibold text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          {row.original.bookingReference}
        </Link>
      ),
    },
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
      header: "Revenue",
      cell: ({ row }) => (
        <span className="font-semibold tabular-nums text-success">
          {formatUsd(row.original.amountUsd)}
        </span>
      ),
    },
    {
      accessorKey: "bookingStatus",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.bookingStatus as StatusKind} />
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => (
        <StatusBadge
          status={
            row.original.paymentStatus === "successful"
              ? "confirmed"
              : (row.original.paymentStatus as StatusKind)
          }
          label={row.original.paymentStatus}
        />
      ),
    },
  ];

  const expenseColumns: ColumnDef<TourExpense, unknown>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => new Date(row.original.date).toLocaleDateString(),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => EXPENSE_CATEGORY_LABELS[row.original.category],
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span className="font-medium text-text-primary">
          {row.original.description}
        </span>
      ),
    },
    {
      accessorKey: "vendor",
      header: "Vendor",
      cell: ({ row }) => row.original.vendor ?? "—",
    },
    {
      accessorKey: "amountUsd",
      header: "Amount",
      cell: ({ row }) => (
        <span className="font-semibold tabular-nums text-danger">
          −{formatUsd(row.original.amountUsd)}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "paid"
              ? "success"
              : row.original.status === "pending"
                ? "warning"
                : "neutral"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        canEditFinance ? (
          <button
            type="button"
            className="text-xs font-semibold text-danger hover:underline"
            onClick={(e) => {
              e.stopPropagation();
              removeExpense.mutate({ id: row.original.id, tourId });
              toast.info("Expense removed");
            }}
          >
            Remove
          </button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title={tour.title}
        description={`${tour.destination} · ${tour.durationDays} days · from ${formatUsd(tour.basePriceUsd)}/person`}
        toolbar={
          <Badge variant={tour.status === "published" ? "success" : "neutral"}>
            {tour.status}
          </Badge>
        }
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/admin/tours")}
            >
              <ArrowLeft className="size-4" /> All tours
            </Button>
            {canEditTour && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => {
                  const next =
                    tour.status === "published" ? "draft" : "published";
                  updateStatus.mutate({ id: tour.id, status: next });
                  toast.success(`Tour ${next}`);
                }}
              >
                {tour.status === "published" ? "Unpublish" : "Publish"}
              </Button>
            )}
          </>
        }
      />

      <TourProfitLossCard
        finance={finance}
        tourTitle={tour.title}
        periodLabel={budget?.periodLabel}
      />

      <div className="mt-6">
        <Tabs
          appearance="underline"
          items={[
            {
              value: "income",
              label: `Income (${income?.length ?? 0})`,
              content: (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-text-secondary">
                      Revenue from bookings — realized income counts toward P&amp;L.
                    </p>
                    <p className="text-sm font-semibold tabular-nums text-success">
                      {formatUsd(finance.realizedIncomeUsd)} realized
                    </p>
                  </div>
                  <DataTable
                    columns={incomeColumns}
                    data={income ?? []}
                    loading={incomeLoading}
                  />
                </div>
              ),
            },
            {
              value: "expenses",
              label: `Expenses (${expenses?.length ?? 0})`,
              content: (
                <div className="space-y-4 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-text-secondary">
                      Operational costs — accommodation, transport, guides, permits, and more.
                    </p>
                    {canEditFinance && (
                      <TourExpenseDialog tourId={tourId} />
                    )}
                  </div>

                  {expenseChart.length > 0 && (
                    <Card static>
                      <CardHeader>
                        <CardTitle className="text-base">By category</CardTitle>
                      </CardHeader>
                      <CardContent className="h-56">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={expenseChart} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(48,112,130,0.1)" />
                            <XAxis type="number" tick={chartAxisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                            <YAxis type="category" dataKey="category" tick={chartAxisStyle} axisLine={false} tickLine={false} width={110} />
                            <ChartTooltip formatter={(v) => [formatUsd(Number(v)), "Spent"]} />
                            <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={16}>
                              {expenseChart.map((_, i) => (
                                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}

                  <DataTable
                    columns={expenseColumns}
                    data={expenses ?? []}
                    loading={expensesLoading}
                  />
                </div>
              ),
            },
            {
              value: "budget",
              label: "Budget",
              content: (
                <div className="space-y-4 pt-4">
                  {budgetLoading ? (
                    <Spinner label="Loading budget…" />
                  ) : budget ? (
                    <TourBudgetEditor budget={budget} canEdit={canEditFinance} />
                  ) : (
                    <p className="text-sm text-text-secondary">No budget set.</p>
                  )}
                </div>
              ),
            },
            {
              value: "departures",
              label: `Departures (${departures.length})`,
              content: (
                <div className="grid gap-3 pt-4 md:grid-cols-2">
                  {departures.map((dep) => {
                    const pct = Math.round((dep.seatsSold / dep.capacity) * 100);
                    const projectedRevenue = dep.seatsSold * dep.priceUsd;
                    return (
                      <Card key={dep.id} static>
                        <CardHeader
                          actions={
                            <Badge variant="primary">
                              {formatUsd(dep.priceUsd)}/seat
                            </Badge>
                          }
                        >
                          <CardTitle className="text-base">
                            {new Date(dep.date).toLocaleDateString("en", {
                              weekday: "short",
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </CardTitle>
                          <CardDescription>
                            Projected seat revenue: {formatUsd(projectedRevenue)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Progress
                            value={dep.seatsSold}
                            max={dep.capacity}
                            tone={pct >= 85 ? "warning" : "primary"}
                            label={`${dep.seatsSold}/${dep.capacity} seats sold`}
                            showValue
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                  {departures.length === 0 && (
                    <p className="text-sm text-text-secondary">No departures scheduled.</p>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </>
  );
}
