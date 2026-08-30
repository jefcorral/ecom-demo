"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Search, ChevronDown, Leaf } from "lucide-react";
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

const PRICE_OPTIONS = [
  { value: "under-50", label: "Under $50" },
  { value: "50-100", label: "$50 - $100" },
  { value: "100-150", label: "$100 - $150" },
  { value: "over-150", label: "Over $150" },
];

const SORT_OPTIONS = [
  { value: "best-sellers", label: "Best Sellers" },
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
  const priceRange = searchParams.get("priceRange") ?? "";
  const sameDay = searchParams.get("sameDay") === "true";
  const inStock = searchParams.get("inStock") === "true";
  const sort = searchParams.get("sort") ?? "best-sellers";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const [state, dispatch] = useReducer(catalogReducer, { status: "loading" });
  const [searchInput, setSearchInput] = useState(search);

  const activeFilterCount =
    (search ? 1 : 0) +
    (categoryId ? 1 : 0) +
    (priceRange ? 1 : 0) +
    (sameDay ? 1 : 0) +
    (inStock ? 1 : 0);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });

    import("@/lib/products")
      .then(({ fetchProducts }) =>
        fetchProducts({
          search: search || undefined,
          categoryId: categoryId || undefined,
          priceRange: priceRange || undefined,
          sameDay: sameDay ? "true" : undefined,
          inStock: inStock ? "true" : undefined,
          page,
          limit: LIMIT,
        })
      )
      .then((response) => dispatch({ type: "FETCH_SUCCESS", response }))
      .catch(() => dispatch({ type: "FETCH_ERROR" }));
  }, [search, categoryId, priceRange, sameDay, inStock, page]);

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
      default:
        sortedProducts.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }
  }

  function updateParams(updates: Record<string, string | null>) {
    const next = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "best-sellers" || value === "false") {
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

  function setPriceRange(value: string) {
    updateParams({ priceRange: value === priceRange ? "" : value });
  }

  function setSameDay(value: boolean) {
    updateParams({ sameDay: value ? "true" : null });
  }

  function setInStock(value: boolean) {
    updateParams({ inStock: value ? "true" : null });
  }

  function setSort(value: string | null) {
    updateParams({ sort: value ?? null });
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

  function clearAll() {
    setSearchInput("");
    updateParams({ search: null, categoryId: null, priceRange: null, sameDay: null, inStock: null, sort: null });
  }

  const activeCategoryName = categoryId
    ? categories.find((c) => c.id === categoryId)?.name ?? categoryId
    : null;
  const activePriceLabel = PRICE_OPTIONS.find((p) => p.value === priceRange)?.label ?? null;

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <div className="mx-auto max-w-[1140px] px-6">
      <div className="sticky top-16 z-40 border-b border-outline-variant/30 bg-surface-container-lowest py-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-serif text-3xl font-semibold tracking-tight text-primary">Shop All Flowers</h1>
            <p className="mt-1 text-base text-on-surface-variant">
              {state.status === "loading"
                ? "Loading arrangements..."
                : state.status === "success"
                  ? `${state.response.pagination.total} arrangements`
                  : "Arrangements"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden flex-1 md:block md:w-64">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
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
                className="h-10 w-full rounded-full border-outline-variant bg-surface-container-lowest pl-11 pr-4 text-base text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-0"
              />
            </div>

            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="flex h-10 items-center gap-2 rounded-full border-outline-variant bg-surface-container px-4 py-2 text-base font-medium text-on-surface hover:bg-surface-container-high focus:ring-0 [&>svg]:hidden">
                <span>Sort by:</span>
                <SelectValue placeholder="Sort by" />
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-outline-variant/30 bg-surface-container-lowest">
                {SORT_OPTIONS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-base text-on-surface focus:bg-surface-container focus:text-on-surface"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 py-10 md:flex-row">
        <ProductFilters
          categories={categories}
          activeCategoryId={categoryId}
          activePriceRange={priceRange}
          sameDay={sameDay}
          inStock={inStock}
          activeFilterCount={activeFilterCount}
          onCategoryChange={setCategory}
          onPriceRangeChange={setPriceRange}
          onSameDayChange={setSameDay}
          onInStockChange={setInStock}
          onClear={clearAll}
        />

        <div className="min-w-0 flex-1">
          {hasActiveFilters && (
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="mr-2 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Active Filters:</span>
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
              {activePriceLabel && (
                <FilterChip
                  label={activePriceLabel}
                  onRemove={() => setPriceRange("")}
                />
              )}
              {sameDay && (
                <FilterChip
                  label="Same-Day Delivery"
                  onRemove={() => setSameDay(false)}
                />
              )}
              {inStock && (
                <FilterChip
                  label="In Stock Online"
                  onRemove={() => setInStock(false)}
                />
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
                className="ml-2 text-base font-medium text-primary underline underline-offset-4 hover:bg-transparent hover:text-primary"
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
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {state.response.pagination.totalPages > 1 && (
                <PaginationControls
                  page={state.response.pagination.page}
                  totalPages={state.response.pagination.totalPages}
                  onPageChange={goToPage}
                />
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
    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container px-3 py-1.5 text-sm font-medium text-on-surface">
      {label}
      <button
        onClick={onRemove}
        aria-label={`Remove ${label}`}
        className="text-on-surface-variant transition-colors hover:text-error"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </span>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: LIMIT }).map((_, i) => (
        <Skeleton key={i} className="h-[380px] w-full rounded-[16px]" />
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
