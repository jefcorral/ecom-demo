"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Banknote,
  Calendar,
  ChevronRight,
  Church,
  Clock,
  Download,
  Flower2,
  Hourglass,
  Leaf,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Package,
  PartyPopper,
  Plus,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/providers";
import { cn } from "@/lib/utils";
import { AdminDashboardData } from "@/lib/admin-dashboard";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function DashboardContent({ data }: { data: AdminDashboardData }) {
  const { user } = useAuth();
  const name = user?.firstName || "Admin User";
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    []
  );

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-16 lg:py-10">
      <DashboardHeader name={name} today={today} dateRange={data.dateRange} />
      <div className="hidden lg:block">
        <DesktopDashboard data={data} />
      </div>
      <div className="lg:hidden">
        <MobileDashboard data={data} />
      </div>
    </div>
  );
}

function DashboardHeader({
  name,
  today,
  dateRange,
}: {
  name: string;
  today: string;
  dateRange: string;
}) {
  const router = useRouter();
  return (
    <header className="mb-6 flex flex-col justify-between gap-4 lg:mb-10 lg:flex-row lg:items-end">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-primary">
          Overview
        </p>
        <h1 className="mt-2 font-serif text-3xl text-on-surface">
          {getGreeting()}, {name}.
        </h1>
        <p className="mt-1 flex items-center gap-2 text-sm text-on-surface-variant">
          <Calendar className="h-4 w-4" />
          {today}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-full bg-surface-container px-4 py-2.5">
          <span className="mr-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Date Range
          </span>
          <span className="text-sm font-medium text-on-surface">{dateRange}</span>
          <ChevronRight className="ml-2 h-4 w-4 text-on-surface-variant" />
        </div>
        <Button
          variant="outline"
          className="gap-2 rounded-full border-outline-variant bg-surface-container px-5 py-5 text-on-surface hover:bg-surface-container-high"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
        <Button
          onClick={() => router.push("/dashboard/orders/new")}
          className="gap-2 rounded-full bg-primary-container px-5 py-5 font-medium text-on-primary-container shadow-primary-container/20 hover:-translate-y-0.5 hover:shadow-md"
        >
          <Plus className="h-4 w-4" />
          Create Order
        </Button>
      </div>
    </header>
  );
}

function DesktopDashboard({ data }: { data: AdminDashboardData }) {
  const stats = data.stats!;
  const metrics = [
    { label: "Gross Sales", value: formatCurrency(stats.totalSales), change: 14.2, up: true },
    { label: "Orders", value: stats.totalOrders.toString(), change: 8.5, up: true },
    { label: "Average Order Value", value: formatCurrency(stats.averageOrderValue), change: 2.1, up: false },
    { label: "New Customers", value: stats.totalCustomers.toString(), change: 12.0, up: true },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-on-surface">Revenue Over Time</h3>
              <p className="text-sm text-on-surface-variant">Last 7 days compared to previous 7 days</p>
            </div>
            <button className="text-on-surface-variant transition-colors hover:text-primary">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
          <RevenueChart />
          <div className="mt-4 flex gap-6 border-t border-outline-variant/20 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary" />
              <span className="text-sm text-on-surface">Current Period</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full border border-dashed border-outline-variant" />
              <span className="text-sm text-on-surface-variant">Previous Period</span>
            </div>
          </div>
        </div>
        <OrdersStatusCard data={data} />
      </section>

      <section className="grid grid-cols-3 gap-6">
        <div className="col-span-2 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
          <PriorityOps ops={data.priorityOps} />
        </div>
        <div className="space-y-6">
          <TodaysRoutes routes={data.todaysRoutes} />
          <LowInventory items={data.lowInventory} />
        </div>
      </section>

      <section className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
        <ActionRequired items={data.actionRequired} />
      </section>
    </div>
  );
}

