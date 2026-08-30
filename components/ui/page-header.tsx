import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

function PageHeader({ eyebrow, title, description, action, className }: { eyebrow?: string; title: string; description?: string; action?: ReactNode; className?: string }) {
  return (
    <header className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div>
        {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <h1 className="font-serif text-[1.75rem] font-semibold leading-[1.3] text-on-surface md:text-[2rem]">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-on-surface-variant">{description}</p>}
      </div>
      {action}
    </header>
  )
}

export { PageHeader }
