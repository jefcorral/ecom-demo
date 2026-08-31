"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthSubmitButton, AuthSuccess, FormErrorSummary, FormField } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    setSuccess(true);
  }

  return (
    <AuthCard title="Reset Your Password" description="Enter your email and we’ll send you a secure reset link.">
      {success ? (
        <AuthSuccess title="Check your email" message="If an account exists for this email, a reset link has been sent."><Button render={<Link href="/login" />} variant="outline" className="w-full"><ArrowLeft className="h-4 w-4" />Back to Sign In</Button></AuthSuccess>
      ) : (
        <>
          <form onSubmit={submit} className="space-y-5" noValidate>
            <FormErrorSummary message={error ? "Please enter a valid email address." : undefined} />
            <FormField id="email" label="Email address" error={error}><Input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={loading} aria-invalid={!!error} aria-describedby={error ? "email-error" : undefined} /></FormField>
            <AuthSubmitButton loading={loading}>{loading ? "Sending link..." : "Send Reset Link"}</AuthSubmitButton>
          </form>
          <Link href="/login" className="mt-6 flex items-center justify-center gap-2 text-sm font-semibold text-[#8a6700] hover:underline"><ArrowLeft className="h-4 w-4" />Back to Sign In</Link>
        </>
      )}
    </AuthCard>
  );
}
