"use client";

import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers";
import { cn } from "@/lib/utils";

interface AdminProfileFooterProps {
  collapsed?: boolean;
}

export function AdminProfileFooter({ collapsed }: AdminProfileFooterProps) {
  const { user, logout, isLoggedIn } = useAuth();
  const router = useRouter();
  const name = user?.firstName || "Admin Staff";
  const role = user?.roles[0] || "Store Manager";

  async function handleLogout() {
    if (isLoggedIn) await logout();
    router.push("/login");
  }

  return (
    <div
      className={cn(
        "shrink-0 border-t border-white/10 py-4",
        collapsed ? "flex justify-center px-2" : "px-4"
      )}
    >
      {collapsed ? (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={handleLogout}
          className="text-white/70 hover:bg-white/10 hover:text-white"
          aria-label="Sign out"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-on-primary-container">
            <User className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{name}</p>
            <p className="truncate text-xs text-white/60">{role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleLogout}
            className="text-error-container hover:bg-error-container/10 hover:text-error-container"
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
