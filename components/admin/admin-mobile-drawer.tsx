"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdminNav } from "./admin-nav";
import { AdminProfileFooter } from "./admin-profile-footer";

interface AdminMobileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pathname: string;
}

export function AdminMobileDrawer({
  open,
  onOpenChange,
  pathname,
}: AdminMobileDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        overlayClassName="bg-black/40 backdrop-blur-sm"
        className="w-[280px] data-[side=left]:w-[280px] border-r-0 bg-[#2C3E2A] p-0 text-white shadow-2xl sm:max-w-[280px] data-[side=left]:sm:max-w-[280px]"
      >
        <SheetTitle className="sr-only">Admin navigation</SheetTitle>
        <div className="flex h-full flex-col">
          <div className="flex h-14 items-center justify-between px-4">
            <span className="font-serif text-xl font-semibold text-primary">
              Bloom &amp; Stem
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/10"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <AdminNav
            pathname={pathname}
            expanded
            onNavigate={() => onOpenChange(false)}
          />
          <AdminProfileFooter />
        </div>
      </SheetContent>
    </Sheet>
  );
}
