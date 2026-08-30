import type { ComponentType, ReactNode } from "react"
import { AlertCircle, Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"

function EmptyState({ title, description, action, icon: Icon = Flower2, variant = "empty", className }: { title: string; description: string; action?: ReactNode; icon?: ComponentType<{ className?: string }>; variant?: "empty" | "error"; className?: string }) {
  const StateIcon = variant === "error" ? AlertCircle : Icon
  return (
    <div className={cn("flex flex-col items-center px-4 py-16 text-center", className)}>
      <span className={cn("mb-6 flex size-20 items-center justify-center rounded-full", variant === "error" ? "bg-error-container text-error" : "bg-primary-fixed text-on-primary-fixed")}><StateIcon className="size-10 stroke-[1.5]" /></span>
      <h2 className="font-serif text-2xl font-semibold text-on-surface">{title}</h2>
      <p className="mt-2 max-w-md text-on-surface-variant">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export { EmptyState }
