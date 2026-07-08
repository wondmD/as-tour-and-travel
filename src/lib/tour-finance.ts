import type {
  Booking,
  TourBudget,
  TourExpense,
  TourExpenseCategory,
  TourFinancialSummary,
  TourIncomeLine,
} from "@/lib/types";

const REALIZED_STATUSES = new Set<Booking["status"]>(["confirmed", "completed"]);
const PROJECTED_STATUSES = new Set<Booking["status"]>(["pending"]);

export function getTourIncomeLines(
  tourId: string,
  bookings: Booking[],
): TourIncomeLine[] {
  return bookings
    .filter((b) => b.tourId === tourId && b.status !== "cancelled" && b.status !== "failed")
    .map((b) => ({
      id: b.id,
      bookingReference: b.reference,
      departureDate: b.departureDate,
      travelerCount: b.travelerCount,
      amountUsd: b.amountUsd,
      paymentStatus: b.paymentStatus,
      bookingStatus: b.status,
      createdAt: b.createdAt,
    }))
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

export function computeTourFinancials(
  tourId: string,
  bookings: Booking[],
  expenses: TourExpense[],
  budget?: TourBudget,
): TourFinancialSummary {
  const incomeLines = getTourIncomeLines(tourId, bookings);

  const realizedIncomeUsd = incomeLines
    .filter((l) => REALIZED_STATUSES.has(l.bookingStatus))
    .reduce((sum, l) => sum + l.amountUsd, 0);

  const projectedIncomeUsd = incomeLines
    .filter((l) => PROJECTED_STATUSES.has(l.bookingStatus))
    .reduce((sum, l) => sum + l.amountUsd, 0);

  const totalIncomeUsd = realizedIncomeUsd + projectedIncomeUsd;

  const tourExpenses = expenses.filter((e) => e.tourId === tourId);
  const totalExpensesUsd = tourExpenses.reduce((s, e) => s + e.amountUsd, 0);
  const paidExpensesUsd = tourExpenses
    .filter((e) => e.status === "paid")
    .reduce((s, e) => s + e.amountUsd, 0);
  const pendingExpensesUsd = tourExpenses
    .filter((e) => e.status === "planned" || e.status === "pending")
    .reduce((s, e) => s + e.amountUsd, 0);

  const budgetUsd = budget?.totalBudgetUsd ?? 0;
  const profitLossUsd = realizedIncomeUsd - totalExpensesUsd;
  const budgetRemainingUsd = budgetUsd - totalExpensesUsd;
  const profitMarginPercent =
    realizedIncomeUsd > 0
      ? Math.round((profitLossUsd / realizedIncomeUsd) * 1000) / 10
      : 0;

  const expensesByCategory = tourExpenses.reduce(
    (acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + e.amountUsd;
      return acc;
    },
    {} as Record<TourExpenseCategory, number>,
  );

  const monthMap = new Map<string, number>();
  incomeLines
    .filter((l) => REALIZED_STATUSES.has(l.bookingStatus))
    .forEach((l) => {
      const month = new Date(l.createdAt).toLocaleString("en", {
        month: "short",
        year: "2-digit",
      });
      monthMap.set(month, (monthMap.get(month) ?? 0) + l.amountUsd);
    });

  const incomeByMonth = Array.from(monthMap.entries()).map(([month, amount]) => ({
    month,
    amount,
  }));

  return {
    tourId,
    totalIncomeUsd,
    realizedIncomeUsd,
    projectedIncomeUsd,
    totalExpensesUsd,
    paidExpensesUsd,
    pendingExpensesUsd,
    budgetUsd,
    profitLossUsd,
    budgetRemainingUsd,
    profitMarginPercent,
    isProfit: profitLossUsd >= 0,
    isOverBudget: budgetUsd > 0 && totalExpensesUsd > budgetUsd,
    expensesByCategory,
    incomeByMonth,
  };
}

export function formatUsd(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`;
  }
  return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export const EXPENSE_CATEGORY_LABELS: Record<TourExpenseCategory, string> = {
  accommodation: "Accommodation",
  transport: "Transport",
  guides: "Guides & staff",
  food: "Food & catering",
  permits: "Permits & fees",
  marketing: "Marketing",
  equipment: "Equipment",
  insurance: "Insurance",
  other: "Other",
};
