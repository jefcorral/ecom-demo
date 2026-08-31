"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { AuthSubmitButton, AuthSuccess, CheckboxField, FormErrorSummary, FormField, PasswordInput } from "@/components/auth/auth-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const initialForm = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [terms, setTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (!emailPattern.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (form.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords do not match.";
    if (!terms) nextErrors.terms = "Accept the terms to create an account.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    setSuccess(true);
  }

  return (
    <AuthCard title="Create Your Account" description="Save your favorites and make every delivery effortless.">
      {success ? (
        <AuthSuccess title="Check your email" message={`We sent a confirmation link to ${form.email}.`}><Button render={<Link href="/login" />} className="w-full">Continue to Sign In</Button></AuthSuccess>
      ) : (
        <>
          <form onSubmit={submit} className="space-y-5" noValidate>
            <FormErrorSummary message={Object.keys(errors).length ? "Please complete the required fields below." : undefined} />
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormField id="firstName" label="First name" error={errors.firstName}><Input id="firstName" autoComplete="given-name" value={form.firstName} onChange={(event) => update("firstName", event.target.value)} disabled={loading} aria-invalid={!!errors.firstName} aria-describedby={errors.firstName ? "firstName-error" : undefined} /></FormField>
              <FormField id="lastName" label="Last name" error={errors.lastName}><Input id="lastName" autoComplete="family-name" value={form.lastName} onChange={(event) => update("lastName", event.target.value)} disabled={loading} aria-invalid={!!errors.lastName} aria-describedby={errors.lastName ? "lastName-error" : undefined} /></FormField>
            </div>
            <FormField id="email" label="Email address" error={errors.email}><Input id="email" type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="you@example.com" disabled={loading} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-error" : undefined} /></FormField>
            <FormField id="password" label="Password" error={errors.password}><PasswordInput id="password" autoComplete="new-password" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="At least 8 characters" disabled={loading} error={errors.password} /></FormField>
            <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword}><PasswordInput id="confirmPassword" autoComplete="new-password" value={form.confirmPassword} onChange={(event) => update("confirmPassword", event.target.value)} placeholder="Repeat your password" disabled={loading} error={errors.confirmPassword} /></FormField>
            <CheckboxField id="terms" checked={terms} onChange={setTerms} error={errors.terms}>I agree to the <Link href="#" className="font-medium text-[#8a6700] hover:underline">Terms</Link> and <Link href="#" className="font-medium text-[#8a6700] hover:underline">Privacy Policy</Link>.</CheckboxField>
            <AuthSubmitButton loading={loading}>{loading ? "Creating account..." : "Create Account"}</AuthSubmitButton>
          </form>
          <p className="mt-6 text-center text-sm text-on-surface-variant">Already have an account? <Link href="/login" className="font-semibold text-[#8a6700] hover:underline">Sign in</Link></p>
        </>
      )}
    </AuthCard>
  );
}
