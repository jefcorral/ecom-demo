"use client";

import { FormEvent, useState } from "react";
import { Check, LoaderCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setLoading(false);
    setSubscribed(true);
  }

  return (
    <section aria-labelledby="newsletter-title" className="bg-secondary-container px-4 py-12 md:px-6 md:py-14">
      <div className="mx-auto flex max-w-[1140px] flex-col items-center justify-between gap-8 md:flex-row">
        <div className="max-w-xl text-center md:text-left">
          <Mail className="mx-auto mb-3 h-7 w-7 text-primary md:hidden" />
          <h2 id="newsletter-title" className="font-serif text-3xl font-semibold text-on-secondary-container">Join the Bloom Club</h2>
          <p className="mt-2 text-base leading-6 text-on-secondary-container/80">Get 15% off your first order, plus editorial floral tips and exclusive early access to seasonal curations.</p>
        </div>
        <div className="w-full max-w-md">
          {subscribed ? <div role="status" className="flex h-14 items-center justify-center gap-3 rounded-full bg-surface-container-lowest px-5 font-medium text-on-surface shadow-sm motion-safe:animate-in motion-safe:zoom-in-95"><Check className="h-5 w-5 text-primary" />Welcome to the club!</div> : <form onSubmit={submit} noValidate><label htmlFor="newsletter-email" className="sr-only">Email address</label><div className="relative"><Input id="newsletter-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email address" disabled={loading} aria-invalid={!!error} aria-describedby={error ? "newsletter-error" : "newsletter-terms"} className="h-14 rounded-md bg-surface-container-lowest pr-32 md:rounded-full" /><Button type="submit" disabled={loading} className="absolute bottom-1.5 right-1.5 top-1.5 h-auto rounded-md px-5 uppercase tracking-wider md:rounded-full">{loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Subscribe"}</Button></div>{error && <p id="newsletter-error" className="mt-2 text-xs font-semibold text-error">{error}</p>}<p id="newsletter-terms" className="mt-2 text-center text-[11px] text-on-secondary-container/70 md:text-left">By subscribing, you agree to our Terms &amp; Privacy Policy.</p></form>}
        </div>
      </div>
    </section>
  );
}
