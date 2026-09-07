import { AlertTriangle, SearchX, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomersSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10" aria-label="Loading customers" aria-busy="true">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-12 w-36 rounded-full" />
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-28 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl bg-surface-container-lowest">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-5 border-b border-outline-variant/30 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-5 w-52" />
            <Skeleton className="ml-auto h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function CustomersEmpty({ onImport }: { onImport: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        <Users className="h-9 w-9 text-primary" />
      </div>
      <h1 className="font-serif text-3xl text-on-surface">No customers yet</h1>
      <p className="mt-2 text-on-surface-variant">
        Start your journey by importing your existing customer list, or simply wait for your first beautiful order to bloom.
      </p>
      <div className="mt-6 flex gap-3">
        <Button onClick={onImport} variant="outline" className="min-h-11 rounded-full px-6">
          Import Customers
        </Button>
        <Button className="min-h-11 rounded-full px-6">Add Manually</Button>
      </div>
    </div>
  );
}

export function CustomersNoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-surface-container">
        <SearchX className="h-9 w-9 text-primary" />
      </div>
      <h1 className="font-serif text-3xl text-on-surface">No customers found</h1>
      <p className="mt-2 text-on-surface-variant">Try another search or clear your filters to see the full directory.</p>
      <Button onClick={onClear} className="mt-6 min-h-11 rounded-full px-6">
        Clear search and filters
      </Button>
    </div>
  );
}

export function CustomersError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <AlertTriangle className="mb-5 h-12 w-12 text-error" />
      <h1 className="font-serif text-3xl">We couldn’t load customers</h1>
      <p className="mt-2 text-on-surface-variant">The customer directory is unavailable. Please try again.</p>
      <Button onClick={onRetry} className="mt-6 min-h-11 rounded-full px-6">
        Try again
      </Button>
    </div>
  );
}
