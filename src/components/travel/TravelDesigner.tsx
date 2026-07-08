"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Headphones, Save, Send } from "lucide-react";
import { Button, Card, CardContent, Checkbox, Input, Spinner, Textarea, toast } from "@/components/ui";
import { Label } from "@/components/ui/Label";
import {
  StopEditorRow,
  TravelDesignerHeader,
  TravelDesignerProgress,
  TravelHubPicker,
  TravelKindSelector,
  TravelRouteStrip,
  useTravelStopActions,
} from "@/components/travel/TravelDesignerParts";
import {
  useSaveTravelPlan,
  useTravelHubs,
  useTravelPlanByRef,
} from "@/lib/hooks/use-travel-plan-data";
import { computeTravelEndDate } from "@/lib/travel-plan";
import type { TravelPlanKind, TravelPlanStop } from "@/lib/types";
import { useCurrentUser } from "@/lib/stores/auth";

interface TravelDesignerProps {
  reference?: string;
  redirectBase?: string;
}

export function TravelDesigner({
  reference,
  redirectBase = "/account/travel",
}: TravelDesignerProps) {
  const router = useRouter();
  const user = useCurrentUser();
  const { data: hubs, isLoading: hubsLoading } = useTravelHubs();
  const { data: existing, isLoading: planLoading } = useTravelPlanByRef(
    reference ?? "",
  );
  const save = useSaveTravelPlan();

  const [name, setName] = useState("");
  const [kind, setKind] = useState<TravelPlanKind>("inbound_international");
  const [travelerCount, setTravelerCount] = useState(1);
  const [stops, setStops] = useState<TravelPlanStop[]>([]);
  const [notes, setNotes] = useState("");
  const [assistance, setAssistance] = useState(true);
  const [hydrated, setHydrated] = useState(!reference);

  useEffect(() => {
    if (!reference || !existing || hydrated) return;
    setName(existing.name);
    setKind(existing.kind);
    setTravelerCount(existing.travelerCount);
    setStops(existing.stops);
    setNotes(existing.notes ?? "");
    setAssistance(existing.assistanceRequested);
    setHydrated(true);
  }, [reference, existing, hydrated]);

  const { addHub, removeStop, updateStop } = useTravelStopActions(
    stops,
    setStops,
    kind,
  );

  const persist = async (submit: boolean) => {
    if (!user) {
      router.push(`/auth/login?next=${reference ? `/account/travel/${reference}/edit` : "/travel/design"}`);
      return;
    }
    if (!name.trim()) {
      toast.error("Give your trip a name");
      return;
    }
    if (stops.length < 1) {
      toast.error("Add at least one city to your route");
      return;
    }

    try {
      const plan = await save.mutateAsync({
        id: existing?.id,
        userId: user.id,
        customerName: user.fullName,
        name,
        kind,
        travelerCount,
        stops,
        notes: notes || undefined,
        assistanceRequested: assistance,
        submit,
      });
      toast.success(submit ? "Travel plan submitted" : "Draft saved");
      router.push(`${redirectBase}/${plan.reference}${submit ? "" : "/edit"}`);
    } catch {
      toast.error("Could not save travel plan");
    }
  };

  if (reference && (planLoading || !hydrated)) {
    return <Spinner label="Loading travel plan…" className="py-16" />;
  }

  if (hubsLoading) {
    return <Spinner label="Loading cities…" className="py-16" />;
  }

  const endDate = computeTravelEndDate(stops);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <TravelDesignerHeader />
      <TravelDesignerProgress
        name={name}
        stops={stops}
        travelerCount={travelerCount}
      />

      <Card static variant="solid">
        <CardContent className="space-y-4 pt-6">
          <h2 className="font-heading text-sm font-bold text-text-primary">
            1 · Trip type
          </h2>
          <TravelKindSelector value={kind} onChange={setKind} />
        </CardContent>
      </Card>

      <Card static variant="solid">
        <CardContent className="space-y-4 pt-6">
          <h2 className="font-heading text-sm font-bold text-text-primary">
            2 · Trip details
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium">Trip name</span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Summer Ethiopia from Frankfurt"
              />
            </label>
            <label className="space-y-1.5">
              <span className="text-sm font-medium">Travelers</span>
              <Input
                type="number"
                min={1}
                max={20}
                value={travelerCount}
                onChange={(e) => setTravelerCount(Number(e.target.value))}
              />
            </label>
            {endDate && (
              <div className="flex items-end text-sm text-text-secondary">
                Route dates: {stops[0]?.arrivalDate} → {endDate}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2">
            <Checkbox checked={assistance} onCheckedChange={(v) => setAssistance(Boolean(v))} />
            <span className="text-sm text-text-secondary">
              <Headphones className="mr-1 inline size-4 text-primary" />
              AS Tour coordinates flights, transfers, and border connections
            </span>
          </label>
        </CardContent>
      </Card>

      <Card static variant="solid">
        <CardContent className="space-y-4 pt-6">
          <h2 className="font-heading text-sm font-bold text-text-primary">
            3 · Your route
          </h2>
          <TravelRouteStrip stops={stops} onRemove={removeStop} />
          {stops.length > 0 && (
            <div className="space-y-3 border-t border-border/60 pt-4">
              <p className="text-xs font-bold uppercase text-text-secondary">Adjust dates</p>
              {stops.map((stop) => (
                <StopEditorRow
                  key={stop.id}
                  stop={stop}
                  onChange={(patch) => updateStop(stop.id, patch)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card static variant="solid">
        <CardContent className="space-y-4 pt-6">
          <h2 className="font-heading text-sm font-bold text-text-primary">
            4 · Add cities
          </h2>
          <TravelHubPicker hubs={hubs ?? []} kind={kind} onAdd={addHub} />
        </CardContent>
      </Card>

      <Card static variant="solid">
        <CardContent className="space-y-3 pt-6">
          <Label htmlFor="travel-notes">Notes for our travel team</Label>
          <Textarea
            id="travel-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Visa status, preferred airlines, accessibility needs…"
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2 pb-8">
        <Button
          variant="secondary"
          loading={save.isPending}
          onClick={() => persist(false)}
        >
          <Save className="size-4" />
          Save draft
        </Button>
        <Button loading={save.isPending} onClick={() => persist(true)}>
          <Send className="size-4" />
          Submit for quote
        </Button>
      </div>
    </div>
  );
}
