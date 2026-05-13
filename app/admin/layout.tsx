import { requireAdminUser } from "@/lib/auth/guards";

import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAdminUser();

  return <AdminShell>{children}</AdminShell>;
}
