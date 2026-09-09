"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Calendar, CheckCircle, CheckSquare, Copy, DollarSign, Filter as FilterIcon, Pencil, Percent, Plus, Search, Tag, Trash2, Truck, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { deleteDiscount, Discount, DiscountStatus, DiscountType, duplicateDiscount, emptyDiscount, fetchDiscounts, generateDiscountCode, getDiscountStatus, saveDiscount, toggleDiscountEnabled } from "@/lib/admin-discounts";
import { DiscountsEmpty, DiscountsError, DiscountsNoResults, DiscountsSkeleton } from "./states";

type ConfirmAction = { type: "delete" | "disable"; ids: string[] } | null;
type TabStatus = DiscountStatus;

const statusConfig: Record<DiscountStatus, { label: string; classes: string }> = {
  active: { label: "Active", classes: "bg-secondary-container text-on-secondary-container" },
  scheduled: { label: "Scheduled", classes: "bg-primary-container text-on-primary-container" },
  expired: { label: "Expired", classes: "bg-surface-container-highest text-on-surface-variant" },
};

const typeConfig: Record<DiscountType, { label: string; icon: React.ComponentType<{ className?: string }>; classes: string }> = {
  percentage: { label: "Percentage", icon: Percent, classes: "bg-primary-container text-on-primary-container" },
  fixed: { label: "Fixed", icon: DollarSign, classes: "bg-secondary-container text-on-secondary-container" },
  delivery: { label: "Free Delivery", icon: Truck, classes: "bg-tertiary-container text-on-tertiary-container" },
};

