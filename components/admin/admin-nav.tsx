"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { adminNavGroups } from "@/lib/admin";

function isActive(href: string, pathname: string) {
  if (pathname === href) return true;
  if (href !== "/dashboard" && pathname.startsWith(`${href}/`)) return true;
  return false;
}

interface AdminNavProps {
  pathname: string;
  onNavigate?: () => void;
  expanded: boolean;
  collapsed?: boolean;
}

export function AdminNav({
  pathname,
  onNavigate,
  expanded,
  collapsed,
}: AdminNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-2">
      {adminNavGroups.map((group) => (
        <div key={group.title} className="mb-6">
          {expanded && (
            <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-white/40">
              {group.title}
            </p>
          )}
          <div className="space-y-1">
            {group.items.map((item) => {
              const active = isActive(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={!expanded ? item.label : undefined}
                  onClick={onNavigate}
                  className={cn(
                    "group relative flex items-center rounded-full transition-all",
                    collapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
                    active
                      ? "bg-primary font-semibold text-on-primary-container shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 shrink-0",
                      active ? "text-on-primary-container" : "text-white/70 group-hover:text-white"
                    )}
                  />
                  {expanded && <span className="text-sm">{item.label}</span>}
                  {!expanded && active && (
                    <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}
