"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { SubmitButton, TextField } from "@/components/forms";
import { AuthLayout } from "@/components/portal/PortalShell";
import { toast } from "@/components/ui";

const schema = Yup.object({
  password: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Include an uppercase letter")
    .matches(/[0-9]/, "Include a number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});

export default function ResetPasswordPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Set new password"
      subtitle="Choose a strong password for your account."
      footer={
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <Formik
        initialValues={{ password: "", confirmPassword: "" }}
        validationSchema={schema}
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 600));
          toast.success("Password updated (mock)");
          router.push("/auth/login");
        }}
      >
        <Form className="space-y-4">
          <TextField name="password" label="New password" type="password" required autoComplete="new-password" />
          <TextField name="confirmPassword" label="Confirm password" type="password" required autoComplete="new-password" />
          <SubmitButton fullWidth>Update password</SubmitButton>
        </Form>
      </Formik>
    </AuthLayout>
  );
}
