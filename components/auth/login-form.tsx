"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "@/app/actions/auth";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { FormField, FormNote } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { initialActionState } from "@/lib/utils/action-state";

export function LoginForm({ nextPath = "/" }: { nextPath?: string }) {
  const [state, action] = useActionState(loginAction, initialActionState);

  return (
    <form action={action} className="grid gap-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand">
          Welcome back
        </p>
        <h2 className="mt-3 font-display text-4xl leading-none text-foreground">
          Login to continue
        </h2>
        <p className="mt-3 text-sm text-muted">
          WhatsApp inquiries work without login. Sign in only if you want to save your wishlist and details.
        </p>
      </div>
      <input name="next" type="hidden" value={nextPath} />
      <FormField error={state.fieldErrors?.email?.[0]} label="Email">
        <Input autoComplete="email" name="email" placeholder="you@example.com" type="email" />
      </FormField>
      <FormField error={state.fieldErrors?.password?.[0]} label="Password">
        <Input
          autoComplete="current-password"
          name="password"
          placeholder="Enter your password"
          type="password"
        />
      </FormField>
      {state.message ? <FormNote tone="danger">{state.message}</FormNote> : null}
      <AuthSubmitButton>Login</AuthSubmitButton>
      <div className="flex items-center justify-between text-sm text-muted">
        <Link href="/forgot-password" className="hover:text-foreground">
          Forgot password?
        </Link>
        <Link href={`/signup${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`} className="hover:text-foreground">
          Create account
        </Link>
      </div>
    </form>
  );
}
