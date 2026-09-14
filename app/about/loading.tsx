import { Skeleton } from "@/components/ui/skeleton";

export default function AboutLoading() {
  return (
    <div
      role="status"
      aria-label="Loading About page"
      className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-16 space-y-16"
    >
      {/* Hero skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-12 w-4/5 rounded-md" />
          <Skeleton className="h-20 w-full rounded-md" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-14 w-44 rounded-full" />
            <Skeleton className="h-14 w-40 rounded-full" />
          </div>
        </div>
        <div className="lg:col-span-5">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
        </div>
      </div>

      {/* Story skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5">
          <Skeleton className="aspect-[3/4] w-full rounded-3xl" />
        </div>
        <div className="lg:col-span-7 space-y-4">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>

      {/* Florist grid skeleton */}
      <div className="space-y-6">
        <Skeleton className="h-8 w-60 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full rounded-3xl" />
          ))}
        </div>
      </div>

      <span className="sr-only">Loading about page...</span>
    </div>
  );
}
