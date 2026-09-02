import Link from "next/link";
import { Flower2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AuthCard({ title, description, icon: Icon, children, className, hideHeader = false }: { title: string; description: string; icon?: LucideIcon; children: React.ReactNode; className?: string; hideHeader?: boolean }) {
  return (
    <div className="relative -mt-16 flex min-h-screen flex-col items-center overflow-hidden bg-surface px-4 py-10 sm:px-6 sm:py-14 lg:py-10">
      <div className="pointer-events-none absolute -right-32 -top-20 h-[560px] w-[560px] rounded-full bg-surface-container-low/60" />
      <Flower2 className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 text-primary opacity-[0.025] md:hidden" />
      <section className={cn("relative z-10 mt-10 w-full max-w-[440px] overflow-hidden rounded-xl bg-surface-container-lowest p-6 shadow-md transition-transform duration-300 hover:scale-[1.01] sm:mt-28", className)} aria-labelledby={hideHeader ? undefined : "auth-title"} aria-label={hideHeader ? title : undefined}>
        <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-primary-fixed/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-secondary-container/20 blur-2xl" />
        {!hideHeader && <div className="relative z-10 mb-6 flex flex-col items-center text-center">
          {Icon && <Icon className="mb-2 h-9 w-9 text-[#785900]" />}
          <h1 id="auth-title" className="font-serif text-[28px] font-semibold leading-[1.3] text-on-surface sm:text-[32px]">{title}</h1>
          <p className="mt-1 max-w-sm text-base leading-6 text-on-surface-variant">{description}</p>
        </div>}
        <div className="relative z-10">{children}</div>
      </section>
    </div>
  );
}
