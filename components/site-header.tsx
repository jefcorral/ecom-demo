"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
  Sun,
  Moon,
  Home,
  Store,
  LogOut,
  CircleHelp,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth, useCart } from "@/app/providers";
import { useTheme } from "next-themes";

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
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const mounted = useSyncExternalStore(() => () => {}, () => true, () => false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; name: string; price: number; imageUrl: string | null }[]>([]);
  const debouncedQuery = useDebounce(query, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    import("@/lib/products").then(({ fetchProducts }) => {
      fetchProducts({ search: debouncedQuery.trim(), limit: 4 })
        .then((res) => setResults(res.data.map(({ id, name, price, imageUrl }) => ({ id, name, price, imageUrl: imageUrl ?? null }))))
        .catch(() => setResults([]));
    });
  }, [debouncedQuery]);

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
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setQuery("");
    }
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(44,62,42,0.04)] transition-all duration-300">
        <div className="h-16 max-w-[1140px] mx-auto px-lg flex items-center justify-between gap-xl">
          <div className="flex items-center gap-xl">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-on-surface-variant hover:text-primary hover:bg-surface-container-low lg:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
              <SheetContent side="left" className="w-[280px] bg-surface p-0">
                <SheetHeader className="border-b border-outline-variant/30 p-4">
                  <SheetTitle className="flex items-center gap-2 text-on-surface">
                    <Flower2 className="h-6 w-6 text-primary" />
                    <span className="font-serif text-xl font-semibold tracking-tight">Bloom & Stem</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col p-2">
                  {navLinks.map((link) => (
                    <MobileNavLink key={link.href} href={link.href} active={pathname === link.href}>
                      {link.label}
                    </MobileNavLink>
                  ))}
                  {isAdmin && (
                    <MobileNavLink href="/dashboard" active={pathname === "/dashboard"}>
                      Dashboard
                    </MobileNavLink>
                  )}
                </nav>
                <div className="mt-auto space-y-3 border-t border-outline-variant/30 p-4">
                  {!isLoggedIn && <Link href="/login" className={cn(buttonVariants({ className: "w-full" }))}>Sign In / Register</Link>}
                  <p className="text-sm text-on-surface-variant">Artisanal florals for life&apos;s most beautiful moments.</p>
                </div>
              </SheetContent>
            </Sheet>

            <Link href="/" className="font-headline-md text-headline-md text-primary tracking-tight whitespace-nowrap">
              Bloom & Stem
            </Link>

            <nav className="hidden lg:flex items-center gap-lg">
              {navLinks.map((link) => (
                <HeaderNavLink key={link.href} href={link.href} active={pathname === link.href}>
                  {link.label}
                </HeaderNavLink>
              ))}
              {isAdmin && (
                <HeaderNavLink href="/dashboard" active={pathname === "/dashboard"}>
                  Dashboard
                </HeaderNavLink>
              )}
            </nav>
          </div>

          <div className="flex-1 max-w-md hidden md:block" ref={searchRef}>
            <div className="relative flex items-center">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Input
                  type="search"
                  placeholder="Search bouquets, plants..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setSearchOpen(true)}
                  className={cn(
                    "w-full h-10 pl-11 pr-4 bg-surface-container-lowest border border-outline-variant rounded-full font-body-md text-on-surface focus:outline-none focus:border-primary transition-all",
                    searchOpen && "border-primary"
                  )}
                />
                <button
                  type="submit"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors hover:text-primary"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5" />
                </button>
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

          <div className="flex items-center gap-md">
            <Button
              variant="ghost"
              size="icon"
              className="hidden text-on-surface-variant hover:text-primary hover:bg-surface-container-low md:flex"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              {!mounted || theme !== "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <Link href="/wishlist">
              <Button
                variant="ghost"
                size="icon"
                className="text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                aria-label="Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-on-surface-variant hover:text-primary hover:bg-surface-container-low"
                    aria-label="Account"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                }
              />
              <AccountDropdown user={user} isLoggedIn={isLoggedIn} logout={logout} cartCount={cartCount} />
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
        "font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors duration-200",
        active && "text-primary font-semibold underline underline-offset-8 decoration-2"
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

  return (
    <div className="absolute top-12 left-0 z-50 w-full overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container-lowest shadow-[0_12px_48px_rgba(44,62,42,0.08)]">
      <div className="p-4">
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
            <div className="mt-3 flex flex-col gap-2">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  onClick={onClose}
                >
                  <div className="group flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-surface-container">
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
          href={query.trim() ? `/products?search=${encodeURIComponent(query.trim())}` : "/products"}
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
}: {
  user: { firstName: string | null; email: string } | null;
  isLoggedIn: boolean;
  logout: () => Promise<void>;
  cartCount: number;
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
            <Link href="/orders" className="flex items-center gap-2 text-sm font-medium text-primary hover:text-on-primary-container">
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
          <ChevronRight className="h-4 w-4 text-on-surface-variant" />
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

function MobileNavLink({
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
        "flex items-center justify-between rounded-lg px-3 py-3 text-base font-medium transition-colors",
        active ? "bg-surface-container text-primary" : "text-on-surface hover:bg-surface-container hover:text-primary"
      )}
    >
      {children}
      {active && <ChevronRight className="h-4 w-4" />}
    </Link>
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
