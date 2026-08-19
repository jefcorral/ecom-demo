"use client";

import Link from "next/link";
import { ShoppingCart, User, Menu, Sun, Moon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/providers";
import { useCart } from "@/app/providers";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const { user, isLoggedIn, logout } = useAuth();
  const { cart } = useCart();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const isAdmin = user?.roles.some((r) => r === "admin" || r === "super_admin");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "md:hidden")}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <nav className="grid gap-4 py-4">
                <Link href="/" className="text-sm font-medium hover:underline">
                  Home
                </Link>
                <Link href="/products" className="text-sm font-medium hover:underline">
                  Products
                </Link>
                <Link href="/cart" className="text-sm font-medium hover:underline">
                  Cart
                </Link>
                <Link href="/orders" className="text-sm font-medium hover:underline">
                  Orders
                </Link>
                {isAdmin && (
                  <Link href="/dashboard" className="text-sm font-medium hover:underline">
                    Dashboard
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="text-lg font-bold tracking-tight">
            Ecom Store
          </Link>
          <nav className="hidden items-center gap-6 px-6 md:flex">
            <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Products
            </Link>
            <Link href="/orders" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Orders
            </Link>
            {isAdmin && (
              <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {!mounted || theme !== "dark" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                  {cartCount}
                </span>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
          {isLoggedIn ? (
            <Button variant="ghost" size="sm" onClick={() => logout()}>
              Log out
            </Button>
          ) : (
            <Link href="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
