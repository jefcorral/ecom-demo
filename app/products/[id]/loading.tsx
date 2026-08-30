import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-16">
      <Skeleton className="mb-6 h-4 w-72" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        <Skeleton className="aspect-square rounded-2xl lg:col-span-7" />
        <div className="space-y-6 lg:col-span-5">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-16 rounded-lg" />)}
          </div>
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
