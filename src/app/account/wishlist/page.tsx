"use client";

import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  Spinner,
  toast,
} from "@/components/ui";
import { useRemoveWishlistItem, useWishlist } from "@/lib/hooks/use-travel-data";

export default function WishlistPage() {
  const { data, isLoading } = useWishlist();
  const remove = useRemoveWishlistItem();

  const tours = data?.filter((w) => w.type === "tour") ?? [];
  const destinations = data?.filter((w) => w.type === "destination") ?? [];

  return (
    <>
      <PageHeader
        title="Wishlist"
        description="Tours and destinations you've saved for later."
        actions={<Button href="/#tours" size="sm">Browse tours</Button>}
      />

      {isLoading ? (
        <Spinner label="Loading wishlist…" />
      ) : !data?.length ? (
        <EmptyState
          icon={Heart}
          title="Your wishlist is empty"
          description="Tap the heart on any tour or destination to save it here."
          action={<Button href="/#tours" size="sm">Explore tours</Button>}
        />
      ) : (
        <div className="space-y-8">
          {tours.length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Tours
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {tours.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onRemove={() => remove.mutateAsync(item.id).then(() => toast.success("Removed"))}
                  />
                ))}
              </div>
            </section>
          )}
          {destinations.length > 0 && (
            <section>
              <h2 className="mb-3 font-heading text-sm font-semibold uppercase tracking-wider text-text-secondary">
                Destinations
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {destinations.map((item) => (
                  <WishlistCard
                    key={item.id}
                    item={item}
                    onRemove={() => remove.mutateAsync(item.id).then(() => toast.success("Removed"))}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}

function WishlistCard({
  item,
  onRemove,
}: {
  item: { id: string; title: string; subtitle: string; priceFromUsd?: number; type: string };
  onRemove: () => void;
}) {
  return (
    <Card static>
      <CardContent className="flex items-start justify-between gap-3">
        <div>
          <Badge variant="primary" className="mb-2 capitalize">{item.type}</Badge>
          <p className="font-medium text-text-primary">{item.title}</p>
          <p className="text-xs text-text-secondary">{item.subtitle}</p>
          {item.priceFromUsd && (
            <p className="mt-1 text-sm font-semibold text-primary">
              From ${item.priceFromUsd.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Button size="icon" variant="ghost" aria-label="Remove" onClick={onRemove}>
            <Trash2 className="size-4 text-danger" />
          </Button>
          {item.type === "tour" && (
            <Button size="sm" variant="soft" href={`/tours/tour-001`}>
              View
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
