"use client";

import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  toast,
} from "@/components/ui";
import {
  useDestinations,
  useUpdateDestinationStatus,
} from "@/lib/hooks/use-travel-data";

export default function AdminDestinationsPage() {
  const { data: destinations, isLoading } = useDestinations();
  const updateStatus = useUpdateDestinationStatus();
  const canEdit = useRequireRole(["admin", "content_manager"]);

  if (isLoading) return null;

  return (
    <>
      <PageHeader
        title="Destinations"
        description="CMS for destination guides, translations, and SEO content."
        actions={
          canEdit && (
            <Button size="sm" onClick={() => toast.info("Destination editor — mock")}>
              New destination
            </Button>
          )
        }
      />
      <div className="grid gap-3 md:grid-cols-2">
        {destinations?.map((d) => (
          <Card key={d.id} static>
            <CardHeader
              actions={
                <Badge variant={d.status === "published" ? "success" : "neutral"}>
                  {d.status}
                </Badge>
              }
            >
              <CardTitle>{d.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-text-secondary">
              {d.country} · Best: {d.bestSeason} · {d.tourCount} tours
              {canEdit && (
                <Button
                  className="mt-3"
                  size="sm"
                  variant="soft"
                  onClick={() => {
                    const next = d.status === "published" ? "draft" : "published";
                    updateStatus.mutate({ id: d.id, status: next });
                    toast.success(next === "published" ? "Published" : "Unpublished");
                  }}
                >
                  {d.status === "published" ? "Unpublish" : "Publish"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
