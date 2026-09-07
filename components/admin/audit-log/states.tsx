import { AlertTriangle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function AuditLogSkeleton() {
  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10" aria-label="Loading audit log" aria-busy="true">
      <div className="flex justify-between gap-6">
        <div className="space-y-3"><Skeleton className="h-10 w-52" /><Skeleton className="h-5 w-96 max-w-full" /></div>
        <Skeleton className="hidden h-12 w-36 rounded-full sm:block" />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-28 rounded-2xl" />)}
      </div>
      <Skeleton className="h-24 rounded-2xl" />
      <div className="overflow-hidden rounded-2xl bg-surface-container-lowest">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex items-center gap-5 border-b border-outline-variant/30 p-5">
            <Skeleton className="h-5 w-28" /><Skeleton className="h-10 w-10 rounded-full" /><Skeleton className="h-5 w-40" /><Skeleton className="ml-auto h-7 w-32 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuditLogError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
      <div className="mb-5 grid h-20 w-20 place-items-center rounded-full bg-error-container text-error"><AlertTriangle className="h-9 w-9" /></div>
      <h1 className="font-serif text-3xl">Could not load audit log</h1>
      <p className="mt-2 text-on-surface-variant">A network issue prevented us from retrieving the audit stream. Please retry the connection.</p>
      <Button onClick={onRetry} className="mt-6 min-h-11 rounded-full px-6">Retry connection</Button>
    </div>
  );
}

export function AuditLogNoResults({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest px-5 py-16 text-center shadow-sm">
      <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-secondary-container text-secondary"><SearchX className="h-9 w-9" /></div>
      <h2 className="font-serif text-2xl">No audit events match your filters</h2>
      <p className="mx-auto mt-2 max-w-lg text-on-surface-variant">Try adjusting your search keywords, staff member, action category, or selected date range.</p>
      <Button onClick={onClear} className="mt-6 min-h-11 rounded-full px-6">Clear all filters</Button>
    </div>
  );
}
