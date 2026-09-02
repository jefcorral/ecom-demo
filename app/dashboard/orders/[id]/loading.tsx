import { Skeleton } from "@/components/ui/skeleton";

export default function OrderDetailLoading() {
  return (
    <div role="status" aria-label="Loading order details" className="mx-auto max-w-[1440px] px-5 py-6 pb-28 lg:px-16 lg:py-10 lg:pb-10">
      <div className="mb-8 flex items-center gap-2">
        <Skeleton className="h-8 w-32 rounded-full" />
      </div>
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-4 w-40 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-11 w-28 rounded-full" />
          <Skeleton className="h-11 w-32 rounded-full" />
          <Skeleton className="h-11 w-40 rounded-full" />
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
          <Skeleton className="h-56 w-full rounded-3xl" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <Skeleton className="h-56 w-full rounded-3xl" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-40 w-full rounded-3xl" />
          <Skeleton className="h-48 w-full rounded-3xl" />
        </div>
      </div>
      <span className="sr-only">Loading order details</span>
    </div>
  );
}
