"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function OrdersSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-16 lg:py-10">
      <div className="mb-6 flex flex-col items-end justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-12 w-28 rounded-full" />
          <Skeleton className="h-12 w-36 rounded-full" />
        </div>
      </div>

      <div className="mb-6 rounded-3xl bg-surface-container-lowest p-6 shadow-sm lg:mb-10">
        <div className="mb-4 flex flex-col gap-4 border-b border-outline-variant/30 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <Skeleton className="h-12 w-full rounded-full lg:w-96" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-28 rounded-full" />
            <Skeleton className="h-10 w-32 rounded-full" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Skeleton className="h-8 w-32 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-full" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse">
            <thead>
              <tr>
                {Array.from({ length: 8 }).map((_, i) => (
                  <th key={i} className="px-4 py-4">
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 3 }).map((_, row) => (
                <tr key={row}>
                  <td className="py-5 pl-6">
                    <Skeleton className="h-5 w-5 rounded" />
                  </td>
                  {Array.from({ length: 5 }).map((_, col) => (
                    <td key={col} className="px-4 py-5">
                      <Skeleton className="h-4 w-32 rounded-full" />
                    </td>
                  ))}
                  <td className="px-4 py-5 text-right">
                    <Skeleton className="ml-auto h-4 w-20 rounded-full" />
                  </td>
                  <td className="pr-6 py-5 text-right">
                    <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
