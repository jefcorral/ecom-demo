"use client";

import Link from "next/link";
import { useState } from "react";
import { Flower2, Truck, BadgeCheck, Leaf, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const trustSignals = [
  { icon: Truck, label: "Same-Day Delivery" },
  { icon: BadgeCheck, label: "Freshness Guaranteed" },
  { icon: Leaf, label: "Locally Sourced" },
  { icon: Palette, label: "Designed by Florists" },
];

const footerLinks = [
  {
    title: "Shop",
    links: [
      { label: "All Arrangements", href: "/products" },
      { label: "Best Sellers", href: "/products" },
      { label: "Subscriptions", href: "#" },
      { label: "Gifts & Extras", href: "/products?categoryId=gifts" },
    ],
  },
  {
    title: "Occasions",
    links: [
      { label: "Anniversary", href: "/products?search=Anniversary" },
      { label: "Birthday", href: "/products?search=Birthday" },
      { label: "Sympathy", href: "/products?search=Sympathy" },
      { label: "Just Because", href: "/products?search=Just Because" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ", href: "#" },
      { label: "Track Order", href: "/orders" },
      { label: "Delivery Info", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Journal", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
];

export function SiteFooter() {
  const [email, setEmail] = useState("");

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setEmail("");
  }

  return (
    <footer className="mt-auto">
      <section className="bg-secondary-container py-10 lg:py-14">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-6 px-4 lg:flex-row lg:justify-between lg:gap-10 lg:px-6">
          <div className="text-center lg:text-left">
            <h2 className="font-serif text-2xl font-semibold text-on-secondary-container lg:text-3xl">Join the Bloom Club</h2>
            <p className="mt-2 max-w-md text-on-secondary-container/80">
              Get 15% off your first order, plus editorial floral tips and exclusive early access to seasonal curations.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full max-w-md gap-2">
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 flex-1 rounded-full border-outline-variant bg-surface-container-lowest px-5 text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            <Button
              type="submit"
              className="h-12 rounded-full bg-primary px-6 text-on-primary hover:bg-primary/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </section>

      <section className="border-y border-outline-variant/30 bg-surface-container-low py-6">
        <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-6 px-4 md:grid-cols-4 lg:px-6">
          {trustSignals.map(({ icon: Icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2 text-center md:flex-row md:text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-inverse-surface py-10 text-inverse-on-surface lg:py-14">
        <div className="mx-auto grid max-w-[1140px] gap-10 px-4 lg:grid-cols-5 lg:px-6">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Flower2 className="h-6 w-6 text-primary-fixed-dim" />
              <span className="font-serif text-xl font-semibold">Bloom & Stem</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-inverse-on-surface/70">
              Artisanal florals for life&apos;s most beautiful moments. Hand-tied with care, delivered with love.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {footerLinks.map((group) => (
              <div key={group.title}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-inverse-on-surface/50">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-inverse-on-surface/80 transition-colors hover:text-inverse-on-surface"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-inverse-surface py-6 text-inverse-on-surface">
        <div className="mx-auto flex max-w-[1140px] flex-col items-center gap-4 px-4 lg:flex-row lg:justify-between lg:px-6">
          <p className="text-sm text-inverse-on-surface/50">© {new Date().getFullYear()} Bloom & Stem. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <SocialLink href="#" label="Facebook">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </SocialLink>
            <SocialLink href="#" label="Instagram">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </SocialLink>
            <SocialLink href="#" label="Twitter">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </SocialLink>
          </div>
          <div className="flex gap-4 text-xs font-medium uppercase tracking-wider text-inverse-on-surface/50">
            <Link href="#" className="hover:text-inverse-on-surface">Privacy</Link>
            <span>|</span>
            <Link href="#" className="hover:text-inverse-on-surface">Terms</Link>
            <span>|</span>
            <Link href="#" className="hover:text-inverse-on-surface">Sitemap</Link>
          </div>
        </div>
      </section>
    </footer>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="text-inverse-on-surface/50 transition-colors hover:text-inverse-on-surface"
    >
      {children}
    </Link>
  );
}
