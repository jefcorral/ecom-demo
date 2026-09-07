"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileUp,
  Filter,
  History,
  Minus,
  MoreVertical,
  Package,
  PackagePlus,
  Plus,
  Search,
  Settings,
  SortAsc,
  TrendingUp,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  InventoryActivity,
  InventoryAdjustment,
  InventoryData,
  InventoryItem,
  InventoryStatus,
  adjustmentReasons,
  adjustAdminInventoryItem,
  bulkAdjustAdminInventory,
  exportAdminInventoryCSV,
  importAdminInventoryCSV,
} from "@/lib/admin-inventory";
import { InventoryEmpty, InventoryNoResults } from "./states";

type Tab = "all" | "low" | "out" | "bundles";
type Sort = "urgency" | "name" | "stock" | "sku";

const statusConfig: Record<InventoryStatus, { label: string; dot: string; chip: string; text: string }> = {
  healthy: { label: "Optimal", dot: "bg-secondary", chip: "bg-secondary-container text-on-secondary-container", text: "text-secondary" },
  low: { label: "Reorder Soon", dot: "bg-tertiary", chip: "bg-tertiary-container text-on-tertiary-container", text: "text-tertiary" },
  critical: { label: "Critical Low", dot: "bg-error", chip: "bg-error-container text-error", text: "text-error" },
  out: { label: "Unavailable", dot: "bg-outline", chip: "bg-surface-container-high text-on-surface-variant", text: "text-on-surface-variant" },
  in_transit: { label: "In Transit", dot: "bg-primary", chip: "bg-primary-container text-on-primary-container", text: "text-primary" },
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function InventoryContent({ data: initialData }: { data: InventoryData }) {
  const router = useRouter();
  const [items, setItems] = useState(initialData.items);
  const [adjustments, setAdjustments] = useState<InventoryAdjustment[]>(initialData.adjustments);
  const [activity, setActivity] = useState<InventoryActivity[]>(initialData.activity);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState<Sort>("urgency");
  const [sortOpen, setSortOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [importResult, setImportResult] = useState<Awaited<ReturnType<typeof importAdminInventoryCSV>> | null>(null);
  const [adjusting, setAdjusting] = useState<InventoryItem | null>(null);
  const [adjustDelta, setAdjustDelta] = useState(0);
  const [adjustReason, setAdjustReason] = useState(adjustmentReasons[0]);
  const [adjustBusy, setAdjustBusy] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const limit = 10;

  const metrics = useMemo(() => {
    const totalSkus = items.length;
    const healthy = items.filter((i) => i.status === "healthy").length;
    const low = items.filter((i) => i.status === "low" || i.status === "critical").length;
    const out = items.filter((i) => i.status === "out").length;
    const inTransit = 0;
    const totalValue = items.reduce((sum, i) => sum + i.stock * i.price, 0);
    return { totalSkus, healthy, low, out, inTransit, totalValue };
  }, [items]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = items.filter((item) => {
      if (tab === "low") return item.status === "low" || item.status === "critical";
      if (tab === "out") return item.status === "out";
      if (tab === "bundles") return item.isBundle;
      return true;
    });
    if (term) {
      list = list.filter((item) => `${item.name} ${item.sku} ${item.category} ${item.supplier}`.toLowerCase().includes(term));
    }
    list = [...list].sort((a, b) => {
      if (sort === "urgency") {
        const order = { out: 0, critical: 1, low: 2, in_transit: 3, healthy: 4 };
        return order[a.status] - order[b.status] || a.name.localeCompare(b.name);
      }
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "stock") return b.stock - a.stock;
      if (sort === "sku") return a.sku.localeCompare(b.sku);
      return 0;
    });
    return list;
  }, [items, tab, search, sort]);

  const paged = useMemo(() => filtered.slice((page - 1) * limit, page * limit), [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const start = Math.min(filtered.length, (page - 1) * limit + 1);
  const end = Math.min(filtered.length, page * limit);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const updateTab = (value: Tab) => {
    setTab(value);
    setPage(1);
  };
  const updateSort = (value: Sort) => {
    setSort(value);
    setPage(1);
  };

  const clear = () => {
    setSearch("");
    setTab("all");
    setSort("urgency");
    setPage(1);
  };

  const handleAdjust = async () => {
    if (!adjusting) return;
    setAdjustBusy(true);
    try {
      const adjustment = await adjustAdminInventoryItem(adjusting.id, adjustDelta, adjustReason);
      setAdjustments((prev) => [adjustment, ...prev]);
      setItems((prev) =>
        prev.map((item) =>
          item.id === adjusting.id
            ? {
                ...item,
                stock: adjustment.newStock,
                status: getStatus(adjustment.newStock, item.threshold),
              }
            : item
        )
      );
      setActivity((prev) => [
        {
          id: `act-${Date.now()}`,
          type: "adjustment",
          title: "Stock Adjusted",
          description: `${adjustment.productName} ${adjustment.delta >= 0 ? "increased" : "decreased"} by ${Math.abs(adjustment.delta)} units.`,
          delta: adjustment.delta,
          timestamp: "Just now",
        },
        ...prev,
      ]);
      toast.success(`${adjusting.name} stock updated to ${adjustment.newStock}.`);
      setAdjusting(null);
      setAdjustDelta(0);
    } catch {
      toast.error("Adjustment failed. Please try again.");
    } finally {
      setAdjustBusy(false);
    }
  };

  const quickAdjust = async (item: InventoryItem, delta: number) => {
    setBusy(true);
    try {
      const adjustment = await adjustAdminInventoryItem(item.id, delta, "Quick count update");
      setAdjustments((prev) => [adjustment, ...prev]);
      setItems((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                stock: adjustment.newStock,
                status: getStatus(adjustment.newStock, i.threshold),
              }
            : i
        )
      );
      toast.success(`${item.name} ${delta >= 0 ? "restocked" : "reduced"} by ${Math.abs(delta)}.`);
    } catch {
      toast.error("Could not update stock.");
    } finally {
      setBusy(false);
    }
  };

  const onExport = () => {
    const csv = exportAdminInventoryCSV(items);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Inventory report exported.");
  };

  const onFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const result = await importAdminInventoryCSV(file);
    setImportResult(result);
    setImportOpen(true);
    if (e.target) e.target.value = "";
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const bulkRestock = async () => {
    if (selected.size === 0) return;
    setBusy(true);
    try {
      await bulkAdjustAdminInventory(Array.from(selected), 5, "Bulk restock");
      setItems((prev) =>
        prev.map((item) =>
          selected.has(item.id)
            ? { ...item, stock: item.stock + 5, status: getStatus(item.stock + 5, item.threshold) }
            : item
        )
      );
      toast.success(`${selected.size} items restocked by 5 units.`);
      setSelected(new Set());
    } catch {
      toast.error("Bulk restock failed.");
    } finally {
      setBusy(false);
    }
  };

  if (items.length === 0) {
    return (
      <InventoryEmpty
        onAdd={() => router.push("/dashboard/products/new")}
        onImport={() => fileRef.current?.click()}
      />
    );
  }

  if (filtered.length === 0 && (search || tab !== "all")) {
    return <InventoryNoResults onClear={clear} />;
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10">
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileSelect} />
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Operations</p>
          <h1 className="font-serif text-4xl text-on-surface">Inventory Management</h1>
          <p className="mt-1 hidden text-sm text-on-surface-variant sm:block">Monitor stock levels, manage variations, and track component availability for bundled products.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onExport} className="min-h-11 rounded-full px-5">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Link href="/dashboard/products/new" className={cn(buttonVariants({ size: "default" }), "min-h-11 rounded-full px-5")}>
            <PackagePlus className="h-5 w-5" />
            Add Product
          </Link>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={Package} label="Total SKUs" value={metrics.totalSkus.toString()} tone="neutral" />
        <MetricCard icon={Check} label="Healthy Stock" value={metrics.healthy.toString()} tone="success" />
        <MetricCard icon={AlertTriangle} label="Low Stock" value={metrics.low.toString()} tone="warning" />
        <MetricCard icon={TrendingUp} label="Total Value" value={formatCompactValue(metrics.totalValue)} tone="neutral" />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <Tabs tab={tab} setTab={updateTab} metrics={metrics} />
          <section className="flex flex-col gap-3 rounded-2xl bg-surface-container p-2 lg:flex-row lg:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Search inventory</span>
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
              <Input
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search by name, SKU, or category..."
                className="min-h-11 rounded-full border-0 bg-surface-container-lowest pl-11"
              />
            </label>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setFiltersOpen(true)} className="min-h-11 rounded-full">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <div className="relative">
                <Button variant="outline" onClick={() => setSortOpen(!sortOpen)} className="min-h-11 rounded-full">
                  <SortAsc className="h-4 w-4" />
                  Sort: {sortLabels[sort]}
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {sortOpen && (
                  <div className="absolute top-full right-0 z-50 mt-2 w-44 rounded-xl border border-outline-variant/20 bg-surface-container-lowest py-2 shadow-lg">
                    {(Object.keys(sortLabels) as Sort[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          updateSort(key);
                          setSortOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 px-4 py-2 text-left text-sm hover:bg-surface-variant/30",
                          sort === key && "text-primary"
                        )}
                      >
                        {sortLabels[key]}
                        {sort === key && <Check className="ml-auto h-4 w-4" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button variant="outline" onClick={() => setHistoryOpen(true)} className="min-h-11 rounded-full lg:hidden">
                <History className="h-4 w-4" />
              </Button>
            </div>
          </section>

          {selected.size > 0 && (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-inverse-surface px-5 py-3 text-inverse-on-surface" role="status">
              <span className="mr-auto font-medium">{selected.size} selected</span>
              <Button disabled={busy} variant="outline" onClick={bulkRestock} className="min-h-11 rounded-full bg-transparent text-inverse-on-surface">
                Restock +5
              </Button>
              <Button
                disabled={busy}
                variant="outline"
                onClick={() => setSelected(new Set())}
                className="min-h-11 rounded-full bg-transparent text-inverse-on-surface"
              >
                Clear
              </Button>
            </div>
          )}

          <div className="hidden overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm md:block">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-outline-variant/30 bg-surface-container/30 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70">
                <tr>
                  <th className="p-4">
                    <input
                      aria-label="Select all visible inventory items"
                      type="checkbox"
                      checked={paged.length > 0 && selected.size === paged.length}
                      onChange={() =>
                        setSelected(
                          selected.size === paged.length ? new Set() : new Set(paged.map((p) => p.id))
                        )
                      }
                      className="h-5 w-5 accent-secondary"
                    />
                  </th>
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Type</th>
                  <th className="p-4 text-right">Stock</th>
                  <th className="p-4 text-right">Threshold</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((item) => (
                  <InventoryRow
                    key={item.id}
                    item={item}
                    selected={selected.has(item.id)}
                    onSelect={() => toggleSelect(item.id)}
                    onAdjust={() => {
                      setAdjusting(item);
                      setAdjustDelta(0);
                      setAdjustReason(adjustmentReasons[0]);
                    }}
                    onQuickAdjust={(delta) => quickAdjust(item, delta)}
                    busy={busy}
                  />
                ))}
              </tbody>
            </table>
            <div className="flex items-center justify-between border-t border-outline-variant/20 p-4">
              <span className="text-sm text-on-surface-variant">
                Showing {start}-{end} of {filtered.length.toLocaleString()} entries
              </span>
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            </div>
          </div>

          <div className="grid gap-3 md:hidden">
            {paged.map((item) => (
              <InventoryCard
                key={item.id}
                item={item}
                selected={selected.has(item.id)}
                onSelect={() => toggleSelect(item.id)}
                onAdjust={() => {
                  setAdjusting(item);
                  setAdjustDelta(0);
                  setAdjustReason(adjustmentReasons[0]);
                }}
                onQuickAdjust={(delta) => quickAdjust(item, delta)}
                busy={busy}
              />
            ))}
          </div>

          {paged.length === 0 && <InventoryNoResults onClear={clear} />}
        </div>

        <aside className="hidden space-y-6 lg:block">
          <SeasonalPanel items={initialData.seasonal} />
          <ActivityPanel items={activity} />
        </aside>
      </div>

      <FilterDrawer
        open={filtersOpen}
        setOpen={setFiltersOpen}
        tab={tab}
        setTab={updateTab}
        sort={sort}
        setSort={updateSort}
        clear={clear}
      />

      <HistorySheet open={historyOpen} onOpenChange={setHistoryOpen} adjustments={adjustments} />

      <Dialog open={!!adjusting} onOpenChange={(o) => !o && setAdjusting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Adjust stock</DialogTitle>
            <DialogDescription>
              {adjusting?.name} · SKU {adjusting?.sku}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between rounded-xl bg-surface-container p-4">
              <span className="text-sm text-on-surface-variant">Current stock</span>
              <span className="font-serif text-2xl">{adjusting?.stock ?? 0}</span>
            </div>
            <div>
              <label className="block text-sm font-medium">Adjustment</label>
              <div className="mt-2 flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAdjustDelta((d) => d - 1)}
                  className="h-11 w-11 rounded-full"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  value={adjustDelta}
                  onChange={(e) => setAdjustDelta(Number(e.target.value))}
                  className="h-11 w-24 rounded-xl text-center"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAdjustDelta((d) => d + 1)}
                  className="h-11 w-11 rounded-full"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <label className="block">
              <span className="text-sm font-medium">Reason</span>
              <select
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3"
              >
                {adjustmentReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAdjusting(null)}>
              Cancel
            </Button>
            <Button disabled={adjustBusy || adjustDelta === 0} onClick={handleAdjust}>
              Save adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportDialog open={importOpen} onOpenChange={setImportOpen} result={importResult} onUpload={() => fileRef.current?.click()} />
    </div>
  );
}

function InventoryRow({
  item,
  selected,
  onSelect,
  onAdjust,
  onQuickAdjust,
  busy,
}: {
  item: InventoryItem;
  selected: boolean;
  onSelect: () => void;
  onAdjust: () => void;
  onQuickAdjust: (delta: number) => void;
  busy: boolean;
}) {
  const status = statusConfig[item.status];
  return (
    <tr className="group border-b border-outline-variant/40 transition-colors hover:bg-surface-variant/5">
      <td className="p-4">
        <input
          aria-label={`Select ${item.name}`}
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="h-5 w-5 accent-secondary"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-4">
          <Image src={item.image} alt="" width={48} height={64} className="h-16 w-12 rounded-lg object-cover" />
          <div>
            <div className="font-serif text-lg">{item.name}</div>
            <div className="text-xs text-on-surface-variant">{item.category}</div>
          </div>
        </div>
      </td>
      <td className="p-4 font-mono text-xs text-on-surface-variant">{item.sku}</td>
      <td className="p-4 text-sm">
        <span className="rounded-full bg-surface-container px-2 py-1 text-xs">{item.type}</span>
      </td>
      <td className="p-4 text-right">
        <span className={cn("font-medium", status.text)}>{item.stock}</span>
      </td>
      <td className="p-4 text-right text-sm text-on-surface-variant">{item.threshold}</td>
      <td className="p-4">
        <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", status.chip)}>
          <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
          {status.label}
        </span>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            disabled={busy || item.stock === 0}
            aria-label={`Decrease ${item.name} stock`}
            onClick={() => onQuickAdjust(-1)}
            className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-sm font-medium">{item.stock}</span>
          <button
            disabled={busy}
            aria-label={`Increase ${item.name} stock`}
            onClick={() => onQuickAdjust(1)}
            className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            aria-label={`Adjust ${item.name}`}
            onClick={onAdjust}
            className="ml-1 grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function InventoryCard({
  item,
  selected,
  onSelect,
  onAdjust,
  onQuickAdjust,
  busy,
}: {
  item: InventoryItem;
  selected: boolean;
  onSelect: () => void;
  onAdjust: () => void;
  onQuickAdjust: (delta: number) => void;
  busy: boolean;
}) {
  const status = statusConfig[item.status];
  return (
    <article className="relative flex items-center gap-4 rounded-2xl bg-surface-container-lowest p-3 shadow-sm">
      <button
        onClick={onSelect}
        aria-label={`${selected ? "Deselect" : "Select"} ${item.name}`}
        className={cn(
          "absolute left-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-md border bg-white",
          selected && "bg-secondary text-on-secondary"
        )}
      >
        {selected && <Check className="h-4 w-4" />}
      </button>
      <Image src={item.image} alt="" width={80} height={80} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
      <div className="min-w-0 flex-1">
        <h2 className="font-serif text-lg">{item.name}</h2>
        <p className="text-xs text-on-surface-variant">{item.sku} · {item.type}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", status.chip)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
            {status.label}
          </span>
          <span className={cn("text-sm font-medium", status.text)}>{item.stock} in stock</span>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1">
        <button
          aria-label={`Restock ${item.name}`}
          disabled={busy || item.stock === 0}
          onClick={() => onQuickAdjust(1)}
          className={cn(
            "grid h-11 w-11 place-items-center rounded-full",
            item.status === "out" || item.status === "critical" || item.status === "low"
              ? "bg-primary text-on-primary"
              : "bg-surface-dim text-on-surface"
          )}
        >
          <Plus className="h-5 w-5" />
        </button>
        <button aria-label={`Adjust ${item.name}`} onClick={onAdjust} className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-sm",
        tone === "success" && "bg-secondary-container text-on-secondary-container",
        tone === "warning" && "bg-tertiary-container text-on-tertiary-container",
        tone === "neutral" && "bg-surface-container text-on-surface"
      )}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/50">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-medium opacity-80">{label}</p>
      <p className="font-serif text-3xl">{value}</p>
    </div>
  );
}

