"use client";

import { Toaster } from "sonner";

export function AppProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Toaster
        closeButton
        position="top-center"
        toastOptions={{
          className: "!rounded-2xl !border !border-line !bg-white !text-foreground",
        }}
      />
    </>
  );
}
