"use client";

import { useMemo, useState } from "react";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const initialNotifications = [
  { id: "n1", title: "New order received", detail: "Order #1024 — $128.50", time: "5m ago", unread: true },
  { id: "n2", title: "Low stock alert", detail: "Monstera Deliciosa is running low", time: "1h ago", unread: true },
  { id: "n3", title: "Delivery completed", detail: "Order #1021 was delivered", time: "3h ago", unread: false },
];

export function AdminNotifications() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = useMemo(
    () => notifications.filter((n) => n.unread).length,
    [notifications]
  );

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="relative text-on-surface-variant hover:bg-surface-container hover:text-primary"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-error ring-2 ring-surface" />
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80 bg-surface-container-lowest p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <h3 className="font-serif text-base font-semibold text-on-surface">Notifications</h3>
          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllRead}
              className="h-auto gap-1.5 px-2 py-1 text-xs text-primary hover:bg-primary/10"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </Button>
          )}
        </div>
        <DropdownMenuSeparator className="bg-outline-variant/30" />
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container">
              <BellOff className="h-7 w-7 text-on-surface-variant/50" />
            </div>
            <p className="font-serif text-lg font-semibold text-on-surface">All Caught Up!</p>
            <p className="text-sm text-on-surface-variant">No new alerts right now.</p>
          </div>
        ) : (
          <div className="max-h-80 overflow-y-auto py-1">
            {notifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex cursor-default flex-col items-start gap-0.5 px-4 py-3 hover:bg-surface-container",
                  notification.unread && "bg-surface-container-low"
                )}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">{notification.title}</span>
                  {notification.unread && <span className="h-2 w-2 rounded-full bg-primary" />}
                </div>
                <span className="text-xs text-on-surface-variant">{notification.detail}</span>
                <span className="text-xs text-on-surface-variant/70">{notification.time}</span>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
