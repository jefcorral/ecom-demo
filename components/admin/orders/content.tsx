"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Church,
  Clock,
  Download,
  Filter,
  Home,
  MapPin,
  MoreVertical,
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Star,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AdminOrder, AdminOrdersData } from "@/lib/admin-orders";
import { OrdersEmpty } from "./empty";
import { OrdersNoResults } from "./no-results";
import { OrderFilterDrawer, getDraft, buildFilters } from "./filter-drawer";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

const statusConfig: Record<
  AdminOrder["status"],
  { label: string; classes: string; dot: string; icon?: typeof Clock }
> = {
  pending: { label: "Pending", classes: "bg-tertiary-fixed/40 text-on-tertiary-fixed border border-tertiary/20", dot: "bg-tertiary", icon: Clock },
  designing: { label: "Designing", classes: "bg-tertiary-container/30 text-on-tertiary-container border border-tertiary/20", dot: "bg-tertiary" },
  sourcing: { label: "Sourcing", classes: "bg-primary-container/20 text-on-primary-container border border-primary/20", dot: "bg-primary", icon: Package },
  in_progress: { label: "In Progress", classes: "bg-primary-container/20 text-on-primary-container border border-primary/20", dot: "bg-primary", icon: Truck },
  delivered: { label: "Delivered", classes: "bg-secondary-container text-on-secondary-container border border-secondary/20", dot: "bg-secondary", icon: CheckCircle },
  cancelled: { label: "Cancelled", classes: "bg-error-container/30 text-error border border-error/20", dot: "bg-error", icon: X },
};

const statusLineColors: Record<AdminOrder["status"], string> = {
  pending: "bg-tertiary-container",
  designing: "bg-tertiary-container",
  sourcing: "bg-primary-container",
  in_progress: "bg-primary-container",
  delivered: "bg-secondary-container",
  cancelled: "bg-error-container",
};

const venueIcons: Record<AdminOrder["venueType"], typeof Home> = {
  church: Church,
  residence: Home,
  office: Building2,
  event: Building2,
};

export function OrdersContent({ data }: { data: AdminOrdersData }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusChip, setStatusChip] = useState<"all" | "pending" | "in_progress" | "delivered">("all");
  const [activeFilters, setActiveFilters] = useState<{ key: string; value: string }[]>([
    { key: "Status", value: "Pending" },
    { key: "Date", value: "This Week" },
  ]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDraft, setFilterDraft] = useState(() => getDraft(activeFilters));

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = data.orders.filter((order) => {
      if (statusChip !== "all") {
        const mapping: Record<string, AdminOrder["status"][]> = {
          pending: ["pending", "designing"],
          in_progress: ["in_progress", "sourcing"],
          delivered: ["delivered"],
        };
        if (!mapping[statusChip].includes(order.status)) return false;
      }
      if (!term) return true;
      const searchable = `${order.number} ${order.customer.name} ${order.customer.email} ${order.recipient} ${order.venue} ${order.category}`.toLowerCase();
      return searchable.includes(term);
    });

    const allowedStatuses = new Set<AdminOrder["status"]>();
    activeFilters.forEach((filter) => {
      if (filter.key === "Status" && filter.value !== "All") {
        const value = filter.value.toLowerCase();
        const map: Record<string, AdminOrder["status"][]> = {
          pending: ["pending"],
          designing: ["designing"],
          fulfilled: ["delivered"],
          "in progress": ["in_progress", "sourcing"],
          delivered: ["delivered"],
          cancelled: ["cancelled"],
        };
        const statuses = map[value];
        if (statuses) statuses.forEach((s) => allowedStatuses.add(s));
      }
    });
    if (allowedStatuses.size > 0) {
      list = list.filter((order) => allowedStatuses.has(order.status));
    }

    return list;
  }, [data.orders, search, statusChip, activeFilters]);

  const paged = useMemo(() => filtered.slice((page - 1) * data.limit, page * data.limit), [filtered, page, data.limit]);
  const totalPages = Math.ceil((search ? filtered.length : data.total) / data.limit) || 1;
  const start = (page - 1) * data.limit + 1;
  const end = Math.min(page * data.limit, search ? filtered.length : data.total);

  const toggleSelectAll = () => {
    if (selected.size === paged.length && paged.length > 0) {
      setSelected(new Set());
    } else {
      setSelected(new Set(paged.map((o) => o.id)));
    }
  };

  const toggleRow = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const clearFilters = () => {
    setSearch("");
    setStatusChip("all");
    setActiveFilters([]);
    setFilterDraft(getDraft([]));
    setPage(1);
  };

  const applyFilters = (filters: { key: string; value: string }[]) => {
    setActiveFilters(filters);
    setFilterDraft(getDraft(filters));
    setStatusChip("all");
    setPage(1);
  };

  const openFilters = () => {
    setFilterDraft(getDraft(activeFilters));
    setFilterOpen(true);
  };

  if (filtered.length === 0 && (search || statusChip !== "all" || activeFilters.length > 0)) {
    return <OrdersNoResults search={search} onClear={clearFilters} />;
  }

  if (data.total === 0) {
    return <OrdersEmpty onCreate={() => router.push("/dashboard/orders/new")} />;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-16 lg:py-10">
      <div className="hidden lg:block">
        <DesktopOrders
          data={data}
          paged={paged}
          start={start}
          end={end}
          totalPages={totalPages}
          page={page}
          setPage={setPage}
          search={search}
          setSearch={setSearch}
          statusChip={statusChip}
          setStatusChip={setStatusChip}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
          selected={selected}
          toggleSelectAll={toggleSelectAll}
          toggleRow={toggleRow}
          bulkOpen={bulkOpen}
          setBulkOpen={setBulkOpen}
          onOpenFilters={openFilters}
        />
      </div>
      <div className="lg:hidden">
        <MobileOrders
          data={data}
          paged={paged}
          search={search}
          setSearch={setSearch}
          statusChip={statusChip}
          setStatusChip={setStatusChip}
          onOpenFilters={openFilters}
        />
      </div>
      <OrderFilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        draft={filterDraft ?? getDraft(activeFilters)}
        onDraftChange={setFilterDraft}
        onApply={applyFilters}
        onClear={clearFilters}
      />
    </div>
  );
}

