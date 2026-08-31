import { Check, PackageCheck, PackageOpen, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { label: "Order Placed", time: "9:00 AM", icon: Check },
  { label: "Confirmed", time: "10:15 AM", icon: Check },
  { label: "Arranged", time: "11:30 AM", icon: PackageOpen },
  { label: "Out for Delivery", time: "1:15 PM", icon: Truck },
  { label: "Delivered", time: "By 4:00 PM", icon: PackageCheck },
];

export function OrderTimeline({ activeStep = 3 }: { activeStep?: number }) {
  return <ol aria-label="Order progress" className="relative flex flex-col gap-0 md:flex-row md:justify-between"><span aria-hidden="true" className="absolute bottom-5 left-4 top-5 w-0.5 bg-outline-variant md:left-5 md:right-5 md:top-4 md:h-0.5 md:w-auto" />{steps.map(({ label, time, icon: Icon }, index) => { const complete = index < activeStep; const active = index === activeStep; return <li key={label} aria-current={active ? "step" : undefined} className="relative flex min-h-16 flex-1 items-start gap-4 md:flex-col md:items-center md:gap-2 md:text-center"><span className={cn("relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-surface-container-lowest bg-surface-container-high text-on-surface-variant", complete && "bg-[#785900] text-white", active && "bg-primary-container text-on-primary-container motion-safe:animate-pulse")}><Icon className="size-4" /></span><span><strong className={cn("block text-sm font-medium", active && "font-semibold text-[#785900]")}>{label}</strong><span className="text-xs text-on-surface-variant">{time}</span></span></li>; })}</ol>;
}
