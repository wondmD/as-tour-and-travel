"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { SubmitButton, TextField } from "@/components/forms";
import { AuthLayout } from "@/components/portal/PortalShell";
import { Button, toast } from "@/components/ui";
import { useAuthStore } from "@/lib/stores/auth";

const loginSchema = Yup.object({
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const login = useAuthStore((s) => s.login);
  const router = useRouter();

  return (
    <AuthLayout
      title="Sign in"
      subtitle="Welcome back — manage your trips and bookings."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{ email: "amina@example.com", password: "Demo1234" }}
        validationSchema={loginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const result = await login(values.email, values.password);
          setSubmitting(false);
          if (!result.ok) {
            toast.error(result.error ?? "Login failed");
            return;
          }
          toast.success("Signed in");
          router.push(result.redirect ?? "/account");
        }}
      >
        <Form className="space-y-4">
          <TextField name="email" label="Email" type="email" autoComplete="email" required />
          <TextField name="password" label="Password" type="password" autoComplete="current-password" required />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-text-secondary">
              <input type="checkbox" className="size-4 rounded border-border accent-primary" />
              Remember me
            </label>
            <Link href="/auth/forgot-password" className="font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <SubmitButton fullWidth>Sign in</SubmitButton>
          <Button type="button" variant="secondary" fullWidth onClick={() => toast.info("Google OAuth — mock")}>
            Continue with Google
          </Button>
        </Form>
      </Formik>
    </AuthLayout>
  );
}
