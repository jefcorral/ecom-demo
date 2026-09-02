"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/app/providers";
import { cn } from "@/lib/utils";

export function AdminUserMenu() {
  const { user, logout, isLoggedIn } = useAuth();
  const router = useRouter();
  const name = user?.firstName || "Admin Staff";
  const role = user?.roles[0] || "Admin";

  async function handleLogout() {
    if (isLoggedIn) await logout();
    router.push("/login");
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="flex items-center gap-2 px-2 text-on-surface hover:bg-surface-container hover:text-primary"
            aria-label="Staff menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
              <User className="h-4 w-4" />
            </div>
            <span className="hidden text-sm font-medium lg:inline">{name}</span>
            <ChevronDown className={cn("hidden h-4 w-4 text-on-surface-variant lg:inline")} />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-60 bg-surface-container-lowest p-2">
        <div className="px-2 py-2">
          <p className="font-medium text-on-surface">{name}</p>
          <p className="text-xs text-on-surface-variant capitalize">{role}</p>
        </div>
        <DropdownMenuSeparator className="bg-outline-variant/30" />
        <DropdownMenuItem
          className="cursor-pointer rounded-lg px-2 py-2 text-sm hover:bg-surface-container"
          onClick={() => router.push("/dashboard/settings")}
        >
          <Settings className="mr-2 h-4 w-4 text-primary" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-outline-variant/30" />
        <DropdownMenuItem
          className="cursor-pointer rounded-lg px-2 py-2 text-sm text-error hover:bg-error-container hover:text-error"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
