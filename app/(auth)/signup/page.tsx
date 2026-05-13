import { SignupForm } from "@/components/auth/signup-form";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedSearchParams = await searchParams;
  const nextPath =
    typeof resolvedSearchParams.next === "string" ? resolvedSearchParams.next : "/";

  return <SignupForm nextPath={nextPath} />;
}
