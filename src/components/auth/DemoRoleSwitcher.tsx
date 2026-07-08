"use client";

import { Users } from "lucide-react";
import { DEMO_USERS } from "@/lib/mock/seed";
import { roleLabel } from "@/lib/auth/permissions";
import { useAuthStore, useSession } from "@/lib/stores/auth";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";

/** Demo-only control to switch between role accounts without re-login. */
export function DemoRoleSwitcher({ compact }: { compact?: boolean }) {
  const session = useSession();
  const switchDemoUser = useAuthStore((s) => s.switchDemoUser);

  if (!session) return null;

  const options = DEMO_USERS.map((u) => ({
    value: u.id,
    label: `${u.fullName} (${roleLabel(u.role)})`,
  }));

  if (compact) {
    return (
      <Select
        value={session.user.id}
        onValueChange={switchDemoUser}
        options={options}
        className="min-h-9 text-xs"
      />
    );
  }

  return (
    <div className="rounded-xl border border-dashed border-accent/40 bg-accent/5 p-3">
      <div className="mb-2 flex items-center gap-2">
        <Users className="size-4 text-accent" />
        <span className="text-xs font-semibold text-text-primary">Demo role switch</span>
        <Badge variant="accent">Mock</Badge>
      </div>
      <Select
        value={session.user.id}
        onValueChange={switchDemoUser}
        options={options}
      />
      <p className="mt-2 text-[11px] leading-relaxed text-text-secondary">
        All demo passwords: <code className="text-primary">Demo1234</code>
      </p>
    </div>
  );
}
