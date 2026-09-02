import { BadgeCheck, MapPin, Scissors, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: Truck, label: "Same-Day Delivery", description: "Order by 2pm for delivery today" },
  { icon: BadgeCheck, label: "Freshness Guaranteed", description: "7-day freshness promise" },
  { icon: MapPin, label: "Locally Sourced", description: "Partnering with local growers" },
  { icon: Scissors, label: "Designed by Florists", description: "Hand-arranged by our team" },
];

export function TrustBar({ className }: { className?: string }) {
  return (
    <section aria-label="Our service promises" className={cn("border-y border-outline-variant/30 bg-surface-container-lowest py-8", className)}>
      <div className="mx-auto grid max-w-[1140px] grid-cols-2 gap-x-4 gap-y-8 px-4 md:grid-cols-4 md:px-6">
        {items.map(({ icon: Icon, label, description }) => (
          <div key={label} className="group flex flex-col items-center gap-2 text-center md:flex-row md:items-start md:text-left">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container text-primary transition-transform duration-200 group-hover:scale-110 md:h-10 md:w-10"><Icon className="h-6 w-6 md:h-5 md:w-5" /></span>
            <span><strong className="block text-xs font-semibold uppercase tracking-wider text-on-surface">{label}</strong><span className="mt-1 hidden text-xs leading-5 text-on-surface-variant lg:block">{description}</span></span>
          </div>
        ))}
      </div>
    </section>
  );
}
