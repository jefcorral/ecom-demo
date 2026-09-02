"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopBar } from "./admin-top-bar";
import { AdminMobileNav } from "./admin-mobile-nav";
import { AdminMobileDrawer } from "./admin-mobile-drawer";
import { AdminMobileSearch } from "./admin-search";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname() ?? "";
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <AdminSidebar
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        pathname={pathname}
      />
      <AdminMobileDrawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        pathname={pathname}
      />
      <AdminTopBar
        collapsed={collapsed}
        pathname={pathname}
        onMobileMenuOpen={() => setMobileOpen(true)}
        onMobileSearchOpen={() => setMobileSearchOpen(true)}
      />
      <main
        className={cn(
          "min-h-screen bg-surface pb-20 pt-16 transition-all duration-300 lg:pb-0",
          collapsed ? "lg:ml-[80px]" : "lg:ml-[256px]"
        )}
      >
        {children}
      </main>
      <AdminMobileNav pathname={pathname} />
      {mobileSearchOpen && <AdminMobileSearch onClose={() => setMobileSearchOpen(false)} />}
    </div>
  );
}
