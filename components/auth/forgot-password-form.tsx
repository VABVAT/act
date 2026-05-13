"use client";

import Link from "next/link";
import { useActionState } from "react";

import { forgotPasswordAction } from "@/app/actions/auth";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormField, FormNote } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/utils/action-state";

export function ForgotPasswordForm() {
  const [state, action] = useActionState(forgotPasswordAction, initialActionState);

  return (
    <form action={action} className="grid gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
          Reset password
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none text-foreground">
          Recover your account
        </h2>
      </div>
      <FormField error={state.fieldErrors?.email?.[0]} label="Email">
        <Input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
      </FormField>
      {state.message ? (
        <FormNote tone={state.status === "success" ? "success" : "danger"}>
          {state.message}
        </FormNote>
      ) : null}
      <AuthSubmitButton>Send reset link</AuthSubmitButton>
      <Link href="/login" className="text-sm font-semibold text-foreground">
        Back to login
      </Link>
    </form>
  );
}
