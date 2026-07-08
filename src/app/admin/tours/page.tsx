"use client";

import { useRouter } from "next/navigation";
import { type ColumnDef } from "@tanstack/react-table";
import { TrendingDown, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  Badge,
  Button,
  DataTable,
  Progress,
  toast,
} from "@/components/ui";
import {
  useAllTourFinances,
  useTours,
  useUpdateTourStatus,
} from "@/lib/hooks/use-travel-data";
import { formatUsd } from "@/lib/tour-finance";
import type { TourFinancialSummary, TourProduct } from "@/lib/types";
import { useRequireRole } from "@/components/auth/AuthGuard";
import { cn } from "@/lib/cn";

type TourRow = TourProduct & { finance?: TourFinancialSummary };

export default function AdminToursPage() {
  const router = useRouter();
  const { data: tours, isLoading } = useTours();
  const { data: finances } = useAllTourFinances();
  const updateStatus = useUpdateTourStatus();
  const canEdit = useRequireRole(["admin", "staff", "content_manager"]);

  const financeMap = new Map(finances?.map((f) => [f.tourId, f]));
  const rows: TourRow[] = (tours ?? []).map((t) => ({
    ...t,
    finance: financeMap.get(t.id),
  }));

  const columns: ColumnDef<TourRow, unknown>[] = [
    {
      accessorKey: "title",
      header: "Tour",
      cell: ({ row }) => (
        <span className="font-medium text-text-primary">{row.original.title}</span>
      ),
    },
    { accessorKey: "destination", header: "Destination" },
    {
      accessorKey: "basePriceUsd",
      header: "From",
      cell: ({ row }) => formatUsd(row.original.basePriceUsd),
    },
    {
      id: "income",
      header: "Income",
      cell: ({ row }) => {
        const f = row.original.finance;
        if (!f) return "—";
        return (
          <span className="font-semibold tabular-nums text-success">
            {formatUsd(f.realizedIncomeUsd)}
          </span>
        );
      },
    },
    {
      id: "expenses",
      header: "Expenses",
      cell: ({ row }) => {
        const f = row.original.finance;
        if (!f) return "—";
        return (
          <span className="font-semibold tabular-nums text-text-primary">
            {formatUsd(f.totalExpensesUsd)}
          </span>
        );
      },
    },
    {
      id: "profit",
      header: "P / L",
      cell: ({ row }) => {
        const f = row.original.finance;
        if (!f) return "—";
        return (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-bold tabular-nums",
              f.isProfit ? "text-success" : "text-danger",
            )}
          >
            {f.isProfit ? (
              <TrendingUp className="size-3.5" />
            ) : (
              <TrendingDown className="size-3.5" />
            )}
            {f.isProfit ? "+" : ""}
            {formatUsd(f.profitLossUsd)}
          </span>
        );
      },
    },
    {
      id: "budget",
      header: "Budget",
      cell: ({ row }) => {
        const f = row.original.finance;
        if (!f || f.budgetUsd === 0) return "—";
        const pct = Math.round((f.totalExpensesUsd / f.budgetUsd) * 100);
        return (
          <div className="min-w-24">
            <Progress
              value={f.totalExpensesUsd}
              max={f.budgetUsd}
              tone={f.isOverBudget ? "danger" : pct >= 85 ? "warning" : "primary"}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={row.original.status === "published" ? "success" : "neutral"}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        canEdit ? (
          <button
            type="button"
            className="rounded-lg bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/14"
            onClick={(e) => {
              e.stopPropagation();
              const next =
                row.original.status === "published" ? "draft" : "published";
              updateStatus.mutate({ id: row.original.id, status: next });
              toast.success(`Tour ${next}`);
            }}
          >
            {row.original.status === "published" ? "Unpublish" : "Publish"}
          </button>
        ) : null,
    },
  ];

  const totalProfit =
    finances?.reduce((s, f) => s + f.profitLossUsd, 0) ?? 0;
  const profitableCount = finances?.filter((f) => f.isProfit).length ?? 0;

  return (
    <>
      <PageHeader
        title="Tour management"
        description="Track income, expenses, budgets, and profit/loss for every tour package."
        actions={
          canEdit && (
            <Button size="sm" onClick={() => toast.info("Tour builder — mock")}>
              New tour
            </Button>
          )
        }
      />

      {finances && (
        <div className="mb-4 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-primary/8 px-3 py-1 font-medium text-primary">
            Portfolio P/L:{" "}
            <strong className={totalProfit >= 0 ? "text-success" : "text-danger"}>
              {totalProfit >= 0 ? "+" : ""}
              {formatUsd(totalProfit)}
            </strong>
          </span>
          <span className="rounded-full bg-text-secondary/8 px-3 py-1 text-text-secondary">
            {profitableCount} of {finances.length} tours profitable
          </span>
        </div>
      )}

      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        onRowClick={(row) => router.push(`/admin/tours/${row.id}`)}
      />
    </>
  );
}
