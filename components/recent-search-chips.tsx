"use client";

import { useEffect, useState } from "react";
import { History } from "lucide-react";
import { clearRecentSearches, getRecentSearches } from "@/lib/search";

export function RecentSearchChips({ onSelect, showClear = true }: { onSelect: (query: string) => void; showClear?: boolean }) {
  const [items, setItems] = useState<string[]>([]);
  useEffect(() => {
    const update = () => setItems(getRecentSearches());
    update();
    window.addEventListener("bloom-search-history", update);
    return () => window.removeEventListener("bloom-search-history", update);
  }, []);
  if (!items.length) return null;
  return <section aria-labelledby="recent-searches-title"><div className="mb-3 flex items-center justify-between"><h2 id="recent-searches-title" className="text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">Recent Searches</h2>{showClear && <button type="button" onClick={() => { clearRecentSearches(); setItems([]); }} className="text-xs font-medium text-primary hover:underline">Clear Recent</button>}</div><div className="flex flex-wrap gap-2">{items.map((item, index) => <button key={item} type="button" onClick={() => onSelect(item)} style={{ animationDelay: `${index * 35}ms` }} className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-surface-container px-3 py-2 text-sm text-on-surface transition hover:bg-primary hover:text-on-primary active:scale-95 motion-safe:animate-in motion-safe:fade-in"><History className="h-3.5 w-3.5" />{item}</button>)}</div></section>;
}