function DesktopOrders({
  data,
  paged,
  start,
  end,
  totalPages,
  page,
  setPage,
  search,
  setSearch,
  statusChip,
  setStatusChip,
  activeFilters,
  setActiveFilters,
  selected,
  toggleSelectAll,
  toggleRow,
  bulkOpen,
  setBulkOpen,
  onOpenFilters,
}: {
  data: AdminOrdersData;
  paged: AdminOrder[];
  start: number;
  end: number;
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
  search: string;
  setSearch: (s: string) => void;
  statusChip: string;
  setStatusChip: (s: "all" | "pending" | "in_progress" | "delivered") => void;
  activeFilters: { key: string; value: string }[];
  setActiveFilters: (f: { key: string; value: string }[]) => void;
  selected: Set<string>;
  toggleSelectAll: () => void;
  toggleRow: (id: string) => void;
  bulkOpen: boolean;
  setBulkOpen: (v: boolean) => void;
  onOpenFilters: () => void;
}) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Management</p>
          <h1 className="font-serif text-4xl text-on-surface">
            Orders <span className="ml-2 text-2xl text-on-surface-variant">{data.total.toLocaleString()}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 rounded-full border-outline px-6 py-5 text-on-surface hover:bg-surface-variant/30"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => router.push("/dashboard/orders/new")}
            className="gap-2 rounded-full bg-primary-container px-6 py-5 font-medium text-on-primary-container hover:-translate-y-0.5 hover:shadow-md"
          >
            <Plus className="h-5 w-5" />
            Create Order
          </Button>
        </div>
      </header>

      <section className="rounded-3xl bg-surface-container-lowest p-6 shadow-sm">
        <div className="mb-4 flex flex-col items-center justify-between gap-4 border-b border-outline-variant/30 pb-4 md:flex-row">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant/70" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search orders, clients, venues..."
              className="w-full rounded-full border-outline-variant/40 bg-surface-container-low py-3 pl-12 pr-4"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={onOpenFilters}
              variant="outline"
              className="gap-2 rounded-full border-outline-variant/40 bg-surface-container-low text-on-surface-variant"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-2 lg:flex-row lg:items-center">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-on-surface-variant/70">Active:</span>
            {activeFilters.map((filter, index) => (
              <span
                key={`${filter.key}-${index}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary-container/30 px-3 py-1.5 text-xs text-on-secondary-container"
              >
                <span className="font-semibold">{filter.key}:</span> {filter.value}
                <button
                  onClick={() => setActiveFilters(activeFilters.filter((_, i) => i !== index))}
                  className="rounded-full p-0.5 hover:bg-error-container/50 hover:text-error"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            {activeFilters.length > 0 && (
              <button
                onClick={() => setActiveFilters([])}
                className="ml-2 text-xs text-secondary underline-offset-4 hover:text-primary hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="relative flex items-center gap-3">
            <label className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-surface-variant/20">
              <input
                type="checkbox"
                checked={paged.length > 0 && selected.size === paged.length}
                onChange={toggleSelectAll}
                className="h-5 w-5 rounded-full border-outline-variant accent-secondary"
              />
              <span className="text-sm font-medium text-on-surface">{selected.size} Selected</span>
            </label>
            <div className="h-6 w-px bg-outline-variant/30" />
            <Button
              disabled={selected.size === 0}
              onClick={() => setBulkOpen(!bulkOpen)}
              className="relative gap-2 rounded-full bg-surface-container px-5 py-2 text-sm font-medium text-on-surface disabled:opacity-50"
            >
              Bulk Actions
              <ChevronDown className="h-4 w-4" />
            </Button>
            {bulkOpen && selected.size > 0 && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-2 shadow-lg">
                <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-variant/30">
                  <CheckCircle className="h-4 w-4" /> Mark Paid
                </button>
                <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-on-surface hover:bg-surface-variant/30">
                  <Truck className="h-4 w-4" /> Mark Fulfilled
                </button>
                <div className="my-1 h-px bg-outline-variant/20" />
                <button className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-error hover:bg-error-container hover:text-on-error-container">
                  <X className="h-4 w-4" /> Cancel Selected
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1200px] border-collapse text-left">
            <thead className="border-b border-outline-variant/30 bg-surface-container/30 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">
              <tr>
                <th className="w-12 py-4 pl-6" />
                <th className="px-4 py-4">Order</th>
                <th className="px-4 py-4">Customer</th>
                <th className="px-4 py-4">Recipient &amp; Venue</th>
                <th className="px-4 py-4">Target Date</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Total</th>
                <th className="w-16 py-4 pr-6" />
              </tr>
            </thead>
            <tbody>
              {paged.map((order) => (
                <OrderRow key={order.id} order={order} selected={selected.has(order.id)} onToggle={() => toggleRow(order.id)} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant/20 p-4">
          <span className="text-sm text-on-surface-variant">
            Showing {start}-{end} of {data.total.toLocaleString()}
          </span>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </section>
    </div>
  );
}

function OrderRow({ order, selected, onToggle }: { order: AdminOrder; selected: boolean; onToggle: () => void }) {
  const status = statusConfig[order.status];
  const VenueIcon = venueIcons[order.venueType];
  const payment = order.payment === "paid" ? { label: "Paid", icon: CheckCircle, color: "text-secondary" } : { label: "Partial (50%)", icon: Clock, color: "text-tertiary" };

  return (
    <tr className="group relative border-b border-surface-variant/40 transition-colors hover:bg-surface-variant/5">
      <td className={cn("absolute left-0 top-0 h-full w-1 rounded-r-full opacity-70", statusLineColors[order.status])} />
      <td className="py-5 pl-6 align-top pt-6">
        <input
          type="checkbox"
          checked={selected}
          onChange={onToggle}
          className="h-5 w-5 rounded-full border-outline-variant accent-secondary"
        />
      </td>
      <td className="px-4 py-5 align-top pt-6">
        <div className="flex flex-col gap-1">
          <span className="font-serif text-base font-medium leading-tight text-on-surface">{order.number}</span>
          <span className="text-xs text-on-surface-variant/70">{order.createdAt}</span>
          <span className="mt-2 w-fit rounded bg-surface-container px-2 py-0.5 text-[10px] font-medium text-on-surface-variant">{order.category}</span>
        </div>
      </td>
      <td className="px-4 py-5 align-top pt-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-variant/50 text-sm font-medium text-secondary">
            {order.customer.initials || order.customer.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium text-on-surface">{order.customer.name}</span>
            <span className="truncate text-[13px] text-on-surface-variant">{order.customer.email}</span>
            {order.customer.isVip && (
              <span className="mt-1 flex items-center gap-1 text-xs text-on-surface-variant/60">
                <Star className="h-3 w-3 fill-tertiary text-tertiary" /> VIP Client
              </span>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-5 align-top pt-5">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-on-surface">{order.recipient}</span>
          <span className="truncate text-[13px] text-on-surface-variant">
            <VenueIcon className="mr-1 inline h-3.5 w-3.5" />
            {order.venue}
          </span>
          <span className="ml-5 truncate text-xs text-on-surface-variant/70">{order.address}</span>
        </div>
      </td>
      <td className="px-4 py-5 align-top pt-5">
        <div className="flex min-w-0 flex-col">
          <span className={cn("flex items-center gap-1.5 text-sm font-medium", order.timingNote ? "text-error" : "text-on-surface")}>
            <Calendar className="h-4 w-4" />
            {order.targetDate}
          </span>
          <span className="mt-0.5 text-[13px] text-on-surface-variant">{order.serviceTime}</span>
          {order.timingNote && (
            <span className="mt-1 w-fit rounded bg-tertiary-fixed/30 px-2 py-0.5 text-xs text-on-tertiary-fixed">{order.timingNote}</span>
          )}
        </div>
      </td>
      <td className="px-4 py-5 align-top pt-6">
        <div className="flex flex-col gap-2">
          <span className={cn("inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium", status.classes)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
          <span className={cn("flex items-center gap-1 text-xs", payment.color)}>
            <payment.icon className="h-3.5 w-3.5" /> {payment.label}
          </span>
        </div>
      </td>
      <td className="px-4 py-5 align-top pt-6 text-right">
        <div className="flex flex-col items-end gap-1">
          <span className="font-serif text-lg text-on-surface">{formatCurrency(order.total)}</span>
          <span className="text-xs text-on-surface-variant/50">Updated 2h ago</span>
        </div>
      </td>
      <td className="py-5 pr-6 align-top pt-6 text-right">
        <button className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/50">
          <MoreVertical className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function MobileOrders({
  data,
  paged,
  search,
  setSearch,
  statusChip,
  setStatusChip,
  onOpenFilters,
}: {
  data: AdminOrdersData;
  paged: AdminOrder[];
  search: string;
  setSearch: (s: string) => void;
  statusChip: "all" | "pending" | "in_progress" | "delivered";
  setStatusChip: (s: "all" | "pending" | "in_progress" | "delivered") => void;
  onOpenFilters: () => void;
}) {
  const chips = [
    { key: "all", label: `All`, count: data.statusCounts.all },
    { key: "pending", label: `Pending`, count: data.statusCounts.pending },
    { key: "in_progress", label: `In Progress`, count: data.statusCounts.inProgress },
    { key: "delivered", label: `Delivered`, count: data.statusCounts.delivered },
  ] as const;

  return (
    <div className="-mx-5 space-y-4 px-5">
      <div className="sticky top-[64px] z-30 bg-surface/90 py-4 backdrop-blur-md">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-on-surface">
            Orders <span className="text-base text-on-surface-variant">({data.total.toLocaleString()})</span>
          </h1>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" className="h-11 w-11 rounded-full bg-surface-container-high text-on-surface-variant">
              <Download className="h-5 w-5" />
            </Button>
            <Button size="icon" className="h-11 w-11 rounded-full bg-primary-container text-on-primary-container">
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ID, Customer..."
              className="h-12 w-full rounded-full bg-surface-container-low pl-12 pr-4"
            />
          </div>
          <Button
            onClick={onOpenFilters}
            variant="outline"
            className="h-12 gap-2 rounded-full bg-surface-container px-5 text-on-surface"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </div>

      <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 scrollbar-hide snap-x">
        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={() => setStatusChip(chip.key)}
            className={cn(
              "snap-start shrink-0 rounded-full px-4 py-2 text-xs font-medium uppercase tracking-wide",
              statusChip === chip.key
                ? "bg-secondary-container text-on-secondary-container"
                : "bg-surface-container text-on-surface-variant"
            )}
          >
            {chip.label} ({chip.count.toLocaleString()})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4 pb-24">
        {paged.map((order) => (
          <MobileOrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}

function MobileOrderCard({ order }: { order: AdminOrder }) {
  const status = statusConfig[order.status];
  const StatusIcon = status.icon || Clock;
  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-4 shadow-sm active:scale-[0.98] transition-transform">
      <div className={cn("absolute top-0 left-0 h-full w-1", statusLineColors[order.status])} />
      <div className="mb-3 flex items-start justify-between">
        <div>
          <span className="block text-xs font-medium uppercase tracking-wider text-on-surface-variant">{order.number}</span>
          <h3 className="font-serif text-xl text-on-surface">{order.customer.name}</h3>
        </div>
        <span className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium uppercase", status.classes)}>
          <StatusIcon className="h-3.5 w-3.5" />
          {status.label}
        </span>
      </div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-container">
          <Package className="h-6 w-6 text-on-surface-variant" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-on-surface">{order.productName || order.category}</p>
          <p className="truncate text-sm text-on-surface-variant">{order.deliveryText || `Delivery: ${order.targetDate}`}</p>
        </div>
      </div>
      <div className="relative flex items-end justify-between border-t border-outline-variant/50 pt-3">
        <span className="text-sm text-on-surface-variant">{order.items} items</span>
        <span className="font-serif text-2xl text-on-surface">{formatCurrency(order.total)}</span>
      </div>
    </div>
  );
}

function Pagination({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (p: number) => void }) {
  const pages: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, "...", totalPages);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-sm text-on-surface-variant">...</span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors",
              page === p ? "bg-primary text-on-primary" : "text-on-surface hover:bg-surface-container"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
