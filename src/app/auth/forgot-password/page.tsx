"use client";

import Link from "next/link";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { SubmitButton, TextField } from "@/components/forms";
import { AuthLayout } from "@/components/portal/PortalShell";
import { toast } from "@/components/ui";

const schema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter your email and we'll send a reset link."
      footer={
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Formik
        initialValues={{ email: "" }}
        validationSchema={schema}
        onSubmit={async (values) => {
          await new Promise((r) => setTimeout(r, 600));
          toast.success("Reset link sent (mock)", { description: values.email });
        }}
      >
        <Form className="space-y-4">
          <TextField name="email" label="Email" type="email" required placeholder="you@example.com" />
          <SubmitButton fullWidth>Send reset link</SubmitButton>
        </Form>
      </Formik>
    </AuthLayout>
  );
}
