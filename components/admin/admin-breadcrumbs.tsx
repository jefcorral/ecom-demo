"use client";

import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminRouteLabels } from "@/lib/admin";

function labelForSegment(segment: string) {
  if (adminRouteLabels[segment]) return adminRouteLabels[segment];
  if (segment.startsWith("ord-")) return `Order #${segment.toUpperCase()}`;
  if (segment.startsWith("cust-")) return "Customer Details";
  if (segment.startsWith("prod-")) return "Product Details";
  return segment.charAt(0).toUpperCase() + segment.slice(1);
}

interface AdminBreadcrumbsProps {
  pathname: string;
  className?: string;
}

export function AdminBreadcrumbs({ pathname, className }: AdminBreadcrumbsProps) {
  const segments = pathname.split("/").filter(Boolean);
  const adminSegments = segments.slice(1); // remove "dashboard"

  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-2 text-sm", className)}>
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-on-surface-variant transition-colors hover:text-primary"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      {adminSegments.map((segment, index) => {
        const href = "/dashboard/" + adminSegments.slice(0, index + 1).join("/");
        const label = labelForSegment(segment);
        const isLast = index === adminSegments.length - 1;
        return (
          <div key={href} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-outline" />
            {isLast ? (
              <span className="font-medium text-on-surface">{label}</span>
            ) : (
              <Link
                href={href}
                className="text-on-surface-variant transition-colors hover:text-primary"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
