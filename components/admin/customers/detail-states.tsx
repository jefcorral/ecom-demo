import { AlertTriangle, ArrowLeft, FileX, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CustomerDetailSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10" aria-label="Loading customer profile" aria-busy="true">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-5 w-32" />
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <div className="space-y-4 lg:col-span-2">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export function CustomerDetailError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <AlertTriangle className="mb-5 h-12 w-12 text-error" />
      <h1 className="font-serif text-3xl">Unable to Load Customer</h1>
      <p className="mt-2 text-on-surface-variant">
        We encountered a temporary issue retrieving this profile. Please check your connection or try again later.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onRetry} className="min-h-11 rounded-full px-6">
          <RefreshCw className="h-4 w-4" />
          Retry Connection
        </Button>
        <Link
          href="/dashboard/customers"
          className={cn(buttonVariants({ variant: "outline", size: "default" }), "min-h-11 rounded-full px-6")}
        >
          <ArrowLeft className="h-4 w-4" />
          Return to Directory
        </Link>
      </div>
    </div>
  );
}

export function CustomerDetailNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <FileX className="mb-5 h-12 w-12 text-on-surface-variant" />
      <h1 className="font-serif text-3xl">Customer not found</h1>
      <p className="mt-2 text-on-surface-variant">We couldn’t find the customer profile you requested.</p>
      <Link
        href="/dashboard/customers"
        className={cn(buttonVariants({ size: "default" }), "mt-6 min-h-11 rounded-full px-6")}
      >
        Return to Directory
      </Link>
    </div>
  );
}
