"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { PageHeader } from "@/components/dashboard";
import { useRequireRole } from "@/components/auth/AuthGuard";
import {
  CheckboxField,
  SubmitButton,
  TextField,
} from "@/components/forms";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  toast,
} from "@/components/ui";
import { useAppSettings, useUpdateSettings } from "@/lib/hooks/use-travel-data";
import type { AppSettings } from "@/lib/types";

const schema = Yup.object({
  companyName: Yup.string().required("Required"),
  supportEmail: Yup.string().email("Invalid email").required("Required"),
  defaultCurrency: Yup.string().required("Required"),
  bookingHoldMinutes: Yup.number().min(5).max(120).required(),
  cancellationGraceDays: Yup.number().min(0).max(90).required(),
});

export default function AdminSettingsPage() {
  const { data: settings, isLoading } = useAppSettings();
  const update = useUpdateSettings();
  const canEdit = useRequireRole(["admin"]);

  if (isLoading || !settings) return null;

  return (
    <>
      <PageHeader
        title="Settings"
        description="Platform configuration, payment gateways, and booking policies."
      />

      <Formik<AppSettings>
        initialValues={settings}
        validationSchema={schema}
        enableReinitialize
        onSubmit={async (values, { setSubmitting }) => {
          if (!canEdit) return;
          await update.mutateAsync(values);
          toast.success("Settings saved");
          setSubmitting(false);
        }}
      >
        {() => (
          <Form className="grid max-w-2xl gap-4">
            <Card static>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Company identity and support contact</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextField name="companyName" label="Company name" disabled={!canEdit} />
                <TextField name="supportEmail" label="Support email" type="email" disabled={!canEdit} />
                <TextField name="defaultCurrency" label="Default currency" disabled={!canEdit} />
              </CardContent>
            </Card>

            <Card static>
              <CardHeader>
                <CardTitle>Booking policies</CardTitle>
                <CardDescription>Hold times and cancellation windows</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <TextField
                  name="bookingHoldMinutes"
                  label="Payment hold (minutes)"
                  type="number"
                  disabled={!canEdit}
                />
                <TextField
                  name="cancellationGraceDays"
                  label="Free cancellation window (days)"
                  type="number"
                  disabled={!canEdit}
                />
              </CardContent>
            </Card>

            <Card static>
              <CardHeader>
                <CardTitle>Payment gateways</CardTitle>
                <CardDescription>Enable or disable checkout providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <CheckboxField name="enableStripe" label="Stripe (international cards)" disabled={!canEdit} />
                <CheckboxField name="enableChapa" label="Chapa" disabled={!canEdit} />
                <CheckboxField name="enableTelebirr" label="Telebirr" disabled={!canEdit} />
                <CheckboxField name="maintenanceMode" label="Maintenance mode" disabled={!canEdit} />
              </CardContent>
            </Card>

            {canEdit && (
              <SubmitButton className="w-fit">Save settings</SubmitButton>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
}
