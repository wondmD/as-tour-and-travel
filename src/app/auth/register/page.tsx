"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { CheckboxField, SubmitButton, TextField } from "@/components/forms";
import { AuthLayout } from "@/components/portal/PortalShell";
import { Button, toast } from "@/components/ui";

const registerSchema = Yup.object({
  fullName: Yup.string().min(3, "At least 3 characters").required("Full name is required"),
  email: Yup.string().email("Enter a valid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^\+?[0-9\s-]{9,15}$/, "Enter a valid phone number")
    .required("Phone is required"),
  password: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "Include an uppercase letter")
    .matches(/[0-9]/, "Include a number")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
  terms: Yup.boolean().oneOf([true], "You must accept the terms"),
});

export default function RegisterPage() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join AS Tour & Travel to book, pay, and manage your Ethiopia adventures."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/auth/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          terms: false,
        }}
        validationSchema={registerSchema}
        onSubmit={async () => {
          await new Promise((r) => setTimeout(r, 700));
          toast.success("Account created (mock)", {
            description: "Check your inbox to verify your email.",
          });
          router.push("/auth/verify-email?email=" + encodeURIComponent("new@example.com"));
        }}
      >
        <Form className="space-y-4">
          <TextField name="fullName" label="Full name" required placeholder="Amina Kedir" />
          <TextField name="email" label="Email" type="email" required placeholder="you@example.com" />
          <TextField name="phone" label="Phone" type="tel" required placeholder="+251 9…" hint="Include country code" />
          <TextField name="password" label="Password" type="password" required />
          <TextField name="confirmPassword" label="Confirm password" type="password" required />
          <CheckboxField name="terms" label="I agree to the Terms of Service and Privacy Policy" />
          <SubmitButton fullWidth>Create account</SubmitButton>
          <Button type="button" variant="secondary" fullWidth onClick={() => toast.info("Google OAuth — mock")}>
            Sign up with Google
          </Button>
        </Form>
      </Formik>
    </AuthLayout>
  );
}