function Tabs({
  tab,
  setTab,
  metrics,
}: {
  tab: Tab;
  setTab: (t: Tab) => void;
  metrics: { totalSkus: number; healthy: number; low: number; out: number };
}) {
  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "all", label: "All", count: metrics.totalSkus },
    { id: "low", label: "Low Stock", count: metrics.low },
    { id: "out", label: "Out of Stock", count: metrics.out },
    { id: "bundles", label: "Bundles", count: 0 },
  ];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Inventory status">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={tab === t.id}
          onClick={() => setTab(t.id)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
            tab === t.id
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          )}
        >
          {t.label}
          {t.count > 0 && (
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs",
                tab === t.id ? "bg-on-primary/20 text-on-primary" : "bg-surface-container-high text-on-surface-variant"
              )}
            >
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function SeasonalPanel({ items }: { items: InventoryData["seasonal"] }) {
  return (
    <div className="rounded-2xl bg-surface-container p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl">Seasonal Availability</h2>
        <Calendar className="h-5 w-5 text-on-surface-variant" />
      </div>
      <p className="mb-4 text-sm text-on-surface-variant">Upcoming harvest windows for key botanical elements.</p>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id}>
            <div className="mb-1 flex items-center justify-between">
              <span className="font-medium">{item.name}</span>
              <span
                className={cn(
                  "text-xs font-medium uppercase",
                  item.status === "in_season" && "text-secondary",
                  item.status === "approaching" && "text-tertiary",
                  item.status === "out_of_season" && "text-on-surface-variant"
                )}
              >
                {item.status.replace("_", " ")}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-high">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  item.status === "in_season" && "bg-secondary",
                  item.status === "approaching" && "bg-tertiary",
                  item.status === "out_of_season" && "bg-outline"
                )}
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-on-surface-variant">{item.timeline}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityPanel({ items }: { items: InventoryActivity[] }) {
  return (
    <div className="rounded-2xl bg-surface-container p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl">Recent Activity</h2>
        <History className="h-5 w-5 text-on-surface-variant" />
      </div>
      <div className="relative space-y-4">
        <div className="absolute top-0 bottom-0 left-5 w-px bg-outline-variant/30" />
        {items.map((item) => (
          <div key={item.id} className="relative flex gap-3">
            <div
              className={cn(
                "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                item.type === "adjustment" && "bg-primary-container text-on-primary-container",
                item.type === "shipment" && "bg-secondary-container text-on-secondary-container",
                item.type === "alert" && "bg-tertiary-container text-on-tertiary-container",
                item.type === "audit" && "bg-surface-container-high text-on-surface-variant"
              )}
            >
              {item.type === "adjustment" && <Package className="h-4 w-4" />}
              {item.type === "shipment" && <TrendingUp className="h-4 w-4" />}
              {item.type === "alert" && <AlertTriangle className="h-4 w-4" />}
              {item.type === "audit" && <Settings className="h-4 w-4" />}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium">{item.title}</h3>
                <span className="text-xs text-on-surface-variant">{item.timestamp}</span>
              </div>
              <p className="text-sm text-on-surface-variant">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FilterDrawer({
  open,
  setOpen,
  tab,
  setTab,
  sort,
  setSort,
  clear,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  clear: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, setOpen]);

  return (
    <div>
      <div
        onClick={() => setOpen(false)}
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 bg-on-surface/20 backdrop-blur-sm transition-opacity duration-300",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        aria-labelledby="filter-title"
        className={cn(
          "fixed z-50 flex w-full flex-col bg-surface shadow-2xl transition-transform duration-300 ease-in-out",
          "inset-x-0 bottom-0 h-auto max-h-[85svh] rounded-t-2xl md:inset-x-auto md:right-0 md:top-0 md:h-full md:w-96 md:max-h-none md:rounded-none",
          open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-outline-variant/30 px-6 py-5">
          <h2 id="filter-title" className="font-serif text-2xl text-on-surface">
            Filter inventory
          </h2>
          <button
            aria-label="Close filters"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-variant/30"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          <label className="block text-sm font-medium">
            Status tab
            <select value={tab} onChange={(e) => setTab(e.target.value as Tab)} className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3">
              <option value="all">All items</option>
              <option value="low">Low stock</option>
              <option value="out">Out of stock</option>
              <option value="bundles">Bundles</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Sort by
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3">
              <option value="urgency">Urgency</option>
              <option value="name">Name</option>
              <option value="stock">Stock level</option>
              <option value="sku">SKU</option>
            </select>
          </label>
        </div>
        <div className="flex items-center gap-3 border-t border-outline-variant/30 bg-surface-container-lowest p-6">
          <button
            onClick={clear}
            className="min-h-11 flex-1 rounded-full py-3 text-sm font-medium text-secondary transition-colors hover:bg-surface-variant/20"
          >
            Clear filters
          </button>
          <button
            onClick={() => setOpen(false)}
            className="min-h-11 flex-[2] rounded-full bg-primary py-3 text-sm font-medium text-on-primary shadow-md transition-colors hover:bg-primary/90"
          >
            Show inventory
          </button>
        </div>
      </aside>
    </div>
  );
}

function HistorySheet({
  open,
  onOpenChange,
  adjustments,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  adjustments: InventoryAdjustment[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Adjustment History</SheetTitle>
          <SheetDescription>Recent stock changes and audit events.</SheetDescription>
        </SheetHeader>
        <div className="relative mt-4 space-y-4">
          <div className="absolute top-0 bottom-0 left-5 w-px bg-outline-variant/30" />
          {adjustments.length === 0 && (
            <p className="py-8 text-center text-sm text-on-surface-variant">No adjustments yet.</p>
          )}
          {adjustments.map((adj) => (
            <div key={adj.id} className="relative flex gap-3">
              <div
                className={cn(
                  "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  adj.delta >= 0 ? "bg-secondary-container text-on-secondary-container" : "bg-tertiary-container text-on-tertiary-container"
                )}
              >
                <span className="text-sm font-medium">{adj.delta >= 0 ? "+" : "-"}{Math.abs(adj.delta)}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium">{adj.author}</h3>
                  <span className="text-xs text-on-surface-variant">{adj.timestamp}</span>
                </div>
                <p className="text-sm text-on-surface-variant">
                  adjusted stock for {adj.productName}.{" "}
                  {adj.note && <span className="italic">&ldquo;{adj.note}&rdquo;</span>}
                </p>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {adj.previousStock} <ArrowRight className="inline h-3 w-3" /> {adj.newStock}
                </p>
              </div>
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ImportDialog({
  open,
  onOpenChange,
  result,
  onUpload,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  result: Awaited<ReturnType<typeof importAdminInventoryCSV>> | null;
  onUpload: () => void;
}) {
  if (!result) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full",
                result.success ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-error"
              )}
            >
              {result.success ? <Check className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
            </div>
            <div>
              <DialogTitle className={cn("font-serif text-2xl", !result.success && "text-error")}>
                {result.success ? "Import Complete" : "Import Failed"}
              </DialogTitle>
              <DialogDescription>
                {result.success
                  ? "Your inventory CSV was processed successfully."
                  : "We encountered critical errors while processing your inventory upload. The import process has been halted to prevent data corruption."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="rounded-xl border border-outline-variant/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-surface-container">
                <FileUp className="h-5 w-5 text-on-surface-variant" />
              </div>
              <div>
                <p className="font-medium">{result.filename}</p>
                <p className="text-xs text-on-surface-variant">
                  {result.size} · Uploaded {result.uploadedAt}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-1 text-xs font-medium",
                result.success ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-error"
              )}
            >
              {result.success ? "SUCCESS" : "FAILED"}
            </span>
          </div>
        </div>
        {!result.success && result.errors && result.errors.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Error Details</h3>
            <div className="overflow-hidden rounded-xl border border-error/20 bg-error-container/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-error-container/20 text-xs uppercase text-on-surface-variant">
                  <tr>
                    <th className="p-3">Location</th>
                    <th className="p-3">Issue</th>
                    <th className="p-3">Data</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((err, i) => (
                    <tr key={i} className="border-t border-error/10">
                      <td className="p-3 text-error">Row {err.row}</td>
                      <td className="p-3">{err.issue}</td>
                      <td className="p-3 font-mono text-xs">{err.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {result.totalErrors && result.totalErrors > result.errors.length && (
              <p className="text-xs text-on-surface-variant">
                Showing {result.errors.length} of {result.totalErrors} errors. Download the full error log for a complete list.
              </p>
            )}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {!result.success && (
            <Button onClick={onUpload}>
              <FileUp className="mr-2 h-4 w-4" />
              Upload New File
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        aria-label="Previous page"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          aria-label={`Page ${p}`}
          aria-current={p === page ? "page" : undefined}
          onClick={() => onChange(p)}
          className={cn(
            "grid h-9 w-9 place-items-center rounded-full text-sm font-medium transition-colors",
            p === page ? "bg-primary text-on-primary" : "text-on-surface-variant hover:bg-surface-container"
          )}
        >
          {p}
        </button>
      ))}
      <button
        aria-label="Next page"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container disabled:opacity-40"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function getStatus(stock: number, threshold: number): InventoryStatus {
  if (stock === 0) return "out";
  if (stock <= threshold / 2) return "critical";
  if (stock <= threshold) return "low";
  return "healthy";
}

function formatCompactValue(value: number): string {
  if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
  return money.format(value);
}

const sortLabels: Record<Sort, string> = {
  urgency: "Urgency",
  name: "Name",
  stock: "Stock Level",
  sku: "SKU",
};
