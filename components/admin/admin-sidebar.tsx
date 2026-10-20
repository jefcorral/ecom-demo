"use client";

import Image from "next/image";
import { PanelLeft, PanelRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminNav } from "./admin-nav";
import { AdminProfileFooter } from "./admin-profile-footer";

interface AdminSidebarProps {
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
  pathname: string;
}

export function AdminSidebar({
  collapsed,
  onCollapsedChange,
  pathname,
}: AdminSidebarProps) {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-50 hidden h-full flex-col bg-[#2C3E2A] shadow-xl transition-all duration-300 lg:flex",
        collapsed ? "w-[80px]" : "w-[256px]"
      )}
    >
      <div
        className={cn(
          "flex h-16 shrink-0 items-center",
          collapsed ? "justify-center px-2" : "justify-between px-4"
        )}
      >
        <div className="flex items-center gap-2">
          <Image src="/4u-flowers-gifts-logo.png" alt={collapsed ? "4U Flowers & Gifts" : ""} width={40} height={38} className="h-10 w-10 shrink-0 rounded-full bg-surface p-0.5 object-contain" />
          {!collapsed && (
            <span className="font-serif text-base font-semibold leading-tight text-white">
              4U Flowers &amp; Gifts
            </span>
          )}
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onCollapsedChange(true)}
            className="text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Collapse sidebar"
          >
            <PanelLeft className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        <AdminNav
          pathname={pathname}
          expanded={!collapsed}
          collapsed={collapsed}
        />
      </div>
      {collapsed && (
        <div className="flex h-14 shrink-0 items-center justify-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => onCollapsedChange(false)}
            className="text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Expand sidebar"
          >
            <PanelRight className="h-5 w-5" />
          </Button>
        </div>
      )}
      <AdminProfileFooter collapsed={collapsed} />
    </aside>
  );
}
