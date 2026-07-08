"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthLayout } from "@/components/portal/PortalShell";
import { Button, Spinner, toast } from "@/components/ui";

function VerifyEmailContent() {
  const params = useSearchParams();
  const email = params.get("email") ?? "your email";
  const [cooldown, setCooldown] = useState(0);

  const resend = () => {
    if (cooldown > 0) return;
    toast.success("Verification email resent (mock)");
    setCooldown(60);
    const interval = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) clearInterval(interval);
        return c - 1;
      });
    }, 1000);
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a verification link to ${email}. Click the link in the email to activate your account.`}
      footer={
        <Link href="/auth/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      }
    >
      <div className="space-y-4 text-center">
        <p className="text-sm text-text-secondary">
          Didn&apos;t receive it? Check spam or request a new link.
        </p>
        <Button variant="secondary" fullWidth onClick={resend} disabled={cooldown > 0}>
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend verification email"}
        </Button>
        <Button href="/auth/login" fullWidth>
          I&apos;ve verified — sign in
        </Button>
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<Spinner label="Loading…" className="mx-auto min-h-dvh" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
