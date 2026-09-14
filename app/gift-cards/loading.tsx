import { Skeleton } from "@/components/ui/skeleton";

export default function GiftCardsLoading() {
  return (
    <div
      role="status"
      aria-label="Loading gift cards experience"
      className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-16 space-y-12"
    >
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 rounded-full" />
        <Skeleton className="h-10 w-3/5 max-w-md rounded-md" />
        <Skeleton className="h-5 w-4/5 max-w-lg rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-12 items-start">
        <div className="space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-4 w-28 rounded-md" />
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-20 rounded-xl" />
              <Skeleton className="h-20 rounded-xl" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-36 rounded-md" />
            <div className="grid grid-cols-4 gap-2.5">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-40 rounded-md" />
            <div className="grid grid-cols-4 gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-11 rounded-full" />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Skeleton className="h-4 w-32 rounded-md" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Skeleton className="h-12 rounded-full" />
              <Skeleton className="h-12 rounded-full" />
            </div>
          </div>

          <Skeleton className="h-14 w-full rounded-full" />
        </div>

        <div className="space-y-6">
          <Skeleton className="aspect-[1.586/1] w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
      </div>

      <span className="sr-only">Loading gift card purchase page...</span>
    </div>
  );
}
