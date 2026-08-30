import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-16">
      <Skeleton className="mb-10 h-4 w-40" />
      <div className="grid gap-10 lg:grid-cols-[1.85fr_1fr] lg:gap-16">
        <div>
          <Skeleton className="mb-6 h-10 w-52" />
          <div className="space-y-6">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="flex gap-4 rounded-xl bg-surface-container-lowest p-4 md:p-6">
                <Skeleton className="h-28 w-24 shrink-0 rounded-lg md:h-[140px] md:w-[140px]" />
                <div className="flex-1 space-y-3"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/3" /><Skeleton className="mt-8 h-10 w-28 rounded-full" /></div>
              </div>
            ))}
          </div>
        </div>
        <Skeleton className="h-[440px] rounded-2xl" />
      </div>
    </div>
  );
}
