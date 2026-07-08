"use client";

import { type ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  TransportBookingStatusBadge,
  TransportTypeBadge,
} from "@/components/transport/TransportBadges";
import { Button, DataTable, Dialog, Textarea, toast } from "@/components/ui";
import {
  useConfirmTransportBooking,
  useDeclineTransportBooking,
  usePendingTransportBookings,
} from "@/lib/hooks/use-transport-data";
import type { TransportBooking } from "@/lib/types";
import { useSession } from "@/lib/stores/auth";
import { useState } from "react";

export default function AdminTransportConfirmationsPage() {
  const session = useSession();
  const { data, isLoading } = usePendingTransportBookings();
  const confirm = useConfirmTransportBooking();
  const decline = useDeclineTransportBooking();
  const canEdit = useRequireRole(["admin", "staff"]);
  const [declineId, setDeclineId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const columns: ColumnDef<TransportBooking, unknown>[] = [
    { accessorKey: "reference", header: "Reference" },
    {
      id: "route",
      header: "Route",
      cell: ({ row }) => `${row.original.origin} → ${row.original.destination}`,
    },
    { accessorKey: "travelDate", header: "Date" },
    { accessorKey: "customerName", header: "Traveler" },
    {
      accessorKey: "routeType",
      header: "Mode",
      cell: ({ row }) => <TransportTypeBadge type={row.original.routeType} />,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <TransportBookingStatusBadge status={row.original.status} />
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) =>
        canEdit ? (
          <span className="flex gap-2">
            <Button
              size="xs"
              variant="soft"
              loading={confirm.isPending}
              onClick={() => {
                void confirm.mutateAsync({
                  id: row.original.id,
                  staffName: session?.user.fullName ?? "Staff",
                }).then(() => toast.success(`${row.original.reference} confirmed`));
              }}
            >
              Confirm
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={() => setDeclineId(row.original.id)}
            >
              Decline
            </Button>
          </span>
        ) : null,
    },
  ];

  return (
    <>
      <PageHeader
        title="Transfer confirmations"
        description="Coordinate private transfers and on-request legs — assign drivers and confirm pickup details."
        actions={
          <Link href="/admin/transport">
            <Button variant="secondary" size="sm">
              All routes
            </Button>
          </Link>
        }
      />
      <DataTable columns={columns} data={data ?? []} loading={isLoading} />

      <Dialog
        open={Boolean(declineId)}
        onOpenChange={(open) => !open && setDeclineId(null)}
        title="Decline transfer request"
        description="Traveler will be notified and payment refunded (mock)."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeclineId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              loading={decline.isPending}
              onClick={async () => {
                if (!declineId || !reason.trim()) return;
                await decline.mutateAsync({ id: declineId, reason });
                toast.success("Transfer declined");
                setDeclineId(null);
                setReason("");
              }}
            >
              Decline
            </Button>
          </>
        }
      >
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for decline…"
          rows={3}
        />
      </Dialog>
    </>
  );
}
