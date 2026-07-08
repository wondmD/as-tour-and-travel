"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Session, TravelerProfile, User } from "@/lib/types";
import { DEMO_PASSWORD, DEMO_USERS, PROFILES } from "@/lib/mock/seed";
import { findProfile, upsertProfile } from "@/lib/mock/db";
import { adminHomeForRole } from "@/lib/auth/permissions";

interface AuthState {
  session: Session | null;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; redirect?: string }>;
  logout: () => void;
  switchDemoUser: (userId: string) => void;
  updateProfile: (patch: Partial<TravelerProfile>) => void;
}

function buildSession(user: User): Session {
  const profile = findProfile(user.id) ?? (user.role === "traveler" ? PROFILES[0] : undefined);
  return { user, profile: profile?.userId === user.id ? profile : undefined };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      session: buildSession(DEMO_USERS[0]!),

      login: async (email, password) => {
        await new Promise((r) => setTimeout(r, 500));
        const user = DEMO_USERS.find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (!user || password !== DEMO_PASSWORD) {
          return { ok: false, error: "Invalid email or password" };
        }
        if (!user.emailVerified) {
          return { ok: false, error: "Please verify your email before signing in" };
        }
        const session = buildSession(user);
        set({ session });
        const redirect =
          user.role === "traveler" ? "/account" : adminHomeForRole(user.role);
        return { ok: true, redirect };
      },

      logout: () => set({ session: null }),

      switchDemoUser: (userId) => {
        const user = DEMO_USERS.find((u) => u.id === userId);
        if (user) set({ session: buildSession(user) });
      },

      updateProfile: (patch) => {
        const { session } = get();
        if (!session?.user) return;
        const base: TravelerProfile = session.profile ?? {
          userId: session.user.id,
          nationality: "",
          preferredLanguage: "en",
        };
        const updated = { ...base, ...patch, userId: session.user.id };
        upsertProfile(updated);
        set({ session: { ...session, profile: updated } });
      },
    }),
    {
      name: "astt-auth",
      partialize: (s) => ({ session: s.session }),
    },
  ),
);

export function useSession() {
  return useAuthStore((s) => s.session);
}

export function useCurrentUser(): User | null {
  return useAuthStore((s) => s.session?.user ?? null);
}
