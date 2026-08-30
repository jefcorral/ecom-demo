import { cn } from "@/lib/utils"

function Price({ price, salePrice, className }: { price: number; salePrice?: number | null; className?: string }) {
  if (salePrice == null) return <span className={cn("font-medium text-on-surface", className)}>${price.toFixed(2)}</span>

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span className="font-medium text-error">${salePrice.toFixed(2)}</span>
      <span className="text-sm text-outline line-through">${price.toFixed(2)}</span>
    </span>
  )
}

export { Price }
