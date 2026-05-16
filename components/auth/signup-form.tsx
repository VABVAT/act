"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signupAction } from "@/app/actions/auth";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormField, FormNote } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/utils/action-state";

export function SignupForm({ nextPath = "/" }: { nextPath?: string }) {
  const [state, action] = useActionState(signupAction, initialActionState);

  return (
    <form action={action} className="grid gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
          Create account
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none text-foreground">
          Start your Arteez account
        </h2>
        <p className="mt-3 text-sm text-muted">
          No email verification required. Create your account and continue right away.
        </p>
      </div>
      <input name="next" type="hidden" value={nextPath} />
      <FormField error={state.fieldErrors?.fullName?.[0]} label="Full name">
        <Input autoComplete="name" name="fullName" placeholder="Your name" />
      </FormField>
      <FormField error={state.fieldErrors?.email?.[0]} label="Email">
        <Input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
      </FormField>
      <FormField error={state.fieldErrors?.phone?.[0]} label="Phone number">
        <Input autoComplete="tel" name="phone" placeholder="9876543210" type="tel" />
      </FormField>
      <FormField error={state.fieldErrors?.password?.[0]} label="Password">
        <Input
          autoComplete="new-password"
          name="password"
          placeholder="Create a password"
          type="password"
        />
      </FormField>
      {state.message ? (
        <FormNote tone="danger">{state.message}</FormNote>
      ) : null}
      <AuthSubmitButton>Create account</AuthSubmitButton>
      <p className="text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={`/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`}
          className="font-semibold text-foreground"
        >
          Login
        </Link>
      </p>
    </form>
  );
}
