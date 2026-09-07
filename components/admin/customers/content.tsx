"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Ban,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  Mail,
  MessageSquare,
  MoreVertical,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  AdminCustomer,
  CustomerNote,
  CustomerSegment,
  addAdminCustomerNote,
  disableAdminCustomer,
  enableAdminCustomer,
  exportAdminCustomersCSV,
  recencyLabel,
  segmentLabel,
} from "@/lib/admin-customers";
import { CustomersEmpty, CustomersError, CustomersNoResults, CustomersSkeleton } from "./states";

type Segment = "all" | CustomerSegment;
type Sort = "name" | "spend" | "orders" | "recency";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const segmentConfig: Record<CustomerSegment, { chip: string; dot: string }> = {
  vip: { chip: "bg-primary-container text-on-primary-container", dot: "bg-primary" },
  active: { chip: "bg-secondary-container text-on-secondary-container", dot: "bg-secondary" },
  recent: { chip: "bg-tertiary-container text-on-tertiary-container", dot: "bg-tertiary" },
  inactive: { chip: "bg-surface-container-high text-on-surface-variant", dot: "bg-outline" },
  new: { chip: "bg-surface-container text-on-surface", dot: "bg-on-surface-variant" },
};

const recencyOrder: Record<AdminCustomer["recency"], number> = {
  today: 0,
  this_week: 1,
  this_month: 2,
  older: 3,
};

