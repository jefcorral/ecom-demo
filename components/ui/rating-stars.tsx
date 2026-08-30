"use client"

import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

function RatingStars({ value, count, interactive = false, onChange, className }: { value: number; count?: number; interactive?: boolean; onChange?: (value: number) => void; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)} aria-label={`${value} out of 5 stars`}>
      <div className="flex text-primary">
        {Array.from({ length: 5 }, (_, index) => {
          const rating = index + 1
          const star = <Star className={cn("h-4 w-4", rating <= Math.round(value) && "fill-current")} />
          return interactive ? <button key={rating} type="button" aria-label={`Rate ${rating} stars`} onClick={() => onChange?.(rating)} className="flex size-11 items-center justify-center rounded-full active:scale-95">{star}</button> : <span key={rating}>{star}</span>
        })}
      </div>
      {count != null && <span className="text-xs text-on-surface-variant">{value.toFixed(1)} ({count})</span>}
    </div>
  )
}

export { RatingStars }
