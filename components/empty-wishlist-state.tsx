"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestionChips = [
  { label: "Birthday", href: "/products?categoryId=cat-1" },
  { label: "Romance", href: "/products?categoryId=cat-2" },
  { label: "Plants", href: "/products?categoryId=cat-4" },
  { label: "Same-Day", href: "/products" },
];

export function EmptyWishlistState() {
  return (
    <main className="min-h-screen bg-[#fbf9f4] px-4 py-16 md:py-24">
      <div className="mx-auto flex max-w-md flex-col items-center justify-center text-center">
        <div className="relative mb-6 flex h-36 w-36 items-center justify-center rounded-full bg-surface-container-low p-6">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="h-24 w-24 text-[#5C6B58]" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M35 85 C35 65 30 55 40 38 L60 38 C70 55 65 65 65 85 Z" />
            <ellipse cx="50" cy="38" rx="10" ry="3" />
            <line x1="38" y1="85" x2="62" y2="85" strokeWidth="2" />
            <path d="M48 38 C45 25 40 18 35 12" />
            <path d="M52 38 C55 28 62 20 68 15" />
            <path d="M50 38 C50 25 52 18 50 10" />
            <path d="M25 82 C22 78 28 75 25 82" className="fill-[#f7dcdc]" />
            <path d="M72 80 C76 77 74 83 72 80" className="fill-[#f7dcdc]" />
          </svg>
          <Sparkles className="absolute top-2 right-2 h-5 w-5 text-[#F2B705] animate-pulse" />
        </div>

        <h1 className="font-serif text-3xl font-semibold text-[#1b1c19] md:text-4xl">
          No favorites yet
        </h1>

        <p className="mt-3 text-base text-[#454840] md:text-lg">
          Save the bouquets you love by tapping the heart icon.
        </p>

        <Link href="/products" className="mt-8">
          <Button className="rounded-full bg-[#F2B705] px-8 py-3 text-sm font-bold text-[#1b1c19] shadow-md transition-all hover:bg-[#F2B705]/90">
            Browse Best Sellers
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>

        <div className="mt-10 flex flex-col items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#454840]">
            Quick Suggestions
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {suggestionChips.map((chip) => (
              <Link key={chip.label} href={chip.href}>
                <span className="inline-flex items-center rounded-full bg-surface-container-high px-4 py-1.5 text-xs font-medium text-[#1b1c19] transition-colors hover:bg-primary-container hover:text-on-primary-container">
                  {chip.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
