"use client";

import { Skeleton } from "@/components/ui/skeleton";

function HeaderSkeleton() {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end">
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-8 w-64 rounded-xl" />
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>
  );
}

function MetricSkeleton() {
  return (
    <div className="space-y-3 rounded-2xl bg-surface-container-lowest p-5 lg:p-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-8 w-28 rounded-xl" />
      <Skeleton className="h-3 w-40 rounded-full" />
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-5 lg:p-6">
      <div className="mb-6 flex justify-between">
        <Skeleton className="h-5 w-48 rounded-full" />
        <Skeleton className="h-5 w-8 rounded-full" />
      </div>
      <Skeleton className="h-60 w-full rounded-xl" />
      <div className="mt-4 flex gap-4">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-3 w-32 rounded-full" />
      </div>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-5 lg:p-6">
      <Skeleton className="mb-6 h-5 w-32 rounded-full" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
            </div>
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-16 lg:py-10">
      <HeaderSkeleton />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:mb-10 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <MetricSkeleton key={i} />
        ))}
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 lg:mb-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <ListSkeleton />
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ListSkeleton />
        </div>
        <ListSkeleton />
      </div>
    </div>
  );
}
