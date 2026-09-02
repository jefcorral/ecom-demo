"use client";

import { History, Leaf, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function DashboardEmpty() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-10 lg:px-16 lg:py-12">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="relative mb-8 h-48 w-48 lg:h-64 lg:w-64">
          <div className="absolute inset-0 rounded-full bg-secondary/10 blur-2xl" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full bg-surface-container">
            <Leaf className="h-20 w-20 text-secondary lg:h-28 lg:w-28" />
          </div>
        </div>
        <h2 className="font-serif text-3xl text-on-surface tracking-tight">
          No data for this period yet
        </h2>
        <p className="mt-3 max-w-md text-lg text-on-surface-variant">
          Your workspace is fresh and ready. Start adding your botanical creations to see your operations blossom.
        </p>
        <Button
          onClick={() => router.push("/dashboard/orders/new")}
          className="mt-8 gap-2 rounded-full bg-primary-container px-8 py-6 text-lg font-medium text-on-primary-container shadow-primary-container/20 hover:-translate-y-1 hover:shadow-md"
        >
          <PackageOpen className="h-5 w-5" />
          Create your first order
        </Button>
      </div>

      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl bg-surface-container p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-fixed/50 text-on-secondary-fixed">
              <History className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl text-on-surface">Recent Activity</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <PackageOpen className="mb-4 h-10 w-10 text-outline-variant" />
            <p className="text-sm font-medium  text-on-surface-variant uppercase tracking-wider">
              All caught up
            </p>
            <p className="mt-2 text-center text-sm text-outline">
              No recent actions logged in your workspace.
            </p>
          </div>
        </div>
        <div className="rounded-3xl bg-surface-container p-6 lg:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-tertiary-fixed/50 text-on-tertiary-fixed">
              <Leaf className="h-5 w-5" />
            </div>
            <h3 className="font-serif text-xl text-on-surface">Inventory Status</h3>
          </div>
          <div className="flex flex-col items-center justify-center py-8">
            <Leaf className="mb-4 h-10 w-10 text-outline-variant" />
            <p className="text-sm font-medium  text-on-surface-variant uppercase tracking-wider">
              Stock is healthy
            </p>
            <p className="mt-2 text-center text-sm text-outline">
              No low stock items requiring your attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
