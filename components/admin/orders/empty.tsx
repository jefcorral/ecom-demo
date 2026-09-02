"use client";

import { PackageOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function OrdersEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-16 lg:py-12">
      <div className="mb-8 flex flex-col items-end justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Management</p>
          <h1 className="font-serif text-4xl text-on-surface">Orders</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-full border-outline px-6 py-5 text-on-surface hover:bg-surface-variant/30"
          >
            Filter <span className="rounded-full bg-surface-variant px-2 py-0.5 text-xs text-on-surface-variant">0</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 rounded-full border-outline px-6 py-5 text-on-surface hover:bg-surface-variant/30"
          >
            Newest First
          </Button>
        </div>
      </div>

      <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-surface-container-lowest px-6 py-24 shadow-sm">
        <div className="absolute inset-0 pointer-events-none opacity-30">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary-container blur-[80px]" />
          <div className="absolute left-1/3 top-1/3 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-container/20 blur-[60px]" />
        </div>
        <div className="relative z-10 mb-8 flex h-72 w-72 items-center justify-center">
          <PackageOpen className="h-24 w-24 text-secondary" />
        </div>
        <h2 className="relative z-10 text-center font-serif text-3xl tracking-tight text-on-surface">
          No orders yet
        </h2>
        <p className="relative z-10 mt-2 max-w-md text-center text-lg text-on-surface-variant">
          When orders are placed, they&apos;ll appear here. Cultivate your business by recording your first transaction.
        </p>
        <Button
          onClick={onCreate}
          className="relative z-10 mt-8 gap-2 rounded-full bg-primary-container px-8 py-6 text-lg font-medium text-on-primary-container shadow-primary-container/20 hover:-translate-y-1 hover:shadow-md"
        >
          <Plus className="h-5 w-5" />
          Create your first order
        </Button>
      </div>
    </div>
  );
}
