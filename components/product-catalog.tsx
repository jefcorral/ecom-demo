"use client";

import { useEffect, useReducer, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Search, ChevronDown, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { SkeletonProductGrid } from "@/components/ui/skeleton-patterns";
import { ProductCard } from "@/components/product-card";
import { ProductFilters } from "@/components/product-filters";
import { PaginationControls } from "@/components/pagination-controls";
import { fetchMockProducts } from "@/lib/products";
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
  const categoryParam = searchParams.get("categoryId") ?? "";
  const priceParam = searchParams.get("priceRange") ?? "";
  const categoryIds = categoryParam.split(",").filter(Boolean);
  const priceRanges = priceParam.split(",").filter(Boolean);
  const inStock = searchParams.get("inStock") === "true";
  const sort = searchParams.get("sort") ?? "best-sellers";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));

  const [state, dispatch] = useReducer(catalogReducer, { status: "loading" });
  const [searchInput, setSearchInput] = useState(search);

  const activeFilterCount =
    (search ? 1 : 0) +
    categoryIds.length +
    priceRanges.length +
    (inStock ? 1 : 0);

  useEffect(() => {
    dispatch({ type: "FETCH_START" });

    dispatch({
      type: "FETCH_SUCCESS",
      response: fetchMockProducts({
        search: search || undefined,
        categoryId: categoryParam || undefined,
        priceRange: priceParam || undefined,
        inStock: inStock ? "true" : undefined,
        page,
        limit: LIMIT,
      }),
    });
  }, [search, categoryParam, priceParam, inStock, page]);

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
    if (!id) {
      updateParams({ categoryId: null });
      return;
    }
    const next = categoryIds.includes(id) ? categoryIds.filter((value) => value !== id) : [...categoryIds, id];
    updateParams({ categoryId: next.join(",") });
  }

  function setPriceRange(value: string) {
    const next = priceRanges.includes(value) ? priceRanges.filter((range) => range !== value) : [...priceRanges, value];
    updateParams({ priceRange: next.join(",") });
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
    updateParams({ search: null, categoryId: null, priceRange: null, inStock: null, sort: null });
  }

  const activeCategories = categoryIds.map((id) => ({
    id,
    name: categories.find((category) => category.id === id)?.name ?? id,
  }));
  const activePrices = priceRanges.map((value) => ({
    value,
    label: PRICE_OPTIONS.find((option) => option.value === value)?.label ?? value,
  }));

  const hasActiveFilters = activeFilterCount > 0;

  return (
    <>
      <div className="sticky top-16 z-40 border-b border-outline-variant/30 bg-surface-container-lowest/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1140px] items-end justify-between gap-3 px-4 py-4 md:px-lg md:py-lg">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight text-primary md:text-3xl">Shop All Flowers</h1>
          <p className="mt-1 text-sm text-on-surface-variant md:mt-2 md:text-base">
            {state.status === "loading"
              ? "Loading arrangements..."
              : state.status === "success"
                ? `${state.response.pagination.total} arrangements`
                : "Arrangements"}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
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
            <SelectTrigger aria-label="Sort products" className="flex h-11 max-w-[150px] items-center gap-1 rounded-full border-outline-variant bg-surface-container px-3 py-2 text-sm font-medium text-on-surface hover:bg-surface-container-high focus:ring-0 sm:max-w-none sm:gap-2 sm:px-4 sm:text-base [&>svg]:hidden">
              <span className="hidden sm:inline">Sort by:</span>
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

    <div className="mx-auto flex w-full max-w-[1140px] flex-col gap-6 px-4 py-6 pb-24 md:flex-row md:gap-2xl md:px-lg md:py-xl">
        <ProductFilters
          categories={categories}
          activeCategoryIds={categoryIds}
          activePriceRanges={priceRanges}
          inStock={inStock}
          activeFilterCount={activeFilterCount}
          onCategoryChange={setCategory}
          onPriceRangeChange={setPriceRange}
          onInStockChange={setInStock}
          onClear={clearAll}
        />

        <div className="min-w-0 flex-1">
          {hasActiveFilters && (
            <div className="mb-4 flex flex-wrap items-center gap-2 md:mb-6">
              <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-on-surface-variant md:mr-2">Active Filters:</span>
              {search && (
                <FilterChip
                  label={`Search: ${search}`}
                  onRemove={() => {
                    setSearchInput("");
                    setSearchValue("");
                  }}
                />
              )}
              {activeCategories.map((category) => (
                <FilterChip
                  key={category.id}
                  label={category.name}
                  onRemove={() => setCategory(category.id)}
                />
              ))}
              {activePrices.map((price) => (
                <FilterChip
                  key={price.value}
                  label={price.label}
                  onRemove={() => setPriceRange(price.value)}
                />
              ))}
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
                className="ml-0 h-9 px-2 text-sm font-medium text-primary underline underline-offset-4 hover:bg-transparent hover:text-primary md:ml-2 md:text-base"
              >
                Clear All
              </Button>
            </div>
          )}

          {state.status === "loading" ? (
            <SkeletonProductGrid count={LIMIT} />
          ) : state.status === "error" ? (
            <ErrorState onRetry={() => window.location.reload()} />
          ) : sortedProducts.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title={search ? `No results for “${search}”` : "No arrangements found"}
              description="Try adjusting your search or filters to find what you're looking for."
              action={<Button onClick={clearAll}>Browse All Products</Button>}
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4">
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
    </>
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
