"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ArrowLeft,
  Mic,
  Package,
  Plus,
  QrCode,
  Search,
  ShoppingBasket,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  adminQuickActions,
  adminRecentCustomers,
  adminTrendingSearches,
  searchAdmin,
} from "@/lib/admin";

interface AdminSearchResultsProps {
  query: string;
  onQueryChange: (value: string) => void;
  onClose: () => void;
  mode: "desktop" | "mobile";
}

function SearchResults({ query, onQueryChange, onClose, mode }: AdminSearchResultsProps) {
  const results = useMemo(() => searchAdmin(query), [query]);
  const isMobile = mode === "mobile";

  if (!query.trim()) {
    return (
      <div className={cn("space-y-6", isMobile ? "p-5" : "p-4")}>
        <section>
          <h4 className={cn("mb-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant", isMobile && "text-sm")}>
            Popular Searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {adminTrendingSearches.map((term) => (
              <button
                key={term}
                onClick={() => onQueryChange(term)}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1.5 text-sm font-medium text-on-surface transition-colors hover:bg-surface-variant"
              >
                <TrendingUp className="h-3.5 w-3.5 text-on-surface-variant" />
                {term}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h4 className={cn("mb-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant", isMobile && "text-sm")}>
            Recent Customers
          </h4>
          <div className="space-y-2">
            {adminRecentCustomers.map((customer) => (
              <Link
                key={customer.id}
                href={`/dashboard/customers/${customer.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl bg-surface-container-lowest p-3 transition-colors hover:bg-surface-container"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                  <span className="text-sm font-semibold">
                    {customer.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-on-surface">{customer.name}</p>
                  <p className="truncate text-xs text-on-surface-variant">{customer.detail}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h4 className={cn("mb-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant", isMobile && "text-sm")}>
            Quick Actions
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {adminQuickActions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                onClick={onClose}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-surface-container-lowest p-4 text-center transition-colors hover:bg-surface-container"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <action.icon className="h-5 w-5" />
                </div>
                <span className="text-sm font-medium text-on-surface">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    );
  }

  const hasResults =
    results.products.length > 0 ||
    results.orders.length > 0 ||
    results.customers.length > 0;

  if (!hasResults) {
    return (
      <div className={cn("py-12 text-center", isMobile ? "p-5" : "p-4")}>
        <p className="text-sm text-on-surface-variant">
          No results for &quot;{query}&quot;
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-5", isMobile ? "p-5" : "p-4")}>
      {results.products.length > 0 && (
        <section>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Products
          </h4>
          <div className="space-y-1">
            {results.products.map((product) => (
              <Link
                key={product.id}
                href={`/dashboard/products/${product.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-container"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
                  <Package className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-on-surface">{product.name}</p>
                  <p className="truncate text-xs text-on-surface-variant">{product.sku}</p>
                </div>
                <span className="text-sm font-medium text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {results.orders.length > 0 && (
        <section>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Orders
          </h4>
          <div className="space-y-1">
            {results.orders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/orders/${order.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-container"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-on-surface-variant">
                  <ShoppingBasket className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-on-surface">{order.customerName}</p>
                  <p className="truncate text-xs text-on-surface-variant">Order {order.id.replace("ord-", "#")}</p>
                </div>
                <span className="text-sm font-medium text-primary">${order.total.toFixed(2)}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
      {results.customers.length > 0 && (
        <section>
          <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Customers
          </h4>
          <div className="space-y-1">
            {results.customers.map((customer) => (
              <Link
                key={customer.id}
                href={`/dashboard/customers/${customer.id}`}
                onClick={onClose}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-surface-container"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                  <Users className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-on-surface">{customer.name}</p>
                  <p className="truncate text-xs text-on-surface-variant">{customer.email}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export function AdminSearchInput() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  return (
    <div className="relative hidden w-full max-w-2xl lg:block" ref={ref}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-on-surface-variant" />
        <Input
          type="search"
          placeholder="Search orders, products, or customers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          className="h-12 w-full rounded-full border-outline-variant bg-surface-container-lowest pl-12 pr-11 text-on-surface focus-visible:border-primary focus-visible:ring-primary/30"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_12px_48px_rgba(44,62,42,0.08)]">
          <SearchResults
            query={query}
            onQueryChange={setQuery}
            onClose={() => setOpen(false)}
            mode="desktop"
          />
        </div>
      )}
    </div>
  );
}

interface AdminMobileSearchProps {
  onClose: () => void;
}

export function AdminMobileSearch({ onClose }: AdminMobileSearchProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    document.getElementById("admin-mobile-search")?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-surface">
      <div className="flex items-center gap-3 bg-surface-container px-4 py-3 shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-on-surface-variant hover:bg-surface-variant"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="relative flex-1">
          <Input
            id="admin-mobile-search"
            type="search"
            placeholder="Search orders, customers, or items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-full border-outline-variant bg-surface pl-4 pr-12 text-on-surface focus-visible:border-primary focus-visible:ring-primary/30"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <Mic className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <SearchResults
          query={query}
          onQueryChange={setQuery}
          onClose={onClose}
          mode="mobile"
        />
      </div>
    </div>
  );
}
