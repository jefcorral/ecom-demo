"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Flower2,
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  ChevronRight,
  ShoppingCart,
  Package,
  MapPin,
  Home,
  Store,
  LogOut,
  CircleHelp,
  X,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { MobileMenu } from "@/components/mobile-menu";
import { NavMegaMenu } from "@/components/nav-mega-menu";
import { RecentSearchChips } from "@/components/recent-search-chips";
import { saveRecentSearch, searchProducts } from "@/lib/search";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth, useCart, useWishlist } from "@/app/providers";

const navLinks = [
  { href: "/products", label: "Shop All" },
  { href: "/products?categoryId=occasions", label: "Occasions" },
  { href: "/products?categoryId=plants", label: "Plants" },
  { href: "/products?categoryId=gifts", label: "Gifts" },
  { href: "/about", label: "About" },
];

const trending = ["Peonies", "Birthday Bouquets", "Same-Day"];

function useDebounce(value: string, delay = 200) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function SiteHeader() {
  const { user, isLoggedIn, logout } = useAuth();
  const { cart } = useCart();
  const { wishlistCount } = useWishlist();
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const results = useMemo(() => searchProducts(debouncedQuery).slice(0, 5).map(({ id, name, price, imageUrl }) => ({ id, name, price, imageUrl: imageUrl ?? null })), [debouncedQuery]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 16);
    updateScrolled();
    window.addEventListener("scroll", updateScrolled, { passive: true });
    return () => window.removeEventListener("scroll", updateScrolled);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [searchOpen]);

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = user?.roles.some((r) => r === "admin" || r === "super_admin");

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      saveRecentSearch(query);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <>
      <header className={cn("fixed top-0 z-50 w-full border-b border-transparent bg-surface/80 backdrop-blur-xl transition-all duration-300", scrolled && "border-outline-variant/30 shadow-header")}>
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-5 px-4 lg:h-16 lg:px-6">
          <div className={cn("flex items-center gap-6 transition-opacity", searchOpen && "lg:opacity-40")}>
            <Sheet>
              <SheetTrigger render={<Button variant="ghost" size="icon" className="text-on-surface hover:bg-surface-container-low lg:hidden" aria-label="Open navigation menu"><Menu className="h-6 w-6" /></Button>} />
              <MobileMenu isLoggedIn={isLoggedIn} wishlistCount={wishlistCount} />
            </Sheet>

            <Link href="/" aria-label="Bloom and Stem home" className="absolute left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap font-serif text-2xl font-semibold tracking-tight text-primary lg:static lg:translate-x-0 lg:text-on-surface">
              <Flower2 className="hidden h-6 w-6 text-primary lg:block" />Bloom &amp; Stem
            </Link>

            <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
              {navLinks.map((link) => link.label === "Occasions" ? <div key={link.href} className="group/nav relative"><HeaderNavLink href={link.href} active={pathname === "/products"}>Occasions</HeaderNavLink><NavMegaMenu /></div> : <HeaderNavLink key={link.href} href={link.href} active={pathname === link.href}>{link.label}</HeaderNavLink>)}
              {isAdmin && <HeaderNavLink href="/dashboard" active={pathname === "/dashboard"}>Dashboard</HeaderNavLink>}
            </nav>
          </div>

          <div className={cn("hidden flex-1 transition-all duration-200 lg:block", searchOpen ? "max-w-[400px]" : "max-w-[320px]")} ref={searchRef}>
            <div className="relative flex items-center">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search bouquets, plants..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className={cn(
                    "h-11 w-full rounded-full border border-outline-variant bg-surface-container-low pl-11 pr-11 font-body-md text-on-surface transition-all focus:outline-none",
                    searchOpen && "border-primary ring-2 ring-primary/20"
                  )}
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-primary"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
                {query && <button type="button" onClick={() => setQuery("")} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-primary hover:bg-surface-container" aria-label="Clear search"><X className="h-4 w-4" /></button>}
              </form>

              {searchOpen && (
                <SearchDropdown
                  query={query}
                  results={results}
                  onClose={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                />
              )}
            </div>
          </div>

          <div className={cn("flex items-center gap-1 transition-opacity lg:gap-2", searchOpen && "lg:opacity-40")}>
            <Link href="/wishlist" className="hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-container px-1 text-[10px] font-bold text-on-primary-container">
                    {wishlistCount}
                  </span>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hidden text-on-surface-variant hover:bg-surface-container-low hover:text-primary lg:flex"
                    aria-label="Account"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                }
              />
              <AccountDropdown user={user} isLoggedIn={isLoggedIn} logout={logout} cartCount={cartCount} wishlistCount={wishlistCount} />
            </DropdownMenu>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                aria-label="Shopping cart"
              >
                <ShoppingBag className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-container px-1 text-[10px] font-bold text-on-primary-container">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-outline-variant/30 bg-surface/90 pb-safe backdrop-blur-lg md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          <BottomNavLink href="/" active={pathname === "/"} icon={Home} label="Home" />
          <BottomNavLink href="/products" active={pathname.startsWith("/products")} icon={Store} label="Shop" />
          <BottomNavLink href="/wishlist" active={pathname === "/wishlist"} icon={Heart} label="Saved" />
          <BottomNavLink
            href={isLoggedIn ? "/account" : "/login"}
            active={pathname === "/account" || pathname === "/login"}
            icon={User}
            label="Account"
          />
        </div>
      </nav>
    </>
  );
}

function HeaderNavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative py-5 font-label-md text-label-md text-on-surface-variant transition-colors duration-200 hover:text-primary after:absolute after:bottom-3 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-primary after:opacity-0",
        active && "font-semibold text-primary after:opacity-100"
      )}
    >
      {children}
    </Link>
  );
}

