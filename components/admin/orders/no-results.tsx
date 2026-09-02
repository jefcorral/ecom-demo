"use client";

import { Flower2, Search, SearchX, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrdersNoResults({ search, onClear }: { search: string; onClear: () => void }) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-16 lg:py-12">
      <div className="mb-8 flex items-end justify-between border-b border-outline-variant/30 pb-4">
        <h1 className="font-serif text-4xl text-on-surface">
          Orders <span className="ml-2 text-2xl text-on-surface-variant">(0)</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/50" />
            <input
              disabled
              value={search}
              className="w-80 rounded-full bg-surface-container-low py-3 pl-12 pr-10 text-on-surface shadow-sm outline-none"
            />
            <button className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-surface-container-highest text-on-surface-variant transition-colors hover:bg-surface-variant">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <Button variant="outline" className="gap-2 rounded-full border-outline-variant/40 bg-surface-container px-5 py-5 text-on-surface">
            <SearchX className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="relative mb-8 flex h-48 w-48 items-center justify-center">
          <svg className="absolute inset-0 h-full w-full animate-[spin_60s_linear_infinite] text-surface-container-high" viewBox="0 0 100 100">
            <path
              d="M50 0 A 50 50 0 1 1 49.99 0"
              fill="currentColor"
              fillOpacity="0"
              stroke="currentColor"
              strokeDasharray="4 8"
              strokeWidth="2"
            />
          </svg>
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-surface-container-lowest shadow-lg">
            <Flower2 className="h-12 w-12 text-outline-variant/60" />
          </div>
          <div className="absolute -top-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-bright shadow-sm">
            <SearchX className="h-5 w-5 text-primary" />
          </div>
        </div>
        <h2 className="font-serif text-3xl text-on-surface">No orders found</h2>
        <p className="mt-2 max-w-md text-lg text-on-surface-variant">
          We couldn&apos;t find any orders matching &quot;<span className="font-medium text-on-surface">{search || "your search"}</span>&quot;.
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
          <Button onClick={onClear} className="rounded-full bg-primary px-8 py-5 text-on-primary shadow-primary/20 hover:shadow-lg hover:-translate-y-0.5">
            Clear all filters
          </Button>
          <button onClick={onClear} className="group relative text-primary hover:text-primary-fixed-dim">
            View all active orders
            <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        </div>
      </div>

      <div className="w-full py-8 text-center">
        <p className="relative inline-block text-xs font-medium uppercase tracking-widest text-on-surface-variant/50">
          <span className="absolute left-[-40px] top-1/2 h-px w-8 bg-outline-variant/30" />
          End of results
          <span className="absolute right-[-40px] top-1/2 h-px w-8 bg-outline-variant/30" />
        </p>
      </div>
    </div>
  );
}
