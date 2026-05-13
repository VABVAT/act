import "server-only";

import { redirect } from "next/navigation";

import { getCurrentProfile, getCurrentUser } from "@/lib/auth/session";

export async function requireAuthenticatedUser(nextPath = "/orders") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }

  return user;
}

export async function requireAdminUser() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  if (!user || !profile || profile.role !== "admin") {
    redirect("/login?next=/admin");
  }

  return { user, profile };
}