function MobileDashboard({ data }: { data: AdminDashboardData }) {
  const stats = data.stats!;
  const metrics = [
    { label: "Total Orders", value: stats.totalOrders.toString(), change: 12, icon: ShoppingCart },
    { label: "Revenue", value: `$${(stats.totalSales / 1000).toFixed(1)}k`, change: 5, icon: Banknote },
    { label: "Deliveries", value: data.todaysRoutes.stops.toString(), sub: "Scheduled for today", icon: Truck },
  ];

  return (
    <div className="space-y-6 pb-20">
      <p className="text-on-surface-variant">Here is your daily operations overview.</p>
      <Button
        onClick={() => {}}
        className="w-full gap-2 rounded-full bg-primary py-6 text-on-primary"
      >
        <Plus className="h-5 w-5" />
        CREATE ORDER
      </Button>

      <section>
        <div className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-2 snap-x">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className="snap-start w-[200px] flex-none rounded-2xl border border-outline-variant bg-surface-container p-4 shadow-sm"
            >
              <div className="mb-2 flex items-center gap-2 text-sm text-on-surface-variant">
                <metric.icon className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">{metric.label}</span>
              </div>
              <div className="font-serif text-2xl text-on-surface">{metric.value}</div>
              {metric.change ? (
                <div className="mt-1 flex items-center gap-1 text-sm text-secondary">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+{metric.change}% vs last week</span>
                </div>
              ) : (
                <div className="mt-1 text-sm text-on-surface-variant">{metric.sub}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b border-outline-variant pb-2 font-serif text-xl text-on-surface">
          Action Required
        </h2>
        <div className="space-y-4">
          <div className="rounded-2xl bg-error-container p-4 text-on-error-container shadow-sm">
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-error opacity-10" />
            <div className="relative z-10 flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 shrink-0" />
              <div>
                <h3 className="font-medium text-on-error-container">3 Orders Delayed</h3>
                <p className="text-sm opacity-90">Supplier issues with specific exotic blooms. Needs immediate review.</p>
                <Button
                  size="sm"
                  className="mt-3 rounded-full bg-on-error-container px-4 text-xs font-medium uppercase tracking-wide text-error-container"
                >
                  Review Orders
                </Button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-serif text-lg text-on-surface">
                <Truck className="h-5 w-5 text-secondary" />
                Today&apos;s Deliveries
              </h3>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs text-on-secondary">12 Pending</span>
            </div>
            <div className="space-y-2">
              {data.todaysRoutes.routes.slice(0, 2).map((route) => (
                <div
                  key={route.id}
                  className="flex items-center justify-between rounded-lg border border-outline-variant bg-surface p-3"
                >
                  <div>
                    <div className="font-medium text-on-surface">
                      {route.orderId} - {route.location}
                    </div>
                    <div className="text-xs text-on-surface-variant">Delivery by {route.time}</div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-outline" />
                </div>
              ))}
            </div>
            <button className="mt-3 w-full text-center text-sm font-medium uppercase tracking-wider text-secondary">
              View All
            </button>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-primary-container p-4">
            <div className="absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-primary opacity-10" />
            <h3 className="relative z-10 mb-3 flex items-center gap-2 font-serif text-lg text-on-primary-container">
              <Hourglass className="h-5 w-5 fill-primary" />
              Time-Sensitive: Funeral
            </h3>
            <div className="relative z-10 flex items-center justify-between rounded-lg border border-outline-variant/30 bg-surface/60 p-3 backdrop-blur-sm">
              <div>
                <div className="font-medium text-on-primary-container">#ORD-4025 - Standing Spray</div>
                <div className="text-xs text-on-primary-container/80">Service at 10:00 AM Tomorrow</div>
              </div>
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            </div>
          </div>

          <div className="rounded-2xl bg-tertiary-container p-4">
            <h3 className="mb-3 flex items-center gap-2 font-serif text-lg text-on-tertiary-container">
              <Package className="h-5 w-5 text-tertiary" />
              Low Stock Alerts
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.lowInventory.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-tertiary-fixed bg-surface px-3 py-1 text-sm text-on-surface"
                >
                  {item.name} <span className={cn("font-bold", item.urgent ? "text-error" : "text-on-surface")}>({item.quantity})</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 border-b border-outline-variant pb-2 font-serif text-xl text-on-surface">
          Analytics
        </h2>
        <div className="space-y-4">
          <div className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              Revenue Trend (7 Days)
            </h3>
            <div className="h-40 w-full">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 300 100">
                <defs>
                  <linearGradient id="mobileGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2C3E2A" />
                    <stop offset="100%" stopColor="#2C3E2A" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line className="text-outline-variant" stroke="currentColor" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="300" y1="20" y2="20" />
                <line className="text-outline-variant" stroke="currentColor" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="300" y1="50" y2="50" />
                <line className="text-outline-variant" stroke="currentColor" strokeDasharray="2,2" strokeWidth="0.5" x1="0" x2="300" y1="80" y2="80" />
                <path
                  d="M0,100 L0,70 Q30,50 60,60 T120,40 T180,50 T240,20 T300,30 L300,100 Z"
                  fill="url(#mobileGrad)"
                  opacity="0.2"
                />
                <path
                  className="stroke-secondary"
                  d="M0,70 Q30,50 60,60 T120,40 T180,50 T240,20 T300,30"
                  fill="none"
                  stroke="#2C3E2A"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <div className="rounded-2xl border border-outline-variant bg-surface-container p-4">
            <h3 className="mb-4 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
              Orders by Status
            </h3>
            <div className="space-y-3">
              <StatusBar label="Pending" percent={60} color="bg-primary" />
              <StatusBar label="In Progress" percent={25} color="bg-secondary" />
              <StatusBar label="Completed" percent={15} color="bg-tertiary" />
            </div>
          </div>
        </div>
      </section>

      <button className="fixed bottom-24 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-on-secondary shadow-lg z-30">
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}

function StatusBar({ label, percent, color }: { label: string; percent: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs font-medium uppercase text-on-surface-variant">{label}</div>
      <div className="flex-1 h-3 overflow-hidden rounded-full bg-surface">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${percent}%` }} />
      </div>
      <div className="w-8 text-right text-sm text-on-surface">{percent}%</div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  change,
  up,
}: {
  label: string;
  value: string;
  change: number;
  up: boolean;
}) {
  const accents = [
    "bg-secondary-container/20 group-hover:bg-secondary-container/40",
    "bg-primary-container/10 group-hover:bg-primary-container/30",
    "bg-surface-variant/30 group-hover:bg-surface-variant/50",
    "bg-tertiary-container/20 group-hover:bg-tertiary-container/40",
  ];
  const colorIndex = label.length % 4;
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-surface-container-lowest p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div
        className={cn(
          "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-xl transition-colors",
          accents[colorIndex]
        )}
      />
      <p className="relative z-10 text-xs font-medium uppercase tracking-wider text-on-surface-variant">
        {label}
      </p>
      <h3 className="relative z-10 mt-2 font-serif text-3xl text-on-surface">{value}</h3>
      <div className="relative z-10 mt-3 flex items-center gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
            up ? "bg-secondary-container text-on-secondary-container" : "bg-error-container/50 text-on-error-container"
          )}
        >
          {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {change}%
        </span>
        <span className="text-xs text-on-surface-variant">vs last period</span>
      </div>
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="relative flex h-64 w-full flex-col justify-between px-2 pb-8 pt-4">
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-8">
        <div className="h-px bg-outline-variant/20" />
        <div className="h-px bg-outline-variant/20" />
        <div className="h-px bg-outline-variant/20" />
        <div className="h-px bg-outline-variant/20" />
      </div>
      <div className="pointer-events-none absolute -left-8 top-0 bottom-8 flex flex-col justify-between text-right text-[10px] text-on-surface-variant">
        <span>$4k</span>
        <span>$3k</span>
        <span>$2k</span>
        <span>$1k</span>
      </div>
      <svg
        className="absolute inset-0 h-full w-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 1000 200"
      >
        <path
          className="text-primary drop-shadow-[0_4px_12px_rgba(120,89,0,0.3)]"
          d="M0,180 C100,160 200,80 300,100 C400,120 500,40 600,60 C700,80 800,20 900,40 L1000,30"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="text-outline-variant"
          d="M0,150 C100,170 200,120 300,140 C400,160 500,110 600,120 C700,130 800,90 900,110 L1000,100"
          fill="none"
          stroke="currentColor"
          strokeDasharray="6 6"
          strokeWidth="2"
        />
        <circle className="text-primary" cx="200" cy="80" fill="#FBF9F4" r="5" stroke="currentColor" strokeWidth="2" />
        <circle className="text-primary" cx="500" cy="40" fill="#FBF9F4" r="5" stroke="currentColor" strokeWidth="2" />
        <circle className="text-primary" cx="800" cy="20" fill="#FBF9F4" r="5" stroke="currentColor" strokeWidth="2" />
      </svg>
      <div className="absolute -bottom-6 flex w-full justify-between px-4 text-[11px] text-on-surface-variant">
        <span>Oct 17</span>
        <span>Oct 19</span>
        <span>Oct 21</span>
        <span>Oct 23</span>
      </div>
    </div>
  );
}

function OrdersStatusCard({ data }: { data: AdminDashboardData }) {
  const { total, processing, completed, pending } = data.ordersByStatus;
  const r = 40;
  const c = 2 * Math.PI * r;
  const segments = [
    { pct: processing / 100, color: "text-primary" },
    { pct: completed / 100, color: "text-secondary" },
    { pct: pending / 100, color: "text-tertiary" },
  ];
  let offset = 0;

  return (
    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <h3 className="mb-6 font-serif text-xl text-on-surface">Orders by Status</h3>
      <div className="relative flex items-center justify-center py-4">
        <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
          <circle className="text-surface-variant" cx="50" cy="50" fill="transparent" r={r} stroke="currentColor" strokeWidth="12" />
          {segments.map((segment, i) => {
            const arc = segment.pct * c;
            const dash = `${arc} ${c - arc}`;
            const start = -offset * c;
            offset += segment.pct;
            return (
              <circle
                key={i}
                className={segment.color}
                cx="50"
                cy="50"
                fill="transparent"
                r={r}
                stroke="currentColor"
                strokeDasharray={dash}
                strokeDashoffset={start}
                strokeWidth="12"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-2xl text-on-surface">{total}</span>
          <span className="text-xs text-on-surface-variant">Total</span>
        </div>
      </div>
      <div className="mt-2 space-y-3">
        <Legend color="bg-primary" label="Processing" value={`${processing}%`} />
        <Legend color="bg-secondary" label="Completed" value={`${completed}%`} />
        <Legend color="bg-tertiary" label="Pending" value={`${pending}%`} />
      </div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={cn("h-2 w-2 rounded-full", color)} />
        <span className="text-sm text-on-surface">{label}</span>
      </div>
      <span className="text-sm font-medium text-on-surface">{value}</span>
    </div>
  );
}

function PriorityOps({
  ops,
}: {
  ops: AdminDashboardData["priorityOps"];
}) {
  const iconMap: Record<string, typeof Church> = {
    church: Church,
    celebration: PartyPopper,
  };

  return (
    <div className="relative">
      <div className="absolute top-0 left-0 h-full w-1 bg-tertiary" />
      <div className="mb-6 flex items-end justify-between pl-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-tertiary">
            <AlertTriangle className="h-4 w-4" />
            <p className="text-xs font-semibold uppercase tracking-wider">Priority Operations</p>
          </div>
          <h3 className="font-serif text-xl text-on-surface">Event &amp; Funeral Deadlines</h3>
        </div>
        <button className="border-b border-outline-variant pb-1 text-xs font-medium uppercase tracking-widest text-on-surface hover:text-primary">
          View All
        </button>
      </div>
      <div className="space-y-3 pl-4">
        {ops.map((op) => {
          const Icon = iconMap[op.icon] || Flower2;
          const statusClasses =
            op.statusColor === "primary"
              ? "bg-primary-container text-on-primary-container"
              : op.statusColor === "tertiary"
                ? "bg-tertiary-container text-on-tertiary-container"
                : "bg-surface-variant text-on-surface-variant";
          return (
            <div
              key={op.id}
              className="group flex items-center justify-between rounded-lg bg-surface p-4 transition-colors hover:bg-surface-container"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-surface-variant text-on-surface-variant transition-colors group-hover:bg-primary-container group-hover:text-on-primary-container">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-on-surface">{op.title}</p>
                  <p className="flex items-center gap-1 text-sm text-on-surface-variant">
                    <Clock className="h-3.5 w-3.5" /> {op.due}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={cn("rounded-full px-3 py-1 text-xs font-medium", statusClasses)}>
                  {op.status}
                </span>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container transition-colors hover:bg-surface-variant">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ActionRequired({
  items,
}: {
  items: AdminDashboardData["actionRequired"];
}) {
  return (
    <div>
      <div className="mb-6">
        <h3 className="font-serif text-xl text-on-surface">Action Required</h3>
        <p className="text-sm text-on-surface-variant">Orders needing attention before fulfillment</p>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse text-left">
          <thead>
            <tr className="border-b border-outline-variant/30">
              <th className="pb-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant">Order</th>
              <th className="pb-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant">Customer</th>
              <th className="pb-3 text-xs font-medium uppercase tracking-wider text-on-surface-variant">Issue</th>
              <th className="pb-3 text-right text-xs font-medium uppercase tracking-wider text-on-surface-variant">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="group border-b border-outline-variant/10 transition-colors hover:bg-surface-container/50"
              >
                <td className="py-4 font-medium text-on-surface">{item.orderId}</td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 font-medium text-primary text-xs">
                      {item.initials}
                    </div>
                    <span className="text-sm text-on-surface">{item.customer}</span>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                      item.issueType === "error"
                        ? "bg-error-container/30 text-error"
                        : "bg-surface-variant text-on-surface-variant"
                    )}
                  >
                    {item.issueType === "error" ? (
                      <AlertTriangle className="h-3 w-3" />
                    ) : (
                      <MessageSquare className="h-3 w-3" />
                    )}
                    {item.issue}
                  </span>
                </td>
                <td className="py-4 text-right">
                  <button className="text-sm font-medium text-primary hover:underline">{item.action}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TodaysRoutes({ routes }: { routes: AdminDashboardData["todaysRoutes"] }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-serif text-xl text-on-surface">Today&apos;s Routes</h3>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs text-on-secondary">
          {routes.stops} stops
        </span>
      </div>
      <div className="relative mb-4 h-40 overflow-hidden rounded-xl bg-surface-container">
        <div className="absolute inset-0 opacity-30">
          <svg className="h-full w-full" viewBox="0 0 200 100" preserveAspectRatio="none">
            <path d="M0,80 Q50,60 100,70 T200,30" fill="none" stroke="#50634d" strokeWidth="2" />
            <path d="M0,90 Q60,50 120,60 T200,40" fill="none" stroke="#50634d" strokeWidth="1.5" opacity="0.5" />
          </svg>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin className="h-8 w-8 text-secondary" />
        </div>
        <div className="absolute bottom-2 right-2 rounded-full bg-surface px-2 py-1 text-xs text-on-surface">
          Portland, OR
        </div>
      </div>
      <div className="space-y-3">
        {routes.routes.map((route, index) => (
          <div key={route.id} className="flex gap-3">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-on-primary">
              {index + 1}
            </div>
            <div>
              <p className="text-sm font-medium text-on-surface">
                {route.time} - {route.location}
              </p>
              <p className="text-xs text-on-surface-variant">
                Order {route.orderId} · {route.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LowInventory({ items }: { items: AdminDashboardData["lowInventory"] }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-error">
        <AlertTriangle className="h-5 w-5" />
        <h3 className="font-serif text-xl text-on-surface">Low Inventory</h3>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <span className="text-sm text-on-surface">{item.name}</span>
            <span
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium",
                item.urgent ? "bg-error-container/30 text-error" : "bg-surface text-on-surface-variant"
              )}
            >
              {item.quantity}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
