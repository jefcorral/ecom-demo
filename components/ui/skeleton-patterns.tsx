import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

function SkeletonCard({ className }: { className?: string }) {
  return <div className={cn("space-y-4", className)}><Skeleton className="aspect-[4/5] w-full rounded-lg" /><Skeleton className="h-5 w-3/4 rounded-md" /><Skeleton className="h-4 w-1/3 rounded-md" /></div>
}

function SkeletonProductGrid({ count = 8, className }: { count?: number; className?: string }) {
  return <div role="status" aria-label="Loading products" className={cn("grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4", className)}>{Array.from({ length: count }).map((_, index) => <SkeletonCard key={index} />)}<span className="sr-only">Loading content</span></div>
}

function SkeletonOrderRow() {
  return <div className="flex items-center gap-4 rounded-lg bg-surface-container-lowest p-4 shadow-sm"><Skeleton className="size-16 shrink-0 rounded-md" /><div className="flex-1 space-y-3"><Skeleton className="h-4 w-36 rounded-md" /><Skeleton className="h-3 w-24 rounded-md" /></div><div className="space-y-3"><Skeleton className="h-6 w-20 rounded-full" /><Skeleton className="ml-auto h-4 w-14 rounded-md" /></div></div>
}

function SkeletonCartItem() {
  return <div className="flex gap-4 border-b border-outline-variant/30 py-5"><Skeleton className="size-24 shrink-0 rounded-lg" /><div className="flex-1 space-y-3"><Skeleton className="h-5 w-2/3 rounded-md" /><Skeleton className="h-4 w-1/3 rounded-md" /><Skeleton className="h-10 w-28 rounded-full" /></div></div>
}

function SkeletonPage({ variant = "products" }: { variant?: "products" | "product" | "cart" | "orders" | "checkout" }) {
  if (variant === "product") return <div role="status" aria-label="Loading product" className="mx-auto grid w-full max-w-[1140px] gap-8 px-4 py-8 md:grid-cols-2 md:px-6"><Skeleton className="aspect-square w-full rounded-lg" /><div className="space-y-6"><Skeleton className="h-10 w-4/5 rounded-md" /><Skeleton className="h-6 w-1/3 rounded-md" /><div className="space-y-3"><Skeleton className="h-4 w-full rounded-md" /><Skeleton className="h-4 w-full rounded-md" /><Skeleton className="h-4 w-4/5 rounded-md" /></div><Skeleton className="h-14 w-full rounded-full" /></div><span className="sr-only">Loading content</span></div>
  if (variant === "cart") return <div role="status" aria-label="Loading cart" className="mx-auto grid w-full max-w-[1140px] gap-8 px-4 py-10 lg:grid-cols-[1fr_360px] lg:px-6"><div>{Array.from({ length: 3 }).map((_, index) => <SkeletonCartItem key={index} />)}</div><Skeleton className="h-72 rounded-lg" /><span className="sr-only">Loading content</span></div>
  if (variant === "orders") return <div role="status" aria-label="Loading orders" className="mx-auto w-full max-w-4xl space-y-4 px-4 py-10">{Array.from({ length: 3 }).map((_, index) => <SkeletonOrderRow key={index} />)}<span className="sr-only">Loading content</span></div>
  if (variant === "checkout") return <div role="status" aria-label="Loading checkout" className="mx-auto grid w-full max-w-[1140px] gap-8 px-4 py-10 lg:grid-cols-[1fr_380px] lg:px-6"><div className="space-y-5">{Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-12 rounded-full" />)}</div><Skeleton className="h-96 rounded-lg" /><span className="sr-only">Loading content</span></div>
  return <div className="mx-auto w-full max-w-[1140px] px-4 py-10 lg:px-6"><div className="mb-8 flex justify-between"><Skeleton className="h-9 w-52 rounded-md" /><Skeleton className="h-10 w-28 rounded-full" /></div><SkeletonProductGrid /></div>
}

export { SkeletonCard, SkeletonCartItem, SkeletonOrderRow, SkeletonPage, SkeletonProductGrid }
