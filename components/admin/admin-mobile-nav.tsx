"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { adminBottomNav } from "@/lib/admin";

interface AdminMobileNavProps {
  pathname: string;
}

export function AdminMobileNav({ pathname }: AdminMobileNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-outline-variant/30 bg-surface/90 pb-safe backdrop-blur-xl lg:hidden">
      <div className="flex h-16 items-center justify-around px-2">
        {adminBottomNav.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-lg px-3 py-1 transition-colors",
                active ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
