"use client";

import { useParams } from "next/navigation";
import { Form, Formik } from "formik";
import { PageHeader } from "@/components/dashboard";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Spinner,
  Textarea,
  toast,
} from "@/components/ui";
import {
  useAssignTicket,
  useReplyToTicket,
  useSupportTicket,
  useTicketMessages,
} from "@/lib/hooks/use-travel-data";
import { useSession } from "@/lib/stores/auth";

export default function SupportTicketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const session = useSession();
  const { data: ticket, isLoading } = useSupportTicket(id);
  const { data: messages } = useTicketMessages(id);
  const reply = useReplyToTicket();
  const assign = useAssignTicket();

  if (isLoading || !ticket) return <Spinner label="Loading ticket…" />;

  const isStaff = session?.user.role !== "traveler";

  return (
    <>
      <PageHeader
        title={ticket.reference}
        description={ticket.subject}
        actions={
          isStaff && !ticket.assigneeId && session ? (
            <Button
              size="sm"
              onClick={() =>
                assign.mutateAsync({
                  id: ticket.id,
                  assigneeId: session.user.id,
                  assigneeName: session.user.fullName,
                })
              }
            >
              Assign to me
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card static className="lg:col-span-2">
          <CardContent className="space-y-4">
            {messages?.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl px-4 py-3 ${
                  m.authorRole === "traveler"
                    ? "bg-primary/6 ms-0 me-8"
                    : "bg-white/80 ms-8 me-0 border border-border/60"
                }`}
              >
                <p className="text-xs font-semibold text-text-secondary">
                  {m.authorName} · {new Date(m.createdAt).toLocaleString()}
                </p>
                <p className="mt-1 text-sm text-text-primary">{m.body}</p>
              </div>
            ))}

            {isStaff && (
              <Formik
                initialValues={{ body: "" }}
                onSubmit={async (values, { resetForm }) => {
                  await reply.mutateAsync({
                    ticketId: ticket.id,
                    body: values.body,
                    authorName: session!.user.fullName,
                    authorRole: session!.user.role,
                  });
                  resetForm();
                  toast.success("Reply sent");
                }}
              >
                {({ values, handleChange, handleSubmit, isSubmitting }) => (
                  <form onSubmit={handleSubmit} className="space-y-2 border-t border-border/50 pt-4">
                    <Textarea
                      name="body"
                      value={values.body}
                      onChange={handleChange}
                      placeholder="Type your reply…"
                      rows={3}
                      required
                    />
                    <Button type="submit" size="sm" loading={isSubmitting}>
                      Send reply
                    </Button>
                  </form>
                )}
              </Formik>
            )}
          </CardContent>
        </Card>

        <Card static>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-text-secondary">Customer</p>
              <p className="font-medium">{ticket.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Status</p>
              <Badge>{ticket.status}</Badge>
            </div>
            <div>
              <p className="text-xs text-text-secondary">Assignee</p>
              <p>{ticket.assigneeName ?? "Unassigned"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
