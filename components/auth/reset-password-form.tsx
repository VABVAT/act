"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { resetPasswordSchema } from "@/lib/validations/auth";

import { Button } from "@/components/ui/button";
import { FormField, FormNote } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export function ResetPasswordForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <form
      className="grid gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setError(null);
        setMessage(null);

        const formData = new FormData(event.currentTarget);
        const parsed = resetPasswordSchema.safeParse({
          password: formData.get("password"),
          confirmPassword: formData.get("confirmPassword"),
        });

        if (!parsed.success) {
          setError(parsed.error.flatten().fieldErrors.password?.[0] || parsed.error.flatten().fieldErrors.confirmPassword?.[0] || "Please fix the form.");
          return;
        }

        startTransition(async () => {
          try {
            const supabase = createBrowserSupabaseClient();
            const { error: updateError } = await supabase.auth.updateUser({
              password: parsed.data.password,
            });

            if (updateError) {
              setError(updateError.message);
              return;
            }

            setMessage("Password updated. Redirecting to login...");
            router.push("/login");
          } catch (caughtError) {
            setError(
              caughtError instanceof Error
                ? caughtError.message
                : "Unable to update your password.",
            );
          }
        });
      }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
          Choose a new password
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none text-foreground">
          Set your new password
        </h2>
      </div>
      <FormField label="New password">
        <Input autoComplete="new-password" name="password" type="password" />
      </FormField>
      <FormField label="Confirm password">
        <Input autoComplete="new-password" name="confirmPassword" type="password" />
      </FormField>
      {error ? <FormNote tone="danger">{error}</FormNote> : null}
      {message ? <FormNote tone="success">{message}</FormNote> : null}
      <Button className="w-full" disabled={isPending} size="lg" type="submit">
        {isPending ? "Updating..." : "Update password"}
      </Button>
      <Link href="/login" className="text-sm font-semibold text-foreground">
        Back to login
      </Link>
    </form>
  );
}