export function DiscountsContent({ discounts: initialDiscounts }: { discounts: Discount[] }) {
  const [discounts, setDiscounts] = useState<Discount[]>(initialDiscounts);
  const [tab, setTab] = useState<TabStatus>("active");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DiscountType | "all">("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Discount | null>(null);
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const filteredDiscounts = useMemo(() => {
    let list = discounts.filter((d) => getDiscountStatus(d) === tab);
    const term = search.trim().toLowerCase();
    if (term) list = list.filter((d) => `${d.code} ${d.name}`.toLowerCase().includes(term));
    if (typeFilter !== "all") list = list.filter((d) => d.type === typeFilter);
    return list.sort((a, b) => a.code.localeCompare(b.code));
  }, [discounts, tab, search, typeFilter]);

  const tabCounts = useMemo(() => ({ active: discounts.filter((d) => getDiscountStatus(d) === "active").length, scheduled: discounts.filter((d) => getDiscountStatus(d) === "scheduled").length, expired: discounts.filter((d) => getDiscountStatus(d) === "expired").length }), [discounts]);
  const metrics = useMemo(() => {
    const active = discounts.filter((d) => getDiscountStatus(d) === "active").length;
    const scheduled = discounts.filter((d) => getDiscountStatus(d) === "scheduled").length;
    const redemptions = discounts.reduce((sum, d) => sum + d.usedCount, 0);
    const revenue = discounts.reduce((sum, d) => sum + d.usedCount * (d.minPurchase ? d.minPurchase * 0.25 : 75), 0);
    return { active, scheduled, redemptions, revenue };
  }, [discounts]);

  const clearFilters = () => { setSearch(""); setTypeFilter("all"); };
  const toggleSelect = (id: string) => { setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };
  const clearSelection = () => setSelected(new Set());
  const selectAll = () => setSelected(new Set(filteredDiscounts.map((d) => d.id)));

  const openCreate = () => { setEditing(emptyDiscount()); setEditorOpen(true); };
  const openEdit = (discount: Discount) => { setEditing(discount); setEditorOpen(true); };
  const closeEditor = () => { setEditorOpen(false); setEditing(null); };

  const handleSave = async (discount: Discount) => {
    setBusy(true);
    try {
      const saved = await saveDiscount(discount);
      setDiscounts((prev) => { const idx = prev.findIndex((d) => d.id === saved.id); if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; } return [saved, ...prev]; });
      toast.success(`${saved.code} saved.`);
      closeEditor();
    } catch { toast.error("Could not save discount."); } finally { setBusy(false); }
  };

  const handleToggle = async (id: string, enabled: boolean) => {
    if (!enabled) { const discount = discounts.find((d) => d.id === id); if (discount) { setConfirm({ type: "disable", ids: [id] }); return; } }
    setBusy(true);
    try { const updated = await toggleDiscountEnabled(id, enabled); setDiscounts((prev) => prev.map((d) => d.id === id ? updated : d)); toast.success(`${updated.code} ${enabled ? "enabled" : "disabled"}.`); } catch { toast.error("Could not update discount."); } finally { setBusy(false); }
  };

  const handleDuplicate = async (discount: Discount) => {
    setBusy(true);
    try { const copy = await duplicateDiscount(discount.id); setDiscounts((prev) => [copy, ...prev]); toast.success(`${copy.code} duplicated.`); } catch { toast.error("Could not duplicate discount."); } finally { setBusy(false); }
  };

  const openDelete = (id: string) => setConfirm({ type: "delete", ids: [id] });
  const handleDelete = async () => {
    if (!confirm) return;
    setBusy(true);
    try { for (const id of confirm.ids) await deleteDiscount(id); setDiscounts((prev) => prev.filter((d) => !confirm.ids.includes(d.id))); toast.success(`${confirm.ids.length} promotion${confirm.ids.length > 1 ? "s" : ""} deleted.`); setConfirm(null); clearSelection(); } catch { toast.error("Could not delete discount."); } finally { setBusy(false); }
  };

  const handleConfirmDisable = async () => {
    if (!confirm) return;
    setBusy(true);
    try { for (const id of confirm.ids) { const updated = await toggleDiscountEnabled(id, false); setDiscounts((prev) => prev.map((d) => d.id === id ? updated : d)); } toast.success(`${confirm.ids.length} promotion${confirm.ids.length > 1 ? "s" : ""} disabled.`); setConfirm(null); clearSelection(); } catch { toast.error("Could not disable discount."); } finally { setBusy(false); }
  };

  const bulkEnable = async () => {
    setBusy(true);
    try { for (const id of selected) { const updated = await toggleDiscountEnabled(id, true); setDiscounts((prev) => prev.map((d) => d.id === id ? updated : d)); } toast.success(`${selected.size} promotion${selected.size > 1 ? "s" : ""} enabled.`); clearSelection(); } catch { toast.error("Could not enable discounts."); } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Marketing</p>
          <h1 className="font-serif text-4xl text-on-surface">Discounts & Promotions</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Build, schedule, and monitor codes that drive floral orders.</p>
        </div>
        <Button onClick={openCreate} className="min-h-11 rounded-full px-5"><Plus className="h-4 w-4" /> Create Discount</Button>
      </header>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Active Discounts" value={metrics.active.toString()} change="Live now" icon={Percent} />
        <MetricCard label="Scheduled" value={metrics.scheduled.toString()} change="Upcoming" icon={Calendar} />
        <MetricCard label="Total Redemptions" value={metrics.redemptions.toLocaleString()} change="Codes used" icon={Tag} />
        <MetricCard label="Revenue Influenced" value={`$${Math.round(metrics.revenue).toLocaleString()}`} change="Estimated" icon={DollarSign} />
      </section>
      <section className="space-y-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Discount status">
            {(["active", "scheduled", "expired"] as TabStatus[]).map((status) => (
              <button key={status} role="tab" aria-selected={tab === status} onClick={() => setTab(status)} className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors", tab === status ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}>
                {statusConfig[status].label}<span className={cn("rounded-full px-2 py-0.5 text-xs", tab === status ? "bg-on-primary/20 text-on-primary" : "bg-surface-container-high text-on-surface-variant")}>{tabCounts[status]}</span>
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <label className="relative flex-1"><span className="sr-only">Search discounts</span><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search code or name..." className="min-h-11 rounded-full border-0 bg-surface-container pl-11" /></label>
            <Select value={typeFilter} onValueChange={(v) => v && setTypeFilter(v as DiscountType | "all")}><SelectTrigger className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue placeholder="Type" /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest"><SelectItem value="all">All types</SelectItem><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed</SelectItem><SelectItem value="delivery">Free delivery</SelectItem></SelectContent></Select>
          </div>
          <Button variant="outline" onClick={() => setFiltersOpen(true)} className="min-h-11 rounded-full px-5 lg:hidden"><FilterIcon className="h-4 w-4" /> Filters</Button>
        </div>
        {discounts.length === 0 ? <DiscountsEmpty onCreate={openCreate} /> :
        filteredDiscounts.length === 0 ? <DiscountsNoResults onClear={clearFilters} /> :
        <>
          {selected.size > 0 && <BulkBar selected={selected.size} onEnable={bulkEnable} onDisable={() => { const ids = Array.from(selected).filter((id) => discounts.find((d) => d.id === id)?.enabled); if (ids.length) setConfirm({ type: "disable", ids }); }} onDelete={() => setConfirm({ type: "delete", ids: Array.from(selected) })} onSelectAll={selectAll} onClear={clearSelection} busy={busy} />}
          <div className="hidden overflow-hidden rounded-2xl bg-surface-container md:block">
            <Table>
              <TableHeader className="bg-surface-container/30 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70"><TableRow><TableHead className="p-4">Code</TableHead><TableHead className="p-4">Promotion</TableHead><TableHead className="p-4">Type</TableHead><TableHead className="p-4">Value</TableHead><TableHead className="p-4">Eligibility</TableHead><TableHead className="p-4">Usage</TableHead><TableHead className="p-4">Schedule</TableHead><TableHead className="p-4">Status</TableHead><TableHead className="p-4 text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{filteredDiscounts.map((discount) => <DiscountRow key={discount.id} discount={discount} selected={selected.has(discount.id)} onToggle={() => toggleSelect(discount.id)} onEdit={() => openEdit(discount)} onDuplicate={() => handleDuplicate(discount)} onDelete={() => openDelete(discount.id)} onToggleEnabled={(enabled) => handleToggle(discount.id, enabled)} busy={busy} />)}</TableBody>
            </Table>
          </div>
          <div className="grid gap-4 md:hidden">{filteredDiscounts.map((discount) => <DiscountCard key={discount.id} discount={discount} selected={selected.has(discount.id)} onToggle={() => toggleSelect(discount.id)} onEdit={() => openEdit(discount)} onDuplicate={() => handleDuplicate(discount)} onDelete={() => openDelete(discount.id)} onToggleEnabled={(enabled) => handleToggle(discount.id, enabled)} busy={busy} />)}</div>
        </>}
      </section>
      {editing && <DiscountEditor key={editing.id || "new"} open={editorOpen} onOpenChange={setEditorOpen} discount={editing} onSave={handleSave} busy={busy} />}
      <ConfirmDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)} action={confirm} onConfirm={confirm?.type === "delete" ? handleDelete : handleConfirmDisable} busy={busy} />
      <FilterSheet open={filtersOpen} onOpenChange={setFiltersOpen} search={search} setSearch={setSearch} typeFilter={typeFilter} setTypeFilter={setTypeFilter} />
    </div>
  );
}

function MetricCard({ label, value, change, icon: Icon }: { label: string; value: string; change: string; icon: React.ComponentType<{ className?: string }> }) { return <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-secondary-container text-secondary"><Icon className="h-5 w-5" /></span><div><p className="text-xs text-on-surface-variant">{label}</p><p className="font-serif text-2xl">{value}</p></div></div><p className="mt-3 text-xs text-secondary">{change}</p></div>; }

function DiscountTypeBadge({ type }: { type: DiscountType }) { const config = typeConfig[type]; const Icon = config.icon; return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium", config.classes)}><Icon className="h-3.5 w-3.5" />{config.label}</span>; }

function DiscountStatusBadge({ status, enabled }: { status: DiscountStatus; enabled: boolean }) {
  const config = statusConfig[status];
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.classes)}><span className="h-1.5 w-1.5 rounded-full bg-current" />{enabled ? config.label : `${config.label} · Paused`}</span>;
}

function UsageBar({ used, limit }: { used: number; limit?: number }) {
  const total = limit ?? Math.max(used, 100);
  const pct = Math.min(100, Math.round((used / total) * 100));
  return <div className="w-24"><div className="h-2 overflow-hidden rounded-full bg-surface-container"><div className="h-full rounded-full bg-primary transition-all motion-reduce:transition-none" style={{ width: `${pct}%` }} /></div><p className="mt-1 text-xs text-on-surface-variant">{used.toLocaleString()} / {limit ? limit.toLocaleString() : "∞"}</p></div>;
}

function DiscountRow({ discount, selected, onToggle, onEdit, onDuplicate, onDelete, onToggleEnabled, busy }: { discount: Discount; selected: boolean; onToggle: () => void; onEdit: () => void; onDuplicate: () => void; onDelete: () => void; onToggleEnabled: (enabled: boolean) => void; busy: boolean }) {
  const status = getDiscountStatus(discount);
  const dateRange = `${formatDate(discount.startDate)} – ${formatDate(discount.endDate)}`;
  const value = discount.type === "delivery" ? "Free" : discount.type === "percentage" ? `${discount.value}%` : `$${discount.value}`;
  return (
    <TableRow className="border-b border-outline-variant/40">
      <TableCell className="p-4"><div className="flex items-center gap-3"><input type="checkbox" aria-label={`Select ${discount.code}`} checked={selected} onChange={onToggle} className="h-5 w-5 accent-secondary" /><span className="font-mono font-medium">{discount.code}</span></div></TableCell>
      <TableCell className="p-4 font-medium">{discount.name}</TableCell>
      <TableCell className="p-4"><DiscountTypeBadge type={discount.type} /></TableCell>
      <TableCell className="p-4">{value}</TableCell>
      <TableCell className="p-4 text-sm text-on-surface-variant">{discount.customerEligibility === "all" ? "All customers" : discount.customerEligibility === "vip" ? "VIP only" : discount.customerEligibility === "new" ? "New customers" : "Specific segments"}</TableCell>
      <TableCell className="p-4"><UsageBar used={discount.usedCount} limit={discount.usageLimit} /></TableCell>
      <TableCell className="p-4 text-sm text-on-surface-variant">{dateRange}</TableCell>
      <TableCell className="p-4"><DiscountStatusBadge status={status} enabled={discount.enabled} /></TableCell>
      <TableCell className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button role="switch" aria-checked={discount.enabled} aria-label={`${discount.enabled ? "Disable" : "Enable"} ${discount.code}`} onClick={() => onToggleEnabled(!discount.enabled)} disabled={busy} className={cn("grid h-11 w-11 place-items-center rounded-full", discount.enabled ? "text-secondary" : "text-on-surface-variant")}>{discount.enabled ? <CheckCircle className="h-5 w-5" /> : <X className="h-5 w-5" />}</button>
          <button aria-label={`Edit ${discount.code}`} onClick={onEdit} disabled={busy} className="grid h-11 w-11 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"><Pencil className="h-4 w-4" /></button>
          <button aria-label={`Duplicate ${discount.code}`} onClick={onDuplicate} disabled={busy} className="grid h-11 w-11 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"><Copy className="h-4 w-4" /></button>
          <button aria-label={`Delete ${discount.code}`} onClick={onDelete} disabled={busy} className="grid h-11 w-11 place-items-center rounded-full text-error hover:bg-error-container disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function DiscountCard({ discount, selected, onToggle, onEdit, onDuplicate, onDelete, onToggleEnabled, busy }: { discount: Discount; selected: boolean; onToggle: () => void; onEdit: () => void; onDuplicate: () => void; onDelete: () => void; onToggleEnabled: (enabled: boolean) => void; busy: boolean }) {
  const status = getDiscountStatus(discount);
  const value = discount.type === "delivery" ? "Free delivery" : discount.type === "percentage" ? `${discount.value}% off` : `$${discount.value} off`;
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <input type="checkbox" aria-label={`Select ${discount.code}`} checked={selected} onChange={onToggle} className="h-5 w-5 accent-secondary" />
          <div><p className="font-mono font-medium">{discount.code}</p><p className="text-sm font-medium">{discount.name}</p></div>
        </div>
        <DiscountStatusBadge status={status} enabled={discount.enabled} />
      </div>
      <div className="mt-4 flex items-center gap-2"><DiscountTypeBadge type={discount.type} /><span className="text-sm font-medium">{value}</span></div>
      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs text-on-surface-variant">Eligibility</p><p>{discount.customerEligibility === "all" ? "All customers" : discount.customerEligibility}</p></div>
        <div><p className="text-xs text-on-surface-variant">Schedule</p><p>{formatDate(discount.startDate)} – {formatDate(discount.endDate)}</p></div>
      </div>
      <div className="mt-3"><UsageBar used={discount.usedCount} limit={discount.usageLimit} /></div>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-outline-variant/30 pt-4">
        <button onClick={() => onToggleEnabled(!discount.enabled)} disabled={busy} className={cn("flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium", discount.enabled ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-on-surface-variant")}>{discount.enabled ? <><CheckCircle className="h-4 w-4" /> Enabled</> : <><X className="h-4 w-4" /> Paused</>}</button>
        <Button variant="outline" size="sm" onClick={onEdit} disabled={busy} className="min-h-10 rounded-full"><Pencil className="h-4 w-4" /> Edit</Button>
        <Button variant="outline" size="sm" onClick={onDuplicate} disabled={busy} className="min-h-10 rounded-full"><Copy className="h-4 w-4" /> Copy</Button>
        <Button variant="destructive" size="sm" onClick={onDelete} disabled={busy} className="min-h-10 rounded-full"><Trash2 className="h-4 w-4" /> Delete</Button>
      </div>
    </article>
  );
}

function BulkBar({ selected, onEnable, onDisable, onDelete, onSelectAll, onClear, busy }: { selected: number; onEnable: () => void; onDisable: () => void; onDelete: () => void; onSelectAll: () => void; onClear: () => void; busy: boolean }) {
  return <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-inverse-surface px-5 py-3 text-inverse-on-surface" role="status"><span className="mr-auto font-medium" aria-live="polite">{selected} selected</span><button onClick={onSelectAll} className="text-sm underline">Select all visible</button><Button variant="outline" onClick={onEnable} disabled={busy} className="min-h-10 rounded-full bg-transparent text-inverse-on-surface"><CheckCircle className="h-4 w-4" /> Enable</Button><Button variant="outline" onClick={onDisable} disabled={busy} className="min-h-10 rounded-full bg-transparent text-inverse-on-surface"><X className="h-4 w-4" /> Disable</Button><Button variant="outline" onClick={onDelete} disabled={busy} className="min-h-10 rounded-full bg-transparent text-inverse-on-surface"><Trash2 className="h-4 w-4" /> Delete</Button><Button variant="outline" onClick={onClear} className="min-h-10 rounded-full bg-transparent text-inverse-on-surface">Clear</Button></div>;
}

function DiscountEditor({ open, onOpenChange, discount, onSave, busy }: { open: boolean; onOpenChange: (open: boolean) => void; discount: Discount | null; onSave: (d: Discount) => void; busy: boolean }) {
  const base = discount ?? emptyDiscount();
  const [draft, setDraft] = useState<Discount>(() => ({ ...base }));
  const [errors, setErrors] = useState<string[]>([]);

  const update = (patch: Partial<Discount>) => setDraft((prev) => ({ ...prev, ...patch }));
  const validate = () => {
    const list: string[] = [];
    if (!draft.code.trim()) list.push("Discount code is required.");
    if (!draft.name.trim()) list.push("Internal name is required.");
    if (draft.type !== "delivery" && draft.value <= 0) list.push("Value must be greater than zero.");
    if (draft.type === "percentage" && draft.value > 100) list.push("Percentage cannot exceed 100.");
    if (new Date(draft.startDate) >= new Date(draft.endDate)) list.push("End date must be after start date.");
    setErrors(list);
    return list.length === 0;
  };
  const submit = () => { if (validate()) onSave(draft); };
  const generate = () => { update({ code: generateDiscountCode() }); };
  const isNew = !base.id;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ width: "min(56rem, calc(100vw - 2rem))", maxWidth: "none", backgroundColor: "#fff" }} className="max-h-[90vh] overflow-y-auto rounded-2xl p-6">
        <DialogHeader><span className="grid h-12 w-12 place-items-center rounded-full bg-primary-fixed text-primary"><Percent className="h-5 w-5" /></span><DialogTitle className="font-serif text-2xl">{isNew ? "Create Discount" : `Edit ${base.code}`}</DialogTitle><DialogDescription>Configure the code, value, schedule, and eligibility.</DialogDescription></DialogHeader>
        {errors.length > 0 && <div role="alert" className="rounded-xl bg-error-container p-3 text-sm text-error"><ul className="list-disc space-y-1 pl-4">{errors.map((e) => <li key={e}>{e}</li>)}</ul></div>}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Field id="code" label="Discount Code" error={!draft.code.trim() && errors.length > 0}><div className="flex gap-2"><Input id="code" value={draft.code} onChange={(e) => update({ code: e.target.value.toUpperCase() })} placeholder="BLOOM15" aria-invalid={!draft.code.trim() && errors.length > 0} className="min-h-11 rounded-xl bg-surface-container font-mono" /><Button variant="outline" onClick={generate} className="min-h-11 rounded-full px-4">Generate</Button></div></Field>
            <Field id="name" label="Internal Name" error={!draft.name.trim() && errors.length > 0}><Input id="name" value={draft.name} onChange={(e) => update({ name: e.target.value })} placeholder="Spring promotion" aria-invalid={!draft.name.trim() && errors.length > 0} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="type" label="Discount Type"><Select value={draft.type} onValueChange={(v) => { if (!v) return; const type = v as DiscountType; update({ type, value: type === "delivery" ? 0 : draft.value || 10 }); }}><SelectTrigger id="type" className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest"><SelectItem value="percentage">Percentage</SelectItem><SelectItem value="fixed">Fixed amount</SelectItem><SelectItem value="delivery">Free delivery</SelectItem></SelectContent></Select></Field>
              {draft.type !== "delivery" && <Field id="value" label={draft.type === "percentage" ? "Percentage Off" : "Amount Off ($)"}><Input id="value" type="number" min={1} max={draft.type === "percentage" ? 100 : undefined} value={draft.value} onChange={(e) => update({ value: Number(e.target.value) })} className="min-h-11 rounded-xl bg-surface-container" /></Field>}
            </div>
            <Field id="min-purchase" label="Minimum Purchase ($)"><Input id="min-purchase" type="number" min={0} value={draft.minPurchase} onChange={(e) => update({ minPurchase: Number(e.target.value) })} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            <div className="grid grid-cols-2 gap-4">
              <Field id="usage-limit" label="Total Redemption Limit"><Input id="usage-limit" type="number" min={1} value={draft.usageLimit ?? ""} onChange={(e) => update({ usageLimit: e.target.value ? Number(e.target.value) : undefined })} placeholder="Unlimited" className="min-h-11 rounded-xl bg-surface-container" /></Field>
              <Field id="per-customer" label="Per-Customer Limit"><Input id="per-customer" type="number" min={0} value={draft.perCustomerLimit ?? ""} onChange={(e) => update({ perCustomerLimit: e.target.value ? Number(e.target.value) : undefined })} placeholder="Unlimited" className="min-h-11 rounded-xl bg-surface-container" /></Field>
            </div>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field id="start" label="Start Date"><Input id="start" type="date" value={draft.startDate} onChange={(e) => update({ startDate: e.target.value })} className="min-h-11 rounded-xl bg-surface-container" /></Field>
              <Field id="end" label="End Date"><Input id="end" type="date" value={draft.endDate} onChange={(e) => update({ endDate: e.target.value })} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            </div>
            <Field id="applies-to" label="Applies To"><Select value={draft.appliesTo} onValueChange={(v) => v && update({ appliesTo: v as Discount["appliesTo"] })}><SelectTrigger id="applies-to" className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest"><SelectItem value="all">All products</SelectItem><SelectItem value="collections">Specific collections</SelectItem><SelectItem value="products">Specific products</SelectItem></SelectContent></Select></Field>
            <Field id="customers" label="Customer Eligibility"><Select value={draft.customerEligibility} onValueChange={(v) => v && update({ customerEligibility: v as Discount["customerEligibility"] })}><SelectTrigger id="customers" className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest"><SelectItem value="all">All customers</SelectItem><SelectItem value="vip">VIP clients</SelectItem><SelectItem value="new">New customers</SelectItem><SelectItem value="specific">Specific segments</SelectItem></SelectContent></Select></Field>
            <Field id="combine" label="Combinability"><Select value={draft.combinability} onValueChange={(v) => v && update({ combinability: v as Discount["combinability"] })}><SelectTrigger id="combine" className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest"><SelectItem value="none">Cannot combine</SelectItem><SelectItem value="all">Can combine with all</SelectItem><SelectItem value="except_free_delivery">All except free delivery</SelectItem></SelectContent></Select></Field>
            <div className="flex items-center justify-between rounded-xl bg-surface-container p-4"><div><p className="font-medium">Active on save</p><p className="text-xs text-on-surface-variant">Set to live immediately after publishing.</p></div><button role="switch" aria-checked={draft.enabled} onClick={() => update({ enabled: !draft.enabled })} className={cn("relative h-7 w-12 shrink-0 rounded-full transition-colors", draft.enabled ? "bg-secondary" : "bg-surface-container-highest")}><span className={cn("absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none", draft.enabled ? "left-6" : "left-1")} /></button></div>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button onClick={submit} disabled={busy}>{isNew ? "Create Discount" : "Save Changes"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({ open, onOpenChange, action, onConfirm, busy }: { open: boolean; onOpenChange: (open: boolean) => void; action: ConfirmAction; onConfirm: () => void; busy: boolean }) {
  if (!action) return null;
  const title = action.type === "delete" ? `Delete ${action.ids.length} promotion${action.ids.length > 1 ? "s" : ""}?` : `Disable ${action.ids.length} promotion${action.ids.length > 1 ? "s" : ""}?`;
  const description = action.type === "delete" ? "This action cannot be undone. Active codes will stop working immediately." : "Codes will remain in the list but cannot be applied at checkout until re-enabled.";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ width: "min(30rem, calc(100vw - 2rem))", maxWidth: "none", backgroundColor: "#fff" }} className="rounded-2xl p-6">
        <DialogHeader><span className="grid h-12 w-12 place-items-center rounded-full bg-error-container text-error"><AlertTriangle className="h-5 w-5" /></span><DialogTitle className="font-serif text-2xl">{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button variant="destructive" onClick={onConfirm} disabled={busy}>{action.type === "delete" ? "Delete" : "Disable"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FilterSheet({ open, onOpenChange, search, setSearch, typeFilter, setTypeFilter }: { open: boolean; onOpenChange: (v: boolean) => void; search: string; setSearch: (v: string) => void; typeFilter: DiscountType | "all"; setTypeFilter: (v: DiscountType | "all") => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85svh] rounded-t-2xl p-6">
        <SheetHeader><SheetTitle className="font-serif text-2xl">Filter discounts</SheetTitle><SheetDescription>Find promotions by code, name, or type.</SheetDescription></SheetHeader>
        <div className="mt-4 space-y-4">
          <label className="relative block"><span className="sr-only">Search discounts</span><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search code or name..." className="min-h-11 rounded-full border-0 bg-surface-container pl-11" /></label>
          <label className="block text-sm font-medium">Type<select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as DiscountType | "all")} className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3"><option value="all">All types</option><option value="percentage">Percentage</option><option value="fixed">Fixed amount</option><option value="delivery">Free delivery</option></select></label>
        </div>
        <SheetFooter className="mt-4"><Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: boolean; children: React.ReactNode }) { return <div className="space-y-2"><Label htmlFor={id} className={cn(error && "text-error")}>{label}</Label>{children}</div>; }

function formatDate(iso: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(iso)); }
