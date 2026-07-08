"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  Badge,
  Button,
  DataTable,
  toast,
} from "@/components/ui";
import { useBlogPosts, useUpdateBlogStatus } from "@/lib/hooks/use-travel-data";
import type { BlogPost } from "@/lib/types";

export default function AdminBlogPage() {
  const { data: posts, isLoading } = useBlogPosts();
  const updateStatus = useUpdateBlogStatus();
  const canEdit = useRequireRole(["admin", "content_manager"]);

  const columns: ColumnDef<BlogPost, unknown>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <span className="font-medium text-text-primary">{row.original.title}</span>
      ),
    },
    { accessorKey: "author", header: "Author" },
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
      accessorKey: "publishedAt",
      header: "Published",
      cell: ({ row }) =>
        row.original.publishedAt
          ? new Date(row.original.publishedAt).toLocaleDateString()
          : "—",
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => row.original.views.toLocaleString(),
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
              toast.success(next === "published" ? "Published" : "Unpublished");
            }}
          >
            {row.original.status === "published" ? "Unpublish" : "Publish"}
          </button>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Blog"
        description="Destination guides, travel tips, and SEO content."
        actions={
          canEdit && (
            <Button size="sm" onClick={() => toast.info("Post editor — mock")}>
              New post
            </Button>
          )
        }
      />
      <DataTable columns={columns} data={posts ?? []} loading={isLoading} />
    </>
  );
}
