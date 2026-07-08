"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, Compass, Save, Sparkles } from "lucide-react";
import {
  Badge,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Input,
  Spinner,
  toast,
} from "@/components/ui";
import { useRequireRole } from "@/components/auth/AuthGuard";
import { DestinationPalette } from "@/components/admin/tour/design/DestinationPalette";
import {
  BuilderProgress,
  DesignSection,
  ItineraryTimeline,
} from "@/components/admin/tour/design/ItineraryTimeline";
import { StopEditorSheet } from "@/components/admin/tour/design/StopEditorSheet";
import { useDestinations, useTour } from "@/lib/hooks/use-travel-data";
import {
  useSaveTourDesign,
  useTourItinerary,
} from "@/lib/hooks/use-tour-builder";
import {
  builderCompletionPercent,
  computeTourDurationDays,
  destinationCoverImage,
  normalizeItineraryStops,
  slugifyTitle,
  suggestNextArrivalDate,
} from "@/lib/tour-itinerary";
import { TOUR_TYPE_LABELS } from "@/lib/tour-labels";
import type { Destination, TourItineraryStop, TourType } from "@/lib/types";
import { ethiopiaImages } from "@/lib/images";
import { nextId } from "@/lib/mock/db";

const TOUR_TYPES: TourType[] = [
  "group_departure",
  "semi_private",
  "private",
  "custom",
];

const CATEGORIES = ["Cultural", "Adventure", "Trekking", "Private", "Custom"];

interface TourDesignStudioProps {
  tourId?: string;
}

