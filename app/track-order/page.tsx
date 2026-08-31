"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowRight, Hash, Mail, Truck } from "lucide-react";
import { TrackOrderResult } from "@/components/order-tracking/track-order-result";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<"idle" | "found" | "not-found">("idle");
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (result !== "idle") resultRef.current?.focus();
  }, [result]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!orderId.trim()) nextErrors.orderId = "Enter your order ID.";
    if (!emailPattern.test(email)) nextErrors.email = "Enter the email used for this order.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setLoading(true);
    setResult("idle");
    await new Promise((resolve) => setTimeout(resolve, 700));
    setLoading(false);
    setResult(orderId.trim().toUpperCase() === "BS-999999" ? "not-found" : "found");
  }

  if (result === "found") return <div ref={resultRef} tabIndex={-1} className="outline-none"><TrackOrderResult orderId={orderId.trim().toUpperCase()} /><div className="pb-10 text-center"><Button variant="ghost" onClick={() => setResult("idle")}>Track another order</Button></div></div>;

  return <div className="relative flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center overflow-hidden px-4 py-12 sm:min-h-[calc(100vh-4rem)]">
    <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(#e4e2dd_1px,transparent_1px)] [background-size:40px_40px]" />
    <section className="relative w-full max-w-[480px] rounded-lg bg-surface-container-lowest p-6 shadow-md motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 sm:p-10" aria-labelledby="track-order-title">
      {result === "not-found" && <div ref={resultRef} tabIndex={-1} className="mb-8 outline-none"><ErrorBanner message="Order not found. Please check your details." onRetry={() => setResult("idle")} /></div>}
      <header className="mb-8 text-center"><Truck className="mx-auto mb-3 size-12 text-[#785900]" strokeWidth={1.5} /><h1 id="track-order-title" className="font-serif text-3xl font-semibold text-on-surface">Track Your Order</h1><p className="mt-2 text-base text-on-surface-variant sm:text-lg">Enter your order details to check the status.</p></header>
      <form onSubmit={submit} className="space-y-5" noValidate>
        <Field id="order-id" label="Order ID" error={errors.orderId} icon={Hash}><Input id="order-id" value={orderId} onChange={(event) => setOrderId(event.target.value)} placeholder="e.g. BS-12345" disabled={loading} className="bg-surface-container pl-12" aria-invalid={!!errors.orderId} aria-describedby={errors.orderId ? "order-id-error" : undefined} /></Field>
        <Field id="track-email" label="Email Address" error={errors.email} icon={Mail}><Input id="track-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="hello@example.com" disabled={loading} className="bg-surface-container pl-12" aria-invalid={!!errors.email} aria-describedby={errors.email ? "track-email-error" : undefined} /></Field>
        <LoadingButton type="submit" loading={loading} loadingLabel="Finding your order..." className="w-full">Track Order<ArrowRight className="size-4" /></LoadingButton>
      </form>
      <p className="mt-8 text-center"><Link href="/login?returnUrl=%2Forders" className="inline-flex items-center gap-2 text-sm font-medium text-[#785900] hover:underline">Sign in for full order history <ArrowRight className="size-4" /></Link></p>
    </section>
    <div className="relative mt-10 max-w-sm text-center text-on-surface-variant"><Truck className="mx-auto mb-4 size-12 rounded-full bg-surface-container p-3" /><p>We&apos;ll send updates directly to your email as your blooms make their way to you.</p></div>
  </div>;
}

function Field({ id, label, error, icon: Icon, children }: { id: string; label: string; error?: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return <div><label htmlFor={id} className="mb-2 ml-2 block text-sm font-medium">{label}</label><div className="relative"><Icon className="pointer-events-none absolute left-4 top-1/2 z-10 size-5 -translate-y-1/2 text-on-surface-variant" />{children}</div>{error && <p id={`${id}-error`} className="mt-1 text-xs font-semibold text-error">{error}</p>}</div>;
}
