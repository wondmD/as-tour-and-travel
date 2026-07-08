"use client";

import {
  ArrowDownRight,
  ArrowUpRight,
  PiggyBank,
  Receipt,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Badge, Card, CardContent, CardHeader, CardTitle, Progress } from "@/components/ui";
import { formatUsd } from "@/lib/tour-finance";
import type { TourFinancialSummary } from "@/lib/types";
import { cn } from "@/lib/cn";

interface TourProfitLossCardProps {
  finance: TourFinancialSummary;
  tourTitle: string;
  periodLabel?: string;
}

export function TourProfitLossCard({
  finance,
  tourTitle,
  periodLabel,
}: TourProfitLossCardProps) {
  const budgetUsedPercent =
    finance.budgetUsd > 0
      ? Math.round((finance.totalExpensesUsd / finance.budgetUsd) * 100)
      : 0;

  return (
    <div className="space-y-4">
      <Card
        static
        className={cn(
          "overflow-hidden border-2",
          finance.isProfit
            ? "border-success/25 bg-gradient-to-br from-[var(--success-soft)]/40 to-transparent"
            : "border-danger/25 bg-gradient-to-br from-[var(--danger-soft)]/40 to-transparent",
        )}
      >
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Profit / loss analysis
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                {tourTitle}
                {periodLabel ? ` · ${periodLabel}` : ""}
              </p>
              <p
                className={cn(
                  "mt-3 font-heading text-4xl font-bold tabular-nums sm:text-5xl",
                  finance.isProfit ? "text-success" : "text-danger",
                )}
              >
                {finance.isProfit ? "+" : ""}
                {formatUsd(finance.profitLossUsd)}
              </p>
              <p className="mt-2 flex items-center gap-2 text-sm text-text-secondary">
                {finance.isProfit ? (
                  <TrendingUp className="size-4 text-success" />
                ) : (
                  <TrendingDown className="size-4 text-danger" />
                )}
                {finance.profitMarginPercent}% margin on realized income
              </p>
            </div>
            <Badge
              variant={finance.isProfit ? "success" : "danger"}
              className="text-sm px-3 py-1"
            >
              {finance.isProfit ? "Profitable" : "Loss"}
            </Badge>
          </div>

          <div className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
            <div className="rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-text-secondary">
                <ArrowUpRight className="size-3.5 text-success" />
                Realized income
              </p>
              <p className="mt-1 font-semibold tabular-nums text-text-primary">
                {formatUsd(finance.realizedIncomeUsd)}
              </p>
              {finance.projectedIncomeUsd > 0 && (
                <p className="mt-0.5 text-xs text-text-secondary">
                  +{formatUsd(finance.projectedIncomeUsd)} pending
                </p>
              )}
            </div>
            <div className="rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-text-secondary">
                <ArrowDownRight className="size-3.5 text-danger" />
                Total expenses
              </p>
              <p className="mt-1 font-semibold tabular-nums text-text-primary">
                {formatUsd(finance.totalExpensesUsd)}
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">
                {formatUsd(finance.paidExpensesUsd)} paid ·{" "}
                {formatUsd(finance.pendingExpensesUsd)} outstanding
              </p>
            </div>
            <div className="rounded-xl bg-white/60 px-4 py-3 backdrop-blur-sm">
              <p className="flex items-center gap-1.5 text-text-secondary">
                <PiggyBank className="size-3.5 text-primary" />
                Budget remaining
              </p>
              <p
                className={cn(
                  "mt-1 font-semibold tabular-nums",
                  finance.budgetRemainingUsd >= 0
                    ? "text-text-primary"
                    : "text-danger",
                )}
              >
                {formatUsd(finance.budgetRemainingUsd)}
              </p>
              <p className="mt-0.5 text-xs text-text-secondary">
                of {formatUsd(finance.budgetUsd)} allocated
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card static>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Wallet className="size-4 text-primary" />
              Budget utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress
              value={finance.totalExpensesUsd}
              max={finance.budgetUsd || 1}
              tone={
                finance.isOverBudget
                  ? "danger"
                  : budgetUsedPercent >= 85
                    ? "warning"
                    : "primary"
              }
              label={`${budgetUsedPercent}% of budget spent`}
              showValue
            />
            {finance.isOverBudget && (
              <p className="mt-2 text-xs font-medium text-danger">
                Over budget by {formatUsd(Math.abs(finance.budgetRemainingUsd))}
              </p>
            )}
          </CardContent>
        </Card>

        <Card static>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Receipt className="size-4 text-primary" />
              Income vs expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-text-secondary">Income</span>
                  <span className="font-semibold tabular-nums text-success">
                    {formatUsd(finance.realizedIncomeUsd)}
                  </span>
                </div>
                <Progress
                  value={finance.realizedIncomeUsd}
                  max={Math.max(
                    finance.realizedIncomeUsd,
                    finance.totalExpensesUsd,
                    1,
                  )}
                  tone="success"
                />
              </div>
              <div>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="text-text-secondary">Expenses</span>
                  <span className="font-semibold tabular-nums text-danger">
                    {formatUsd(finance.totalExpensesUsd)}
                  </span>
                </div>
                <Progress
                  value={finance.totalExpensesUsd}
                  max={Math.max(
                    finance.realizedIncomeUsd,
                    finance.totalExpensesUsd,
                    1,
                  )}
                  tone="danger"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
