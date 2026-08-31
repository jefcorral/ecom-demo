"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { SearchX, X } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { RecentSearchChips } from "@/components/recent-search-chips";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { saveRecentSearch, searchProducts } from "@/lib/search";

const suggestions = ["Birthday", "Romance", "Plants", "Best Sellers", "Same-Day"];

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const [input, setInput] = useState(query);
  const [sort, setSort] = useState("relevance");
  const results = useMemo(() => {
    const products = searchProducts(query);
    if (sort === "price-low") return [...products].sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === "price-high") return [...products].sort((a, b) => Number(b.price) - Number(a.price));
    return products;
  }, [query, sort]);

  useEffect(() => {
    if (query) saveRecentSearch(query);
  }, [query]);

  function submit(value = input) {
    const next = value.trim();
    if (!next) return;
    setInput(next);
    saveRecentSearch(next);
    router.push(`/search?q=${encodeURIComponent(next)}`);
  }

  return <div className="mx-auto w-full max-w-[1140px] px-4 py-10 md:px-6 md:py-16">
    <SearchInput value={input} onChange={setInput} onSubmit={() => submit()} className="mx-auto mb-10 max-w-2xl lg:hidden" />
    {!query ? <div className="mx-auto max-w-2xl space-y-10"><div className="text-center"><h1 className="font-serif text-3xl font-semibold text-on-surface">Find your perfect arrangement</h1><p className="mt-2 text-on-surface-variant">Search flowers, plants, gifts, and occasions.</p></div><RecentSearchChips onSelect={submit} /><section><h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant">Trending Now</h2><div className="space-y-2">{suggestions.slice(0, 3).map((item) => <button key={item} onClick={() => submit(item)} className="flex min-h-12 w-full items-center rounded-lg px-4 text-left hover:bg-secondary-container">{item}</button>)}</div></section></div> : <>
      <div className="mb-10"><h1 className="font-serif text-3xl font-semibold text-on-surface md:text-4xl">Results for “{query}”</h1><p aria-live="polite" className="mt-3 text-on-surface-variant">{results.length} {results.length === 1 ? "arrangement" : "arrangements"} found</p><div className="mt-6 flex flex-wrap items-center justify-between gap-4"><button onClick={() => router.push("/search")} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-primary-container px-4 text-xs font-semibold uppercase tracking-wider text-on-primary-container">{query}<X className="h-4 w-4" /></button><label className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider">Sort by:<select value={sort} onChange={(event) => setSort(event.target.value)} className="bg-transparent py-2 outline-none"><option value="relevance">Relevance</option><option value="price-low">Price: Low to High</option><option value="price-high">Price: High to Low</option></select></label></div></div>
      {results.length ? <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">{results.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState icon={SearchX} title={`No results for “${query}”`} description="Try a different search or browse our curated collections." action={<Button render={<Link href="/products" />}>Browse All Products</Button>} secondaryAction={<div className="flex flex-wrap justify-center gap-2">{suggestions.map((item) => <button key={item} onClick={() => submit(item)} className="rounded-full bg-surface-container px-3 py-2 text-sm hover:bg-primary-container">{item}</button>)}</div>} />}
    </>}
  </div>;
}

export default function SearchPage() {
  return <Suspense><SearchResults /></Suspense>;
}
