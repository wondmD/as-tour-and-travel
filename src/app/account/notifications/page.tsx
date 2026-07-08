"use client";

import { PageHeader } from "@/components/dashboard";
import { SwitchField } from "@/components/forms";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Spinner,
  toast,
} from "@/components/ui";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationPrefs,
  useNotifications,
  useUpdateNotificationPrefs,
} from "@/lib/hooks/use-travel-data";
import { Form, Formik } from "formik";

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const { data: prefs } = useNotificationPrefs();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();
  const updatePrefs = useUpdateNotificationPrefs();

  return (
    <>
      <PageHeader
        title="Notifications"
        description="In-app history and channel preferences."
        actions={
          <Button
            size="sm"
            variant="secondary"
            onClick={() => markAll.mutateAsync().then(() => toast.success("All marked read"))}
          >
            Mark all read
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          {isLoading ? (
            <Spinner label="Loading…" />
          ) : (
            notifications?.map((n) => (
              <Card
                key={n.id}
                static
                className={n.read ? "opacity-75" : "border-primary/20"}
              >
                <CardContent className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text-primary">{n.title}</p>
                      {!n.read && <Badge variant="primary" dot>New</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-text-secondary">{n.body}</p>
                    <p className="mt-1 text-xs text-text-secondary/70">
                      {new Date(n.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markRead.mutateAsync(n.id)}
                    >
                      Mark read
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Card static className="lg:col-span-2">
          <CardContent>
            <h3 className="font-heading text-sm font-semibold text-text-primary">
              Preferences
            </h3>
            {prefs && (
              <Formik
                enableReinitialize
                initialValues={prefs}
                onSubmit={async (values) => {
                  await updatePrefs.mutateAsync(values);
                  toast.success("Preferences saved");
                }}
              >
                {({ values, setFieldValue, submitForm }) => (
                  <Form className="mt-4 space-y-4">
                    <SwitchField name="emailBooking" label="Booking emails" />
                    <SwitchField name="emailPromo" label="Promotional emails" />
                    <SwitchField name="smsReminder" label="SMS trip reminders" />
                    <SwitchField name="pushEnabled" label="Push notifications" />
                    <Button type="button" size="sm" onClick={() => submitForm()}>
                      Save preferences
                    </Button>
                  </Form>
                )}
              </Formik>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
