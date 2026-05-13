"use client";

import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";

export function AuthSubmitButton({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full" disabled={pending} size="lg" type="submit">
      {pending ? "Please wait..." : children}
    </Button>
  );
}
