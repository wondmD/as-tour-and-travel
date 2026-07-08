"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  Badge,
  Button,
  DataTable,
  Progress,
  toast,
} from "@/components/ui";
import {
  usePromotions,
  useUpdatePromotionStatus,
} from "@/lib/hooks/use-travel-data";
import type { Promotion } from "@/lib/types";

export default function AdminPromotionsPage() {
  const { data: promotions, isLoading } = usePromotions();
  const updateStatus = useUpdatePromotionStatus();
  const canEdit = useRequireRole(["admin"]);

  const columns: ColumnDef<Promotion, unknown>[] = [
    {
      accessorKey: "code",
      header: "Code",
      cell: ({ row }) => (
        <span className="font-mono font-semibold text-primary">
          {row.original.code}
        </span>
      ),
    },
    { accessorKey: "title", header: "Campaign" },
    {
      accessorKey: "discountPercent",
      header: "Discount",
      cell: ({ row }) => `${row.original.discountPercent}%`,
    },
    {
      id: "validity",
      header: "Valid",
      cell: ({ row }) =>
        `${row.original.validFrom} → ${row.original.validUntil}`,
    },
    {
      id: "usage",
      header: "Usage",
      cell: ({ row }) => (
        <div className="min-w-28">
          <Progress
            value={row.original.uses}
            max={row.original.maxUses}
            showValue
            label={`${row.original.uses}/${row.original.maxUses}`}
          />
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "active"
              ? "success"
              : row.original.status === "scheduled"
                ? "info"
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
        canEdit && row.original.status === "scheduled" ? (
          <button
            type="button"
            className="rounded-lg bg-primary/8 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/14"
            onClick={(e) => {
              e.stopPropagation();
              updateStatus.mutate({ id: row.original.id, status: "active" });
              toast.success("Promotion activated");
            }}
          >
            Activate
          </button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Promotions"
        description="Discount codes, seasonal campaigns, and usage limits."
        actions={
          canEdit && (
            <Button size="sm" onClick={() => toast.info("Promo builder — mock")}>
              New promotion
            </Button>
          )
        }
      />
      <DataTable columns={columns} data={promotions ?? []} loading={isLoading} />
    </>
  );
}
