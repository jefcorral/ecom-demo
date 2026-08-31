"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AlertCircle } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthSubmitButton, AuthSuccess, FormErrorSummary, FormField, PasswordInput } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    setSuccess(true);
  }

  if (!token) {
    return (
      <AuthCard title="Reset Link Invalid" description="This password reset link is missing, invalid, or has expired.">
        <div role="alert" className="mb-5 flex items-start gap-3 rounded-md bg-error-container p-4 text-sm text-on-error-container"><AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />Request a new link to securely reset your password.</div>
        <Button render={<Link href="/forgot-password" />} className="w-full">Request New Link</Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Set a New Password" description="Choose a secure password you haven’t used before.">
      {success ? (
        <AuthSuccess title="Password Updated!" message="Your password has been changed successfully."><Button render={<Link href="/login" />} className="w-full">Sign In</Button></AuthSuccess>
      ) : (
        <form onSubmit={submit} className="space-y-5" noValidate>
          <FormErrorSummary message={Object.keys(errors).length ? "Please check the passwords below." : undefined} />
          <FormField id="password" label="New password" error={errors.password}><PasswordInput id="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" disabled={loading} error={errors.password} /></FormField>
          <FormField id="confirmPassword" label="Confirm new password" error={errors.confirmPassword}><PasswordInput id="confirmPassword" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} placeholder="Repeat your password" disabled={loading} error={errors.confirmPassword} /></FormField>
          <AuthSubmitButton loading={loading}>{loading ? "Updating password..." : "Update Password"}</AuthSubmitButton>
        </form>
      )}
    </AuthCard>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetPasswordForm /></Suspense>;
}
