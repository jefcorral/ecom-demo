"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAdminPageTitle } from "@/lib/admin";
import { AdminBreadcrumbs } from "./admin-breadcrumbs";
import { AdminNotifications } from "./admin-notifications";
import { AdminUserMenu } from "./admin-user-menu";
import { AdminSearchInput } from "./admin-search";

interface AdminTopBarProps {
  collapsed: boolean;
  pathname: string;
  onMobileMenuOpen: () => void;
  onMobileSearchOpen: () => void;
}

export function AdminTopBar({
  collapsed,
  pathname,
  onMobileMenuOpen,
  onMobileSearchOpen,
}: AdminTopBarProps) {
  const pageTitle = getAdminPageTitle(pathname);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 grid h-16 grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-outline-variant/20 bg-surface/90 px-4 backdrop-blur-xl transition-all duration-300",
        collapsed ? "lg:left-[80px]" : "lg:left-[256px]",
        "left-0 right-0"
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuOpen}
          className="text-on-surface lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <AdminBreadcrumbs pathname={pathname} className="hidden lg:flex" />
      </div>

      <div className="flex min-w-0 justify-center">
        <h1 className="truncate font-serif text-lg font-semibold text-on-surface lg:hidden">
          {pageTitle}
        </h1>
        <div className="hidden w-full max-w-2xl lg:block">
          <AdminSearchInput />
        </div>
      </div>

      <div className="flex items-center gap-1 justify-self-end">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileSearchOpen}
          className="text-on-surface-variant hover:bg-surface-container hover:text-primary lg:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>
        <AdminNotifications />
        <AdminUserMenu />
      </div>
    </header>
  );
}
