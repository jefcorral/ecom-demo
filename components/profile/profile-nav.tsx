"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  LogOut,
  PackageSearch,
  ShoppingBag,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { useAuth } from "@/app/providers";
import { cn } from "@/lib/utils";

interface ProfileNavProps {
  className?: string;
  onNavigate?: (href: string, e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const navItems = [
  {
    label: "Profile Overview",
    href: "/profile",
    icon: User,
    exact: true,
  },
  {
    label: "Edit & Preferences",
    href: "/profile/edit",
    icon: SlidersHorizontal,
  },
  {
    label: "Order History",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    label: "Saved Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "Track an Order",
    href: "/track-order",
    icon: PackageSearch,
  },
];

export function ProfileNav({ className, onNavigate }: ProfileNavProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav aria-label="Profile navigation" className={cn("space-y-6", className)}>
      {/* Mobile horizontal scrollable pills with 44px minimum touch target */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar gap-2 pb-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href || (item.href === "/profile" && pathname === "/account")
            : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => onNavigate?.(item.href, e)}
              className={cn(
                "flex min-h-[44px] shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium transition-colors motion-reduce:transition-none touch-manipulation",
                isActive
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <Icon className="size-3.5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Desktop sidebar card */}
      <div className="hidden md:block rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-3 shadow-sm">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href || (item.href === "/profile" && pathname === "/account")
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={(e) => onNavigate?.(item.href, e)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors motion-reduce:transition-none",
                    isActive
                      ? "bg-primary-container text-on-primary-container font-semibold"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  )}
                >
                  <Icon className={cn("size-4", isActive ? "text-primary" : "text-on-surface-variant")} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="my-3 border-t border-outline-variant/30" />

        <button
          type="button"
          onClick={() => logout()}
          className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-error hover:bg-error-container/20 transition-colors motion-reduce:transition-none touch-manipulation"
        >
          <LogOut className="size-4" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
