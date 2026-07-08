"use client";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { PageHeader } from "@/components/dashboard";
import { SubmitButton, TextField } from "@/components/forms";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  Input,
  toast,
} from "@/components/ui";
import { useState } from "react";

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Required"),
  newPassword: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Include uppercase")
    .matches(/[0-9]/, "Include a number")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Required"),
});

const MOCK_SESSIONS = [
  { id: "s1", device: "Chrome on Linux", location: "Addis Ababa", current: true, lastActive: "Now" },
  { id: "s2", device: "Safari on iPhone", location: "Riyadh", current: false, lastActive: "2 days ago" },
];

export default function SecurityPage() {
  const [deactivateOpen, setDeactivateOpen] = useState(false);

  return (
    <>
      <PageHeader title="Security" description="Password, sessions, and account deactivation." />

      <div className="grid max-w-2xl gap-6">
        <Card static>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{ currentPassword: "", newPassword: "", confirmPassword: "" }}
              validationSchema={passwordSchema}
              onSubmit={async () => {
                await new Promise((r) => setTimeout(r, 500));
                toast.success("Password updated (mock)");
              }}
            >
              <Form className="space-y-4">
                <TextField name="currentPassword" label="Current password" type="password" required />
                <TextField name="newPassword" label="New password" type="password" required />
                <TextField name="confirmPassword" label="Confirm password" type="password" required />
                <SubmitButton>Update password</SubmitButton>
              </Form>
            </Formik>
          </CardContent>
        </Card>

        <Card static>
          <CardHeader>
            <CardTitle>Active sessions</CardTitle>
            <CardDescription>Devices signed in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {MOCK_SESSIONS.map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-xl border border-border/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {s.device} {s.current && <span className="text-primary">(this device)</span>}
                  </p>
                  <p className="text-xs text-text-secondary">{s.location} · {s.lastActive}</p>
                </div>
                {!s.current && (
                  <Button size="sm" variant="ghost" onClick={() => toast.success("Session revoked (mock)")}>
                    Revoke
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card static>
          <CardHeader>
            <CardTitle>Deactivate account</CardTitle>
            <CardDescription>
              Permanently disable your account. Booking history is retained per policy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="danger" size="sm" onClick={() => setDeactivateOpen(true)}>
              Deactivate account
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        title="Deactivate your account?"
        description="This action requires your password and cannot be undone from the app."
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeactivateOpen(false)}>Cancel</Button>
            <Button variant="danger" onClick={() => toast.error("Deactivation — mock only")}>
              Confirm deactivation
            </Button>
          </>
        }
      >
        <Input type="password" placeholder="Your password" aria-label="Password confirmation" />
      </Dialog>
    </>
  );
}