function SearchDropdown({
  query,
  results,
  onClose,
}: {
  query: string;
  results: { id: string; name: string; price: number; imageUrl: string | null }[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    function navigate(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (!results.length) return;
      if (event.key === "ArrowDown") { event.preventDefault(); setSelected((value) => (value + 1) % results.length); }
      if (event.key === "ArrowUp") { event.preventDefault(); setSelected((value) => value <= 0 ? results.length - 1 : value - 1); }
      if (event.key === "Enter" && selected >= 0) { event.preventDefault(); router.push(`/products/${results[selected].id}`); onClose(); }
    }
    window.addEventListener("keydown", navigate);
    return () => window.removeEventListener("keydown", navigate);
  }, [onClose, results, router, selected]);

  return (
    <div className="absolute top-12 left-0 z-50 w-full overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_12px_48px_rgba(44,62,42,0.08)]">
      <div className="p-4">
        {!query.trim() && <div className="mb-6"><RecentSearchChips onSelect={(term) => { saveRecentSearch(term); router.push(`/search?q=${encodeURIComponent(term)}`); onClose(); }} /></div>}
        <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Trending</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {trending.map((term) => (
            <button
              key={term}
              onClick={() => {
                router.push(`/products?search=${encodeURIComponent(term)}`);
                onClose();
              }}
              className="rounded-full bg-surface-container px-3 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-container-high"
            >
              {term}
            </button>
          ))}
        </div>

        {results.length > 0 && (
          <div className="mt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Products</span>
            <div role="listbox" aria-label="Product suggestions" className="mt-3 flex flex-col gap-2">
              {results.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  role="option"
                  aria-selected={selected === index}
                  onClick={onClose}
                >
                  <div className={cn("group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary-container", selected === index && "bg-secondary-container")}>
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-surface-variant">
                      {product.imageUrl ? (
                        <Image
                          src={product.imageUrl}
                          alt=""
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <Flower2 className="absolute inset-0 h-full w-full p-2 text-on-surface-variant" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-on-surface group-hover:text-primary">{product.name}</p>
                      <p className="text-xs text-on-surface-variant">${Number(product.price).toFixed(2)}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-on-surface-variant opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-outline-variant/30 bg-surface-container-low p-3 text-center">
        <Link
          href={query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/search"}
          onClick={onClose}
          className="text-sm font-medium text-primary hover:text-on-primary-container"
        >
          {query.trim() ? `View all results for "${query.trim()}"` : "View all products"}
        </Link>
      </div>
    </div>
  );
}

function AccountDropdown({
  user,
  isLoggedIn,
  logout,
  cartCount,
  wishlistCount,
}: {
  user: { firstName: string | null; email: string } | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  cartCount: number;
  wishlistCount: number;
}) {
  if (!isLoggedIn) {
    return (
      <DropdownMenuContent align="end" className="w-72 bg-surface-container-lowest p-4 text-on-surface">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container">
            <User className="h-6 w-6 text-secondary" />
          </div>
          <div>
            <p className="font-serif text-lg font-semibold">Welcome Back</p>
            <p className="text-sm text-on-surface-variant">Sign in to access your orders and favorites.</p>
          </div>
          <Link
            href="/login"
            className={cn(buttonVariants({ className: "w-full" }))}
          >
            Sign In / Register
          </Link>
          <div className="flex items-center justify-center gap-5">
            <Link href="/track-order" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-on-primary-container">
              <Package className="h-4 w-4" />
              Track your order
            </Link>
            <Link href="/help" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-on-primary-container">
              <CircleHelp className="h-4 w-4" />
              Help
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    );
  }

  return (
    <DropdownMenuContent align="end" className="w-64 bg-surface-container-lowest p-2 text-on-surface">
      <div className="flex items-center gap-3 p-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container">
          <User className="h-5 w-5 text-secondary" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Welcome</p>
          <p className="font-serif text-base font-semibold">Hi, {user?.firstName || "Friend"}</p>
        </div>
      </div>
      <DropdownMenuSeparator className="bg-outline-variant/30" />
      <DropdownMenuItem className="p-0">
        <Link
          href="/account"
          className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-surface-container focus:bg-surface-container"
        >
          <span className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            My Account
          </span>
          <ChevronRight className="h-4 w-4 text-on-surface-variant" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="p-0">
        <Link
          href="/orders"
          className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-surface-container focus:bg-surface-container"
        >
          <span className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-primary" />
            My Orders
          </span>
          {cartCount > 0 && (
            <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold text-on-primary-container">
              {cartCount} Active
            </span>
          )}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="p-0">
        <Link
          href="/wishlist"
          className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-surface-container focus:bg-surface-container"
        >
          <span className="flex items-center gap-2">
            <Heart className="h-4 w-4 fill-current text-primary" />
            Favorites
          </span>
          {wishlistCount > 0 ? (
            <span className="rounded-full bg-primary-container px-2 py-0.5 text-[10px] font-bold text-on-primary-container">
              {wishlistCount}
            </span>
          ) : (
            <ChevronRight className="h-4 w-4 text-on-surface-variant" />
          )}
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="p-0">
        <Link
          href="/account/addresses"
          className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-surface-container focus:bg-surface-container"
        >
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Addresses
          </span>
          <ChevronRight className="h-4 w-4 text-on-surface-variant" />
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-outline-variant/30" />
      <DropdownMenuItem
        onClick={() => logout()}
        className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-error hover:bg-error-container hover:text-error focus:bg-error-container focus:text-error"
      >
        <LogOut className="h-4 w-4" />
        Log Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

function BottomNavLink({
  href,
  active,
  icon: Icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center gap-1 rounded-lg px-3 py-1 transition-colors",
        active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  );
}