export function CustomersContent({ customers: initialCustomers }: { customers: AdminCustomer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [segment, setSegment] = useState<Segment>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("name");
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailCustomer, setDetailCustomer] = useState<AdminCustomer | null>(null);
  const [disabling, setDisabling] = useState<AdminCustomer | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [noteBusy, setNoteBusy] = useState(false);
  const [busy, setBusy] = useState(false);
  const [page, setPage] = useState(1);
  const fileRef = useRef<HTMLInputElement>(null);
  const limit = 10;

  const counts = useMemo(() => {
    const all = customers.length;
    const vip = customers.filter((c) => c.segment === "vip").length;
    const recent = customers.filter((c) => c.recency !== "older").length;
    const inactive = customers.filter((c) => c.segment === "inactive" || c.status === "disabled").length;
    const newCustomers = customers.filter((c) => c.segment === "new").length;
    return { all, vip, recent, inactive, new: newCustomers };
  }, [customers]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = customers.filter((c) => {
      if (segment === "all") return true;
      if (segment === "recent") return c.recency !== "older";
      if (segment === "inactive") return c.segment === "inactive" || c.status === "disabled";
      return c.segment === segment;
    });
    if (term) {
      list = list.filter((c) => `${c.name} ${c.email} ${c.phone} ${c.address}`.toLowerCase().includes(term));
    }
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "spend") return b.totalSpend - a.totalSpend;
      if (sort === "orders") return b.orders - a.orders;
      if (sort === "recency") return recencyOrder[a.recency] - recencyOrder[b.recency] || a.name.localeCompare(b.name);
      return 0;
    });
    return list;
  }, [customers, segment, search, sort]);

  const paged = useMemo(() => filtered.slice((page - 1) * limit, page * limit), [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / limit));
  const start = Math.min(filtered.length, (page - 1) * limit + 1);
  const end = Math.min(filtered.length, page * limit);

  const updateSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const updateSegment = (value: Segment) => {
    setSegment(value);
    setPage(1);
  };
  const updateSort = (value: Sort) => {
    setSort(value);
    setPage(1);
  };

  const clear = () => {
    setSearch("");
    setSegment("all");
    setSort("name");
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onExport = () => {
    const csv = exportAdminCustomersCSV(filtered.length > 0 ? filtered : customers);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Customer directory exported.");
  };

  const onImportClick = () => fileRef.current?.click();
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`Imported ${file.name} — customer records will be processed.`);
    if (e.target) e.target.value = "";
  };

  const handleDisable = async () => {
    if (!disabling) return;
    setBusy(true);
    try {
      await disableAdminCustomer(disabling.id);
      setCustomers((prev) =>
        prev.map((c) => (c.id === disabling.id ? { ...c, status: "disabled" } : c))
      );
      toast.success(`${disabling.name} account disabled.`);
      setDisabling(null);
    } catch {
      toast.error("Could not disable account.");
    } finally {
      setBusy(false);
    }
  };

  const handleEnable = async (customer: AdminCustomer) => {
    setBusy(true);
    try {
      await enableAdminCustomer(customer.id);
      setCustomers((prev) => prev.map((c) => (c.id === customer.id ? { ...c, status: "active" } : c)));
      toast.success(`${customer.name} account re-enabled.`);
    } catch {
      toast.error("Could not enable account.");
    } finally {
      setBusy(false);
    }
  };

  const handleAddNote = async () => {
    if (!detailCustomer || !noteDraft.trim()) return;
    setNoteBusy(true);
    try {
      const note = await addAdminCustomerNote(detailCustomer.id, noteDraft.trim());
      setCustomers((prev) =>
        prev.map((c) => (c.id === detailCustomer.id ? { ...c, notes: [note, ...c.notes] } : c))
      );
      setDetailCustomer((prev) => (prev ? { ...prev, notes: [note, ...prev.notes] } : null));
      setNoteDraft("");
      toast.success("Note saved.");
    } catch {
      toast.error("Could not save note.");
    } finally {
      setNoteBusy(false);
    }
  };

  if (customers.length === 0) {
    return <CustomersEmpty onImport={onImportClick} />;
  }

  if (filtered.length === 0 && (search || segment !== "all")) {
    return <CustomersNoResults onClear={clear} />;
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10">
      <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={onFileSelect} />
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Directory</p>
          <h1 className="font-serif text-4xl text-on-surface">Customer Management</h1>
          <p className="mt-1 hidden text-sm text-on-surface-variant sm:block">Search, segment, and manage your customer relationships.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onExport} className="min-h-11 rounded-full px-5">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={onImportClick} className="min-h-11 rounded-full px-5">
            <Users className="h-4 w-4" />
            Import
          </Button>
        </div>
      </header>

      <SegmentTabs segment={segment} setSegment={updateSegment} counts={counts} />

      <section className="flex flex-col gap-3 rounded-2xl bg-surface-container p-2 lg:flex-row lg:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search customers</span>
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
          <Input
            value={search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search name, email, phone..."
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
              <SlidersHorizontal className="h-4 w-4" />
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
        </div>
      </section>

      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-inverse-surface px-5 py-3 text-inverse-on-surface" role="status">
          <span className="mr-auto font-medium">{selected.size} selected</span>
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
                  aria-label="Select all visible customers"
                  type="checkbox"
                  checked={paged.length > 0 && selected.size === paged.length}
                  onChange={() =>
                    setSelected(selected.size === paged.length ? new Set() : new Set(paged.map((c) => c.id)))
                  }
                  className="h-5 w-5 accent-secondary"
                />
              </th>
              <th className="p-4">Customer</th>
              <th className="p-4 text-right">Orders</th>
              <th className="p-4 text-right">Spend</th>
              <th className="p-4">Recency</th>
              <th className="p-4">Consent</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((customer) => (
              <CustomerRow
                key={customer.id}
                customer={customer}
                selected={selected.has(customer.id)}
                onSelect={() => toggleSelect(customer.id)}
                onView={() => setDetailCustomer(customer)}
                onDisable={() => setDisabling(customer)}
                onEnable={() => handleEnable(customer)}
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
        {paged.map((customer) => (
          <CustomerCard
            key={customer.id}
            customer={customer}
            selected={selected.has(customer.id)}
            onSelect={() => toggleSelect(customer.id)}
            onView={() => setDetailCustomer(customer)}
            onDisable={() => setDisabling(customer)}
            onEnable={() => handleEnable(customer)}
            busy={busy}
          />
        ))}
      </div>

      {paged.length === 0 && <CustomersNoResults onClear={clear} />}

      <FilterDrawer
        open={filtersOpen}
        setOpen={setFiltersOpen}
        segment={segment}
        setSegment={updateSegment}
        sort={sort}
        setSort={updateSort}
        clear={clear}
      />

      <CustomerSheet
        customer={detailCustomer}
        onOpenChange={(o) => !o && setDetailCustomer(null)}
        noteDraft={noteDraft}
        setNoteDraft={setNoteDraft}
        onAddNote={handleAddNote}
        noteBusy={noteBusy}
      />

      <Dialog open={!!disabling} onOpenChange={(o) => !o && setDisabling(null)}>
        <DialogContent>
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error-container text-error">
                <Ban className="h-6 w-6" />
              </div>
              <div>
                <DialogTitle className="font-serif text-2xl text-error">Disable Account</DialogTitle>
                <DialogDescription>Are you sure you want to disable this account?</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <p className="text-sm text-on-surface-variant">
            {disabling?.name} will no longer be able to log in or place orders. You can re-enable the account later.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisabling(null)}>
              Cancel
            </Button>
            <Button disabled={busy} variant="destructive" onClick={handleDisable}>
              Confirm Disable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CustomerRow({
  customer,
  selected,
  onSelect,
  onView,
  onDisable,
  onEnable,
  busy,
}: {
  customer: AdminCustomer;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDisable: () => void;
  onEnable: () => void;
  busy: boolean;
}) {
  const segment = segmentConfig[customer.segment];
  const disabled = customer.status === "disabled";
  return (
    <tr className="group border-b border-outline-variant/40 transition-colors hover:bg-surface-variant/5">
      <td className="p-4">
        <input
          aria-label={`Select ${customer.name}`}
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="h-5 w-5 accent-secondary"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center gap-4">
          {customer.avatar ? (
            <Image src={customer.avatar} alt="" width={40} height={40} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container font-medium">
              {customer.initials}
            </div>
          )}
          <div>
            <button
              onClick={onView}
              className="block text-left font-serif text-base font-medium text-on-surface hover:text-primary hover:underline"
            >
              {customer.name}
            </button>
            <div className="text-xs text-on-surface-variant">{customer.email}</div>
          </div>
        </div>
      </td>
      <td className="p-4 text-right">{customer.orders}</td>
      <td className="p-4 text-right font-medium">{money.format(customer.totalSpend)}</td>
      <td className="p-4 text-sm">{customer.lastOrder}</td>
      <td className="p-4">
        <div className="flex items-center gap-2 text-xs text-on-surface-variant">
          {customer.consent.email && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-1">
              <Mail className="h-3 w-3" /> Email
            </span>
          )}
          {customer.consent.sms && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-container px-2 py-1">
              <Phone className="h-3 w-3" /> SMS
            </span>
          )}
          {!customer.consent.email && !customer.consent.sms && <span className="italic">No consent</span>}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
              segment.chip,
              disabled && "opacity-60"
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", segment.dot)} />
            {disabled ? "Disabled" : segmentLabel(customer.segment)}
          </span>
          {disabled && <Ban className="h-4 w-4 text-error" />}
        </div>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            aria-label={`View ${customer.name}`}
            onClick={onView}
            className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <MessageSquare className="h-4 w-4" />
          </button>
          {disabled ? (
            <button
              aria-label={`Enable ${customer.name}`}
              disabled={busy}
              onClick={onEnable}
              className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"
            >
              <ShieldCheck className="h-4 w-4 text-secondary" />
            </button>
          ) : (
            <button
              aria-label={`Disable ${customer.name}`}
              disabled={busy}
              onClick={onDisable}
              className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"
            >
              <Ban className="h-4 w-4 text-error" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function CustomerCard({
  customer,
  selected,
  onSelect,
  onView,
  onDisable,
  onEnable,
  busy,
}: {
  customer: AdminCustomer;
  selected: boolean;
  onSelect: () => void;
  onView: () => void;
  onDisable: () => void;
  onEnable: () => void;
  busy: boolean;
}) {
  const segment = segmentConfig[customer.segment];
  const disabled = customer.status === "disabled";
  return (
    <article className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <button
        onClick={onSelect}
        aria-label={`${selected ? "Deselect" : "Select"} ${customer.name}`}
        className={cn(
          "absolute right-3 top-3 z-10 grid h-6 w-6 place-items-center rounded-md border bg-white",
          selected && "bg-secondary text-on-secondary"
        )}
      >
        {selected && <Check className="h-4 w-4" />}
      </button>
      <div className="flex items-center gap-3">
        {customer.avatar ? (
          <Image src={customer.avatar} alt="" width={48} height={48} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container font-medium">
            {customer.initials}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <button onClick={onView} className="block text-left font-serif text-lg font-medium text-on-surface hover:text-primary hover:underline">
            {customer.name}
          </button>
          <p className="flex items-center gap-1 text-xs text-on-surface-variant">
            <Mail className="h-3 w-3" /> {customer.email}
          </p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-surface-container p-3">
          <p className="text-xs text-on-surface-variant">Lifetime Value</p>
          <p className="font-serif text-2xl">{money.format(customer.totalSpend)}</p>
        </div>
        <div className="rounded-xl bg-surface-container p-3">
          <p className="text-xs text-on-surface-variant">Status</p>
          <div className="mt-1 flex items-center gap-1">
            <span className={cn("h-2 w-2 rounded-full", segment.dot)} />
            <span className="font-medium">{disabled ? "Disabled" : segmentLabel(customer.segment)}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-on-surface-variant">{customer.orders} orders · {customer.lastOrder}</span>
        <div className="flex items-center gap-1">
          <button
            aria-label={`View ${customer.name}`}
            onClick={onView}
            className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {disabled ? (
            <button
              aria-label={`Enable ${customer.name}`}
              disabled={busy}
              onClick={onEnable}
              className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"
            >
              <ShieldCheck className="h-4 w-4 text-secondary" />
            </button>
          ) : (
            <button
              aria-label={`Disable ${customer.name}`}
              disabled={busy}
              onClick={onDisable}
              className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"
            >
              <Ban className="h-4 w-4 text-error" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

function SegmentTabs({
  segment,
  setSegment,
  counts,
}: {
  segment: Segment;
  setSegment: (s: Segment) => void;
  counts: { all: number; vip: number; recent: number; inactive: number; new: number };
}) {
  const tabs: { id: Segment; label: string; count: number }[] = [
    { id: "all", label: "All Clients", count: counts.all },
    { id: "vip", label: "VIP", count: counts.vip },
    { id: "recent", label: "Recent", count: counts.recent },
    { id: "inactive", label: "Inactive", count: counts.inactive },
    { id: "new", label: "New", count: counts.new },
  ];
  return (
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Customer segments">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={segment === t.id}
          onClick={() => setSegment(t.id)}
          className={cn(
            "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
            segment === t.id
              ? "bg-primary text-on-primary"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
          )}
        >
          {t.label}
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs",
              segment === t.id ? "bg-on-primary/20 text-on-primary" : "bg-surface-container-high text-on-surface-variant"
            )}
          >
            {t.count}
          </span>
        </button>
      ))}
    </div>
  );
}

function FilterDrawer({
  open,
  setOpen,
  segment,
  setSegment,
  sort,
  setSort,
  clear,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  segment: Segment;
  setSegment: (s: Segment) => void;
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
            Filter customers
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
            Segment
            <select
              value={segment}
              onChange={(e) => setSegment(e.target.value as Segment)}
              className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3"
            >
              <option value="all">All clients</option>
              <option value="vip">VIP</option>
              <option value="recent">Recent</option>
              <option value="inactive">Inactive</option>
              <option value="new">New</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Sort by
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3"
            >
              <option value="name">Name</option>
              <option value="spend">Total spend</option>
              <option value="orders">Order count</option>
              <option value="recency">Recency</option>
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
            Show customers
          </button>
        </div>
      </aside>
    </div>
  );
}

function CustomerSheet({
  customer,
  onOpenChange,
  noteDraft,
  setNoteDraft,
  onAddNote,
  noteBusy,
}: {
  customer: AdminCustomer | null;
  onOpenChange: (o: boolean) => void;
  noteDraft: string;
  setNoteDraft: (v: string) => void;
  onAddNote: () => void;
  noteBusy: boolean;
}) {
  if (!customer) return null;
  const segment = segmentConfig[customer.segment];
  const disabled = customer.status === "disabled";
  return (
    <Sheet open={!!customer} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-4">
            {customer.avatar ? (
              <Image src={customer.avatar} alt="" width={64} height={64} className="h-16 w-16 rounded-full object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container text-xl font-medium">
                {customer.initials}
              </div>
            )}
            <div>
              <SheetTitle className="font-serif text-2xl">{customer.name}</SheetTitle>
              <SheetDescription>{customer.email}</SheetDescription>
            </div>
          </div>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-surface-container p-4">
              <p className="text-xs text-on-surface-variant">Total Spend</p>
              <p className="font-serif text-2xl">{money.format(customer.totalSpend)}</p>
            </div>
            <div className="rounded-2xl bg-surface-container p-4">
              <p className="text-xs text-on-surface-variant">Orders</p>
              <p className="font-serif text-2xl">{customer.orders}</p>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl bg-surface-container p-4">
            <h3 className="font-medium">Contact &amp; Consent</h3>
            <p className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Mail className="h-4 w-4" /> {customer.email}
            </p>
            <p className="flex items-center gap-2 text-sm text-on-surface-variant">
              <Phone className="h-4 w-4" /> {customer.phone}
            </p>
            <p className="flex items-center gap-2 text-sm text-on-surface-variant">
              <ShieldCheck className="h-4 w-4" /> Email: {customer.consent.email ? "Opted in" : "Opted out"}
            </p>
            <p className="flex items-center gap-2 text-sm text-on-surface-variant">
              <ShieldCheck className="h-4 w-4" /> SMS: {customer.consent.sms ? "Opted in" : "Opted out"}
            </p>
          </div>
          <div className="rounded-2xl bg-surface-container p-4">
            <h3 className="mb-2 font-medium">Status</h3>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
                segment.chip,
                disabled && "opacity-60"
              )}
            >
              <span className={cn("h-1.5 w-1.5 rounded-full", segment.dot)} />
              {disabled ? "Disabled" : segmentLabel(customer.segment)}
            </span>
            {disabled && <p className="mt-2 text-sm text-error">This account is disabled.</p>}
          </div>
          <div className="rounded-2xl bg-surface-container p-4">
            <h3 className="mb-3 font-medium">Internal Notes</h3>
            <div className="space-y-3">
              {customer.notes.length === 0 && <p className="text-sm text-on-surface-variant">No notes yet.</p>}
              {customer.notes.map((note) => (
                <NoteItem key={note.id} note={note} />
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <Input
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder="Add a note..."
                className="min-h-11 flex-1 rounded-full"
                onKeyDown={(e) => e.key === "Enter" && onAddNote()}
              />
              <Button disabled={noteBusy || !noteDraft.trim()} onClick={onAddNote} className="min-h-11 rounded-full">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NoteItem({ note }: { note: CustomerNote }) {
  return (
    <div className="rounded-xl bg-surface-container-lowest p-3">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-medium">{note.author}</span>
        <span className="text-xs text-on-surface-variant">{note.timestamp}</span>
      </div>
      <p className="text-sm text-on-surface-variant">{note.text}</p>
    </div>
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

const sortLabels: Record<Sort, string> = {
  name: "Name",
  spend: "Total Spend",
  orders: "Order Count",
  recency: "Recency",
};
