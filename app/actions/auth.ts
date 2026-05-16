"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { initialActionState, type ActionState } from "@/lib/utils/action-state";
import {
  getSiteUrl,
  isSupabaseAdminConfigured,
  isSupabaseConfigured,
} from "@/lib/utils/env";
import {
  forgotPasswordSchema,
  loginSchema,
  signupSchema,
} from "@/lib/validations/auth";

function actionError(message: string, fieldErrors?: Record<string, string[] | undefined>) {
  return {
    status: "error",
    message,
    fieldErrors,
  } satisfies ActionState;
}

export async function loginAction(
  previousState: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  void previousState;

  if (!isSupabaseConfigured()) {
    return actionError("Supabase is not configured yet.");
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  const nextPath =
    typeof formData.get("next") === "string" && formData.get("next")
      ? String(formData.get("next"))
      : "/";

  if (!parsed.success) {
    return actionError("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return actionError(error.message);
  }

  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function signupAction(
  previousState: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  void previousState;

  if (!isSupabaseConfigured()) {
    return actionError("Supabase is not configured yet.");
  }

  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });
  const nextPath =
    typeof formData.get("next") === "string" && formData.get("next")
      ? String(formData.get("next"))
      : "/";

  if (!parsed.success) {
    return actionError("Please fix the highlighted fields.", parsed.error.flatten().fieldErrors);
  }

  if (!isSupabaseAdminConfigured()) {
    return actionError("Sign up is temporarily unavailable. Please try again shortly.");
  }

  const admin = createAdminSupabaseClient();
  const { error: createUserError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    email_confirm: true,
    password: parsed.data.password,
    user_metadata: {
      full_name: parsed.data.fullName,
      phone: parsed.data.phone,
    },
  });

  if (createUserError) {
    return actionError(createUserError.message);
  }

  const supabase = await createServerSupabaseClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError) {
    return actionError(signInError.message);
  }

  revalidatePath("/", "layout");
  redirect(nextPath);
}

export async function forgotPasswordAction(
  previousState: ActionState = initialActionState,
  formData: FormData,
): Promise<ActionState> {
  void previousState;

  if (!isSupabaseConfigured()) {
    return actionError("Supabase is not configured yet.");
  }

  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return actionError("Please enter a valid email address.", parsed.error.flatten().fieldErrors);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteUrl()}/auth/confirm?next=/reset-password`,
  });

  if (error) {
    return actionError(error.message);
  }

  return {
    status: "success",
    message:
      "We have sent a password reset link to your email address. Open the email and press the button inside it to continue.",
  };
}

export async function logoutAction() {
  if (!isSupabaseConfigured()) {
    redirect("/");
  }

  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
