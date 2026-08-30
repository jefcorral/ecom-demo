import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-12">
      <div className="mx-auto mb-12 flex max-w-2xl justify-between">
        {Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-9 w-9 rounded-full" />)}
      </div>
      <div className="grid gap-10 lg:grid-cols-[1.45fr_1fr] lg:gap-16">
        <div><Skeleton className="mb-8 h-11 w-64" /><Skeleton className="h-[410px] rounded-2xl" /><Skeleton className="mt-8 h-[270px] rounded-2xl" /></div>
        <Skeleton className="h-[620px] rounded-2xl" />
      </div>
    </div>
  );
}
