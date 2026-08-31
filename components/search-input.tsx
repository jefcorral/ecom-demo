"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput({ value, onChange, onSubmit, loading = false, autoFocus = false, className, placeholder = "Search bouquets, plants, occasions…" }: { value: string; onChange: (value: string) => void; onSubmit: () => void; loading?: boolean; autoFocus?: boolean; className?: string; placeholder?: string }) {
  return <div className={cn("relative", className)}><Search className={cn("pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant", loading && "animate-pulse")} /><input type="search" aria-label="Search products" value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); onSubmit(); } }} placeholder={placeholder} autoFocus={autoFocus} className="h-12 w-full rounded-full border border-outline-variant bg-surface-container-low pl-12 pr-12 text-base text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/25" />{value && <button type="button" onClick={() => onChange("")} aria-label="Clear search" className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"><X className="h-4 w-4" /></button>}</div>;
}
