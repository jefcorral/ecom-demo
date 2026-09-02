import type { ComponentType, ReactNode } from "react"
import { AlertCircle, Flower2 } from "lucide-react"
import { cn } from "@/lib/utils"

function EmptyState({ title, description, action, secondaryAction, icon: Icon = Flower2, variant = "empty", className }: { title: string; description: string; action?: ReactNode; secondaryAction?: ReactNode; icon?: ComponentType<{ className?: string }>; variant?: "empty" | "error"; className?: string }) {
  const StateIcon = variant === "error" ? AlertCircle : Icon
  return (
    <section className={cn("flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3", className)} aria-labelledby="state-title">
      <div className={cn("relative mb-8 flex size-40 items-center justify-center overflow-hidden rounded-[2rem] bg-[#f7f1da] shadow-md sm:size-48", variant === "error" && "bg-error-container/45")}>
        <Flower2 className="absolute -bottom-8 -right-8 size-32 text-primary/10" />
        <StateIcon className={cn("relative size-20 stroke-[1.2] text-[#9a7300] sm:size-24", variant === "error" && "text-error")} />
      </div>
      <h2 id="state-title" className="max-w-xl font-serif text-[28px] font-semibold leading-tight text-on-surface sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-lg text-base leading-7 text-on-surface-variant sm:text-lg">{description}</p>
      {(action || secondaryAction) && <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center gap-3 sm:flex-row">{action}{secondaryAction}</div>}
    </section>
  )
}

export { EmptyState }
