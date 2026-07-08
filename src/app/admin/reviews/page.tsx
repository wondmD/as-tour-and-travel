"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Star } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  Badge,
  Button,
  DataTable,
  toast,
} from "@/components/ui";
import { useModerateReview, useReviews } from "@/lib/hooks/use-travel-data";
import type { Review } from "@/lib/types";

function RatingStars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${i < rating ? "fill-amber-400 text-amber-400" : "text-border"}`}
        />
      ))}
    </span>
  );
}

export default function AdminReviewsPage() {
  const { data: reviews, isLoading } = useReviews();
  const moderate = useModerateReview();
  const canModerate = useRequireRole(["admin", "content_manager"]);

  const columns: ColumnDef<Review, unknown>[] = [
    { accessorKey: "tourTitle", header: "Tour" },
    { accessorKey: "authorName", header: "Author" },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => <RatingStars rating={row.original.rating} />,
    },
    {
      accessorKey: "body",
      header: "Review",
      cell: ({ row }) => (
        <span className="line-clamp-2 max-w-xs text-sm text-text-secondary">
          {row.original.body}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.status === "approved"
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
        canModerate && row.original.status === "pending" ? (
          <span className="flex gap-1">
            <button
              type="button"
              className="rounded-lg bg-success/10 px-2 py-1 text-xs font-semibold text-success hover:bg-success/16"
              onClick={(e) => {
                e.stopPropagation();
                moderate.mutate({ id: row.original.id, status: "approved" });
                toast.success("Review approved");
              }}
            >
              Approve
            </button>
            <button
              type="button"
              className="rounded-lg bg-danger/10 px-2 py-1 text-xs font-semibold text-danger hover:bg-danger/16"
              onClick={(e) => {
                e.stopPropagation();
                moderate.mutate({ id: row.original.id, status: "rejected" });
                toast.info("Review rejected");
              }}
            >
              Reject
            </button>
          </span>
        ) : null,
    },
  ];

  const pending = reviews?.filter((r) => r.status === "pending").length ?? 0;

  return (
    <>
      <PageHeader
        title="Reviews"
        description={`Moderate traveler feedback before it appears on tour pages.${pending > 0 ? ` ${pending} pending.` : ""}`}
      />
      <DataTable columns={columns} data={reviews ?? []} loading={isLoading} />
    </>
  );
}
