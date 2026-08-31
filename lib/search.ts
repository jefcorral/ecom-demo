import { mockProducts } from "@/lib/mock-data";
import type { Product } from "@/types";

const STORAGE_KEY = "bloom-recent-searches";
const MAX_RECENT = 6;

export const defaultRecentSearches = ["Peonies", "Birthday Bouquets", "Ranunculus"];
export const trendingSearches = ["Seasonal Tulip Arrangements", "Low-Light Indoor Plants", "Artisanal Gift Hampers"];

export function searchProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return mockProducts.filter((product) => [product.name, product.description, product.category?.name].filter(Boolean).some((value) => value!.toLowerCase().includes(normalized)));
}

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return defaultRecentSearches;
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(stored) && stored.length ? stored.filter((value): value is string => typeof value === "string").slice(0, MAX_RECENT) : defaultRecentSearches;
  } catch {
    return defaultRecentSearches;
  }
}

export function saveRecentSearch(query: string): string[] {
  const value = query.trim();
  if (!value || typeof window === "undefined") return getRecentSearches();
  const next = [value, ...getRecentSearches().filter((item) => item.toLowerCase() !== value.toLowerCase())].slice(0, MAX_RECENT);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("bloom-search-history"));
  return next;
}

export function clearRecentSearches() {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, "[]");
  window.dispatchEvent(new Event("bloom-search-history"));
}
