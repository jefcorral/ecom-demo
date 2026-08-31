"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Apple, LockKeyhole, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthSubmitButton, FormErrorSummary, FormField, PasswordInput } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!emailPattern.test(email)) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Password must be at least 8 characters.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    if (remember) localStorage.setItem("bloom-remember-email", email);
    const returnUrl = searchParams.get("returnUrl");
    router.push(returnUrl?.startsWith("/") && !returnUrl.startsWith("//") ? returnUrl : "/");
  }

  return (
    <AuthCard title="Welcome Back" description="Sign in to your Bloom & Stem account">
      <form onSubmit={submit} className="space-y-5" noValidate>
        <FormErrorSummary message={Object.keys(errors).length ? "Please check the highlighted fields and try again." : undefined} />
        <FormField id="email" label="Email address" error={errors.email}>
          <div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-outline-variant md:hidden" /><Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="hello@example.com" className="pl-12 md:pl-4" disabled={loading} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} /></div>
        </FormField>
        <FormField id="password" label="Password" error={errors.password}>
          <PasswordInput id="password" icon={LockKeyhole} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" disabled={loading} error={errors.password} />
        </FormField>
        <div className="flex items-center justify-end gap-4 text-sm sm:justify-between">
          <label className="hidden cursor-pointer items-center gap-2 text-on-surface-variant sm:flex"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="h-4 w-4 accent-[#785900]" />Remember me</label>
          <Link href="/forgot-password" className="font-medium text-[#785900] hover:underline">Forgot your password?</Link>
        </div>
        <AuthSubmitButton loading={loading}>{loading ? "Signing in..." : "Sign In"}</AuthSubmitButton>
      </form>
      <div className="my-6 hidden items-center gap-3 text-xs uppercase tracking-wider text-outline sm:flex"><span className="h-px flex-1 bg-outline-variant" /><span>Or continue with</span><span className="h-px flex-1 bg-outline-variant" /></div>
      <div className="hidden grid-cols-1 gap-2 sm:grid">
        <Button type="button" variant="outline" aria-label="Continue with Google" onClick={() => setErrors({ summary: "Social sign-in is coming soon." })}><span className="font-semibold">G</span>Google</Button>
        <Button type="button" variant="outline" aria-label="Continue with Apple" onClick={() => setErrors({ summary: "Social sign-in is coming soon." })}><Apple className="h-4 w-4" />Apple</Button>
      </div>
      {errors.summary && <p role="status" className="mt-3 text-center text-sm text-on-surface-variant">{errors.summary}</p>}
      <p className="mt-6 text-center text-sm text-on-surface-variant">Don&apos;t have an account? <Link href="/register" className="font-semibold text-[#785900] hover:underline">Create one</Link></p>
    </AuthCard>
  );
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}
