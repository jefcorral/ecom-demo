"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X, Search, ChevronDown, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { PaginationControls } from "@/components/pagination-controls";
import { Category, Product, ProductsResponse } from "@/types";

const LIMIT = 24;

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type CatalogState =
  | { status: "loading" }
  | { status: "success"; response: ProductsResponse }
  | { status: "error" };

type CatalogAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; response: ProductsResponse }
  | { type: "FETCH_ERROR" };

function catalogReducer(_state: CatalogState, action: CatalogAction): CatalogState {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading" };
    case "FETCH_SUCCESS":
      return { status: "success", response: action.response };
    case "FETCH_ERROR":
      return { status: "error" };
    default:
      return _state;
  }
}

interface ProductCatalogProps {
  categories: Category[];
}

export function ProductCatalog({ categories }: ProductCatalogProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const categoryId = searchParams.get("categoryId") ?? "";
  const sort = searchParams.get("sort") ?? "featured";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const [state, dispatch] = useReducer(catalogReducer, { status: "loading" });
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });

    import("@/lib/products")
      .then(({ fetchProducts }) =>
        fetchProducts({
          search: search || undefined,
          categoryId: categoryId || undefined,
          page,
          limit: LIMIT,
        })
      )
      .then((response) => dispatch({ type: "FETCH_SUCCESS", response }))
      .catch(() => dispatch({ type: "FETCH_ERROR" }));
  }, [search, categoryId, page]);

  let sortedProducts: Product[] = [];
  if (state.status === "success") {
    sortedProducts = [...state.response.data];
    switch (sort) {
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        sortedProducts.sort((a, b) => Number(a.price) - Number(b.price));
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => Number(b.price) - Number(a.price));
        break;
    }
  }

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "featured") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
    });
    next.delete("page");
    router.push(`/products?${next.toString()}`, { scroll: false });
  }

  function setCategory(id: string) {
    updateParams({ categoryId: id });
  }

  function setSort(value: string | null) {
    updateParams({ sort: value ?? null });
  }

  function clearAll() {
    setSearchInput("");
    updateParams({ search: null, categoryId: null, sort: null });
  }

  function setSearchValue(value: string) {
    updateParams({ search: value });
  }

  function goToPage(newPage: number) {
    const next = new URLSearchParams(searchParams.toString());
    if (newPage <= 1) {
      next.delete("page");
    } else {
      next.set("page", String(newPage));
    }
    router.push(`/products?${next.toString()}`, { scroll: false });
  }

  const activeCategoryName = categoryId
    ? categories.find((c) => c.id === categoryId)?.name ?? categoryId
    : null;

  const hasActiveFilters = Boolean(search || categoryId);

  return (
    <div className="mx-auto max-w-[1140px] px-4 lg:px-6">
      <div className="border-b border-outline-variant/30 bg-surface-container-lowest py-6 lg:py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-2xl font-semibold text-primary lg:text-3xl">Shop All Flowers</h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              {state.status === "loading"
                ? "Loading arrangements..."
                : state.status === "success"
                  ? `${state.response.pagination.total} arrangements`
                  : "Arrangements"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
              <Input
                type="search"
                placeholder="Search bouquets, plants..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setSearchValue(searchInput);
                  }
                }}
                className="h-10 rounded-full border-outline-variant bg-surface-container-low pl-9 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:ring-1 focus:ring-primary/20"
              />
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="h-10 w-auto gap-2 rounded-full border-outline-variant bg-surface-container-low px-4 text-sm text-on-surface hover:bg-surface-container-high focus:ring-1 focus:ring-primary/20 [&>svg]:hidden">
                <span className="hidden sm:inline">Sort by:</span>
                <SelectValue placeholder="Sort" />
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-outline-variant/30 bg-surface-container-lowest">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="rounded-lg text-on-surface focus:bg-surface-container focus:text-on-surface"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 py-8 lg:flex-row lg:gap-10">
        <ProductFilters
          categories={categories}
          activeCategoryId={categoryId}
          onCategoryChange={setCategory}
        />

        <div className="min-w-0 flex-1">
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Active:</span>
              {search && (
                <FilterChip
                  label={`Search: ${search}`}
                  onRemove={() => {
                    setSearchInput("");
                    setSearchValue("");
                  }}
                />
              )}
              {activeCategoryName && (
                <FilterChip
                  label={activeCategoryName}
                  onRemove={() => setCategory("")}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="text-xs font-semibold text-primary hover:text-on-primary-container hover:bg-transparent"
              >
                Clear All
              </Button>
            </div>
          )}

          {state.status === "loading" ? (
            <ProductGridSkeleton />
          ) : state.status === "error" ? (
            <EmptyState
              title="Could not load products"
              message="Make sure the API is running and try again."
            />
          ) : sortedProducts.length === 0 ? (
            <EmptyState
              title="No arrangements found"
              message="Try adjusting your search or filters to find what you're looking for."
              action={
                <Button
                  onClick={clearAll}
                  className="rounded-full bg-primary px-6 text-on-primary hover:bg-primary/90"
                >
                  Clear All Filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {state.response.pagination.totalPages > 1 && (
                <div className="mt-10">
                  <PaginationControls
                    page={state.response.pagination.page}
                    totalPages={state.response.pagination.totalPages}
                    onPageChange={goToPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant/30 bg-surface-container px-3 py-1.5 text-sm text-on-surface">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="rounded-full p-0.5 text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: LIMIT }).map((_, i) => (
        <Skeleton key={i} className="h-[380px] w-full rounded-2xl" />
      ))}
    </div>
  );
}

function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-surface-container-low px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-container">
        <Leaf className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mt-6 font-serif text-2xl font-semibold text-on-surface">{title}</h2>
      <p className="mt-2 max-w-sm text-on-surface-variant">{message}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
