import { Skeleton } from "@/components/ui/skeleton";

export default function ContactLoading() {
  return (
    <div
      role="status"
      aria-label="Loading contact and florist support page"
      className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-16 space-y-12"
    >
      <div className="space-y-3">
        <Skeleton className="h-4 w-36 rounded-full" />
        <Skeleton className="h-10 w-3/5 max-w-md rounded-md" />
        <Skeleton className="h-5 w-4/5 max-w-lg rounded-md" />
      </div>

      {/* 4 channel cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 w-full rounded-3xl" />
        ))}
      </div>

      {/* Form and Location grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        <div className="lg:col-span-7 space-y-6">
          <Skeleton className="h-8 w-48 rounded-md" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 rounded-full" />
            <Skeleton className="h-12 rounded-full" />
          </div>
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-14 w-full rounded-full" />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>

      <span className="sr-only">Loading contact support page...</span>
    </div>
  );
}