export function TourDesignStudio({ tourId }: TourDesignStudioProps) {
  const router = useRouter();
  const canEdit = useRequireRole(["admin", "staff", "content_manager"]);
  const { data: tourData, isLoading: tourLoading } = useTour(tourId ?? "");
  const { data: itinerary, isLoading: itineraryLoading } =
    useTourItinerary(tourId);
  const { data: destinations } = useDestinations();
  const saveDesign = useSaveTourDesign();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Cultural");
  const [tourType, setTourType] = useState<TourType>("group_departure");
  const [basePriceUsd, setBasePriceUsd] = useState(990);
  const [coverImage, setCoverImage] = useState(ethiopiaImages.tourCover);
  const [tourStartDate, setTourStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [stops, setStops] = useState<TourItineraryStop[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [hydrated, setHydrated] = useState(!tourId);

  useEffect(() => {
    if (!tourId || !tourData || !itinerary || hydrated) return;
    const tour = tourData.tour;
    setTitle(tour.title);
    setSlug(tour.slug);
    setCategory(tour.category);
    setTourType(tour.tourType);
    setBasePriceUsd(tour.basePriceUsd);
    setCoverImage(tour.coverImage);
    setTourStartDate(itinerary.tourStartDate);
    setStops(itinerary.stops);
    setHydrated(true);
  }, [tourId, tourData, itinerary, hydrated]);

  const selectedStop = stops.find((s) => s.id === selectedStopId) ?? null;
  const usedDestinationIds = useMemo(
    () => new Set(stops.map((s) => s.destinationId)),
    [stops],
  );

  const completion = builderCompletionPercent({
    title,
    slug,
    basePriceUsd,
    stops,
  });

  const durationDays = computeTourDurationDays(stops, tourStartDate);

  const addDestination = useCallback(
    (dest: Destination) => {
      const arrivalDate = suggestNextArrivalDate(stops, tourStartDate);
      const stop: TourItineraryStop = {
        id: nextId("stop"),
        destinationId: dest.id,
        destinationName: dest.name,
        country: dest.country,
        arrivalDate,
        nights: 2,
        dayNumber: 1,
        coverImage: destinationCoverImage(dest.id),
      };
      const next = normalizeItineraryStops([...stops, stop], tourStartDate);
      setStops(next);
      setSelectedStopId(stop.id);
      setSheetOpen(true);
    },
    [stops, tourStartDate],
  );

  const updateStop = useCallback(
    (id: string, patch: Partial<TourItineraryStop>) => {
      setStops((prev) =>
        normalizeItineraryStops(
          prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
          tourStartDate,
        ),
      );
    },
    [tourStartDate],
  );

  const removeStop = useCallback(
    (id: string) => {
      setStops((prev) =>
        normalizeItineraryStops(
          prev.filter((s) => s.id !== id),
          tourStartDate,
        ),
      );
      if (selectedStopId === id) {
        setSelectedStopId(null);
        setSheetOpen(false);
      }
    },
    [tourStartDate, selectedStopId],
  );

  const moveStop = useCallback(
    (id: string, direction: "up" | "down") => {
      setStops((prev) => {
        const sorted = normalizeItineraryStops(prev, tourStartDate);
        const idx = sorted.findIndex((s) => s.id === id);
        if (idx < 0) return prev;
        const swap = direction === "up" ? idx - 1 : idx + 1;
        if (swap < 0 || swap >= sorted.length) return prev;
        const a = sorted[idx]!;
        const b = sorted[swap]!;
        return normalizeItineraryStops(
          prev.map((s) => {
            if (s.id === a.id) return { ...s, arrivalDate: b.arrivalDate };
            if (s.id === b.id) return { ...s, arrivalDate: a.arrivalDate };
            return s;
          }),
          tourStartDate,
        );
      });
    },
    [tourStartDate],
  );

  const handleSave = async (publish: boolean) => {
    if (!canEdit) return;
    if (!title.trim()) {
      toast.error("Add a tour title");
      return;
    }
    if (stops.length === 0) {
      toast.error("Add at least one destination stop");
      return;
    }

    try {
      const result = await saveDesign.mutateAsync({
        tourId,
        publish,
        tourStartDate,
        stops,
        tour: {
          title: title.trim(),
          slug: slug.trim() || slugifyTitle(title),
          destination:
            stops.length > 0
              ? stops.map((s) => s.destinationName).join(" → ")
              : "Ethiopia",
          durationDays,
          basePriceUsd,
          coverImage: stops[0]?.coverImage ?? coverImage,
          category,
          tourType,
          status: publish ? "published" : "draft",
        },
      });
      toast.success(publish ? "Tour published" : "Draft saved");
      if (!tourId) {
        router.push(`/admin/tours/${result.tour.id}/design`);
      }
    } catch {
      toast.error("Could not save tour");
    }
  };

  if (tourId && (tourLoading || itineraryLoading || !hydrated)) {
    return <Spinner label="Loading tour designer…" className="py-20" />;
  }

  if (!canEdit) return null;

  return (
    <div className="-mx-4 -mt-2 pattern-surface sm:-mx-6 lg:-mx-8">
      <div className="mx-auto max-w-[90rem] space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        {/* Studio header */}
        <header className="space-y-4">
          <Breadcrumbs
            items={[
              { label: "Admin", href: "/admin" },
              { label: "Tours", href: "/admin/tours" },
              {
                label: tourId ? "Edit route" : "New tour",
                href: tourId
                  ? `/admin/tours/${tourId}/design`
                  : "/admin/tours/new",
              },
            ]}
          />
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <Badge variant="primary" dot>
                <Sparkles className="mr-1 inline size-3" />
                Tour design studio
              </Badge>
              <h1 className="mt-2 font-heading text-2xl font-bold text-text-primary sm:text-3xl">
                {tourId ? "Design tour route" : "Create a new tour"}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-text-secondary">
                Build the itinerary day by day — add destinations from the catalog and set
                each arrival date on the timeline.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" href="/admin/tours">
                <ArrowLeft className="size-4" />
                Back
              </Button>
              <Button
                variant="secondary"
                size="sm"
                loading={saveDesign.isPending}
                onClick={() => handleSave(false)}
              >
                <Save className="size-4" />
                Save draft
              </Button>
              <Button
                size="sm"
                loading={saveDesign.isPending}
                onClick={() => handleSave(true)}
              >
                Publish tour
              </Button>
            </div>
          </div>
          <BuilderProgress value={completion} />
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)] xl:grid-cols-[280px_minmax(0,1fr)_minmax(280px,300px)]">
          {/* Left — tour basics */}
          <aside className="space-y-6 xl:order-1">
            <Card static>
              <CardContent className="space-y-4 pt-6">
                <DesignSection
                  title="Tour basics"
                  description="Package metadata shown in catalog and booking."
                >
                  <div className="space-y-3">
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-text-primary">
                        Title
                      </span>
                      <Input
                        value={title}
                        onChange={(e) => {
                          setTitle(e.target.value);
                          if (!tourId && !slug) {
                            setSlug(slugifyTitle(e.target.value));
                          }
                        }}
                        placeholder="Historic North Circuit"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-text-primary">Slug</span>
                      <Input
                        className="font-mono text-sm"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="historic-north-circuit"
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-text-primary">
                        Tour start date
                      </span>
                      <Input
                        type="date"
                        value={tourStartDate}
                        onChange={(e) => {
                          setTourStartDate(e.target.value);
                          setStops((prev) =>
                            normalizeItineraryStops(prev, e.target.value),
                          );
                        }}
                      />
                      <p className="text-xs text-text-secondary">
                        Day 1 anchor — used to compute day numbers for each stop.
                      </p>
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-text-primary">
                        Base price (USD)
                      </span>
                      <Input
                        type="number"
                        value={basePriceUsd}
                        min={0}
                        onChange={(e) => setBasePriceUsd(Number(e.target.value))}
                      />
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-text-primary">
                        Category
                      </span>
                      <select
                        className="min-h-11 w-full rounded-[var(--radius-field)] border border-border bg-[var(--input-bg)] px-4 py-2.5 text-sm text-text-primary"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block space-y-1.5">
                      <span className="text-sm font-medium text-text-primary">
                        Tour type
                      </span>
                      <select
                        className="min-h-11 w-full rounded-[var(--radius-field)] border border-border bg-[var(--input-bg)] px-4 py-2.5 text-sm text-text-primary"
                        value={tourType}
                        onChange={(e) => setTourType(e.target.value as TourType)}
                      >
                        {TOUR_TYPES.map((t) => (
                          <option key={t} value={t}>
                            {TOUR_TYPE_LABELS[t]}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </DesignSection>

                <div className="rounded-xl border border-border/60 bg-white/50 p-3 text-sm">
                  <div className="flex items-center gap-2 font-semibold text-text-primary">
                    <Compass className="size-4 text-primary" />
                    Route summary
                  </div>
                  <dl className="mt-2 space-y-1 text-text-secondary">
                    <div className="flex justify-between">
                      <dt>Stops</dt>
                      <dd className="font-semibold text-text-primary">{stops.length}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Duration</dt>
                      <dd className="font-semibold text-text-primary">
                        {durationDays || "—"} days
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Center — timeline canvas */}
          <main className="min-w-0 xl:order-2">
            <DesignSection
              title="Route timeline"
              description="Destinations ordered by arrival date — each card shows when travelers arrive and depart."
            >
              <ItineraryTimeline
                tourStartDate={tourStartDate}
                stops={stops}
                selectedStopId={selectedStopId}
                onSelectStop={(id) => {
                  setSelectedStopId(id);
                  setSheetOpen(true);
                }}
                onRemoveStop={removeStop}
                onMoveStop={moveStop}
                onAddStop={() => {
                  toast.info("Pick a destination from the catalog →");
                }}
              />
            </DesignSection>
          </main>

          {/* Right — destination catalog */}
          <aside className="xl:order-3">
            <Card static className="glass-card sticky top-4">
              <CardContent className="pt-6">
                <DesignSection
                  title="Destination catalog"
                  description="Published destinations from your CMS."
                >
                  <DestinationPalette
                    destinations={destinations ?? []}
                    usedDestinationIds={usedDestinationIds}
                    onAdd={addDestination}
                  />
                </DesignSection>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      <StopEditorSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        stop={selectedStop}
        tourStartDate={tourStartDate}
        onSave={(patch) => {
          if (selectedStopId) updateStop(selectedStopId, patch);
        }}
        onDelete={
          selectedStopId
            ? () => {
                removeStop(selectedStopId);
              }
            : undefined
        }
      />
    </div>
  );
}
