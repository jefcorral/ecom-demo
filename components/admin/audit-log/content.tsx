"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  Bot,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Download,
  Filter,
  History,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { AuditAction, AuditEvent, AuditSeverity, auditActionLabels, exportAuditEvents } from "@/lib/admin-audit-log";
import { AuditLogNoResults } from "./states";

type DateRange = "all" | "today" | "7days" | "30days";

const severityStyles: Record<AuditSeverity, string> = {
  info: "bg-secondary-container text-on-secondary-container",
  warning: "bg-primary-fixed text-on-primary-fixed-variant",
  critical: "bg-error-container text-error",
};

const dateLabels: Record<DateRange, string> = {
  all: "All time",
  today: "Today",
  "7days": "Past 7 days",
  "30days": "Past 30 days",
};

const pageSize = 8;

export function AuditLogContent({ events }: { events: AuditEvent[] }) {
  const [search, setSearch] = useState("");
  const [actor, setActor] = useState("all");
  const [action, setAction] = useState<"all" | AuditAction>("all");
  const [dateRange, setDateRange] = useState<DateRange>("7days");
  const [expanded, setExpanded] = useState<Set<string>>(new Set([events[0]?.id].filter(Boolean)));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);

  const actors = useMemo(() => Array.from(new Set(events.map((event) => event.actor.name))), [events]);
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return events.filter((event) => {
      const searchable = `${event.actor.name} ${event.actor.role} ${auditActionLabels[event.action]} ${event.target.name} ${event.target.reference} ${event.ipAddress}`.toLowerCase();
      return (!term || searchable.includes(term)) && (actor === "all" || event.actor.name === actor) && (action === "all" || event.action === action) && matchesDate(event.timestamp, dateRange);
    });
  }, [events, search, actor, action, dateRange]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const activeFilters = Number(actor !== "all") + Number(action !== "all") + Number(dateRange !== "7days");

  const updateSearch = (value: string) => { setSearch(value); setPage(1); };
  const updateActor = (value: string) => { setActor(value); setPage(1); };
  const updateAction = (value: "all" | AuditAction) => { setAction(value); setPage(1); };
  const updateDate = (value: DateRange) => { setDateRange(value); setPage(1); };
  const clearFilters = () => { setSearch(""); setActor("all"); setAction("all"); setDateRange("7days"); setPage(1); };
  const toggleExpanded = (id: string) => setExpanded((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const exportCsv = () => {
    const csv = exportAuditEvents(filtered.length ? filtered : events);
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `bloom-stem-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`${filtered.length || events.length} audit events exported.`);
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-secondary">Security &amp; governance · Live journal</p>
          <h1 className="mt-2 font-serif text-4xl text-on-surface">Audit Log</h1>
          <p className="mt-1 text-on-surface-variant">Track staff actions, privileged operations, and botanical registry activity.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full bg-secondary-container px-4 py-3 text-xs font-medium text-on-secondary-container sm:inline-flex"><span className="h-2 w-2 rounded-full bg-secondary" /> Live ledger · 365-day retention</span>
          <Button variant="outline" onClick={exportCsv} className="min-h-11 rounded-full px-5"><Download className="h-4 w-4" /> Export log</Button>
        </div>
      </header>

      <Metrics events={events} />

      <section className="rounded-2xl bg-surface-container-lowest p-3 shadow-sm" aria-label="Audit log filters">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search audit events</span>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
            <Input value={search} onChange={(event) => updateSearch(event.target.value)} placeholder="Search actor, action, target or IP..." className="min-h-12 rounded-full bg-surface-container pl-11" />
          </label>
          <div className="hidden items-center gap-2 md:flex">
            <FilterSelect label="Staff" value={actor} onChange={updateActor} options={[{ value: "all", label: "All staff & system" }, ...actors.map((name) => ({ value: name, label: name }))]} />
            <FilterSelect label="Action" value={action} onChange={(value) => updateAction(value as "all" | AuditAction)} options={[{ value: "all", label: "All actions" }, ...Object.entries(auditActionLabels).map(([value, label]) => ({ value, label }))]} />
            <FilterSelect label="Date" value={dateRange} onChange={(value) => updateDate(value as DateRange)} options={Object.entries(dateLabels).map(([value, label]) => ({ value, label }))} />
            {(activeFilters > 0 || search) && <Button variant="ghost" onClick={clearFilters} className="min-h-11 rounded-full">Clear</Button>}
          </div>
          <Button onClick={() => setFiltersOpen(true)} className="min-h-12 rounded-full md:hidden"><Filter className="h-4 w-4" /> Filters{activeFilters ? ` (${activeFilters})` : ""}</Button>
        </div>
      </section>

      {filtered.length === 0 ? <AuditLogNoResults onClear={clearFilters} /> : (
        <>
          <div className="hidden overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm md:block">
            <table className="w-full border-collapse text-left">
              <thead className="border-b border-outline-variant/30 bg-surface-container/40 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
                <tr><th className="p-4">Timestamp</th><th className="p-4">Actor</th><th className="p-4">Action</th><th className="p-4">Target entity</th><th className="p-4">Origin IP</th><th className="p-4 text-right">Details</th></tr>
              </thead>
              <tbody>{visible.map((event) => <AuditRow key={event.id} event={event} open={expanded.has(event.id)} onToggle={() => toggleExpanded(event.id)} />)}</tbody>
            </table>
            <Pagination page={page} pages={totalPages} count={filtered.length} onChange={setPage} />
          </div>
          <div className="space-y-4 md:hidden">{visible.map((event) => <AuditCard key={event.id} event={event} open={expanded.has(event.id)} onToggle={() => toggleExpanded(event.id)} />)}</div>
          <div className="md:hidden"><Pagination page={page} pages={totalPages} count={filtered.length} onChange={setPage} /></div>
        </>
      )}

      <div className="flex items-start gap-3 rounded-2xl bg-surface-container p-4 text-xs text-on-surface-variant"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /><p>Audit records are append-only and immutably signed. Sensitive values are masked in all exports and interface views.</p></div>
      <AuditFilterSheet open={filtersOpen} setOpen={setFiltersOpen} actors={actors} actor={actor} action={action} dateRange={dateRange} setActor={updateActor} setAction={updateAction} setDate={updateDate} clear={clearFilters} />
    </div>
  );
}

function Metrics({ events }: { events: AuditEvent[] }) {
  const metrics = [
    { label: "Total Recorded", value: "2,480 events", icon: ClipboardCheck, tone: "bg-secondary-container text-secondary" },
    { label: "Inventory Shifts", value: `${events.filter((event) => event.metadata.module === "Inventory").length.toLocaleString()} recent`, icon: Activity, tone: "bg-secondary-container text-secondary" },
    { label: "Security Flags", value: `${events.filter((event) => event.severity === "critical").length} privileged`, icon: ShieldAlert, tone: "bg-primary-fixed text-primary" },
    { label: "Last Sync", value: "2 mins ago", icon: History, tone: "bg-surface-container text-on-surface-variant" },
  ];
  return <section className="grid grid-cols-2 gap-4 lg:grid-cols-4" aria-label="Audit metrics">{metrics.map(({ label, value, icon: Icon, tone }) => <div key={label} className="flex items-center justify-between rounded-2xl bg-surface-container-lowest p-4 shadow-sm"><div><p className="text-xs uppercase tracking-widest text-on-surface-variant">{label}</p><p className="mt-1 font-serif text-xl">{value}</p></div><span className={cn("grid h-11 w-11 place-items-center rounded-full", tone)}><Icon className="h-5 w-5" /></span></div>)}</section>;
}

function AuditRow({ event, open, onToggle }: { event: AuditEvent; open: boolean; onToggle: () => void }) {
  return <>
    <tr className="border-b border-outline-variant/30 hover:bg-surface-container/20">
      <td className="p-4 text-sm"><time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time></td>
      <td className="p-4"><Actor actor={event.actor} /></td>
      <td className="p-4"><ActionBadge event={event} /></td>
      <td className="p-4"><p className="text-sm font-medium">{event.target.name}</p><p className="text-xs text-on-surface-variant">{event.target.reference}</p></td>
      <td className="p-4 font-mono text-xs text-on-surface-variant">{event.ipAddress}</td>
      <td className="p-4 text-right"><button onClick={onToggle} aria-label={`${open ? "Collapse" : "Expand"} details for ${auditActionLabels[event.action]}`} aria-expanded={open} className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-container"><ChevronDown className={cn("h-4 w-4 transition-transform motion-reduce:transition-none", open && "rotate-180")} /></button></td>
    </tr>
    {open && <tr className="border-b border-outline-variant/30"><td colSpan={6} className="p-4"><TechnicalDetails event={event} /></td></tr>}
  </>;
}

function AuditCard({ event, open, onToggle }: { event: AuditEvent; open: boolean; onToggle: () => void }) {
  return <article className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
    <div className="flex items-center justify-between gap-3 text-xs text-on-surface-variant"><time dateTime={event.timestamp}>{formatTimestamp(event.timestamp)}</time><span className="rounded-full bg-surface-container px-2 py-1 font-mono">{event.ipAddress}</span></div>
    <div className="mt-4 flex items-center justify-between gap-3"><Actor actor={event.actor} /><ActionBadge event={event} /></div>
    <button onClick={onToggle} aria-expanded={open} className="mt-4 flex min-h-14 w-full items-center justify-between rounded-xl bg-surface-container p-3 text-left"><span><span className="block font-medium">{event.target.name}</span><span className="block text-xs text-on-surface-variant">{event.target.reference}</span></span><ChevronDown className={cn("h-5 w-5 transition-transform motion-reduce:transition-none", open && "rotate-180")} /></button>
    {open && <div className="mt-3"><TechnicalDetails event={event} /></div>}
  </article>;
}

function Actor({ actor }: { actor: AuditEvent["actor"] }) {
  return <div className="flex items-center gap-3"><span className={cn("grid h-9 w-9 place-items-center rounded-full text-xs font-medium", actor.type === "system" ? "bg-surface-container text-on-surface-variant" : "bg-secondary-container text-on-secondary-container")}>{actor.type === "system" ? <Bot className="h-4 w-4" /> : actor.initials}</span><span><span className="block text-sm font-medium">{actor.name}</span><span className="block text-xs text-on-surface-variant">{actor.role}</span></span></div>;
}

function ActionBadge({ event }: { event: AuditEvent }) {
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium", severityStyles[event.severity])}><span className="h-1.5 w-1.5 rounded-full bg-current" />{auditActionLabels[event.action]}</span>;
}

function TechnicalDetails({ event }: { event: AuditEvent }) {
  return <div className="rounded-xl bg-surface-container p-4 text-xs">
    <p className="mb-3 flex items-center gap-2 font-medium uppercase tracking-widest"><Activity className="h-4 w-4 text-secondary" /> Payload diff &amp; telemetry</p>
    <div className="grid gap-3 lg:grid-cols-3">
      <StateBlock label="Previous State" state={event.previousState} tone="text-error" />
      <StateBlock label="Committed State" state={event.committedState} tone="text-secondary" />
      <dl className="space-y-2 rounded-lg bg-surface-container-lowest p-3"><Detail label="Request ID" value={event.requestId} /><Detail label="Authentication" value={event.authentication} /><Detail label="Client" value={event.userAgent} />{Object.entries(event.metadata).map(([label, value]) => <Detail key={label} label={label} value={value} />)}</dl>
    </div>
  </div>;
}

function StateBlock({ label, state, tone }: { label: string; state?: Record<string, string | number | boolean>; tone: string }) {
  return <div className="rounded-lg bg-surface-container-lowest p-3"><p className={cn("mb-2 font-medium", tone)}>{label}</p><pre className="overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed text-on-surface-variant">{state ? JSON.stringify(state, null, 2) : "No state captured"}</pre></div>;
}

function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="text-on-surface-variant">{label}</dt><dd className="mt-0.5 break-words font-mono">{value}</dd></div>; }

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <label className="relative"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-12 appearance-none rounded-full border border-outline-variant/50 bg-surface-container px-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-ring">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" /></label>;
}

function AuditFilterSheet({ open, setOpen, actors, actor, action, dateRange, setActor, setAction, setDate, clear }: { open: boolean; setOpen: (open: boolean) => void; actors: string[]; actor: string; action: "all" | AuditAction; dateRange: DateRange; setActor: (value: string) => void; setAction: (value: "all" | AuditAction) => void; setDate: (value: DateRange) => void; clear: () => void }) {
  return <Sheet open={open} onOpenChange={setOpen}><SheetContent side="bottom" className="rounded-t-2xl px-5 pb-6"><SheetHeader><SheetTitle className="font-serif text-2xl">Filter audit events</SheetTitle><SheetDescription>Narrow the ledger by actor, action, or date.</SheetDescription></SheetHeader><div className="mt-6 space-y-4"><SheetSelect label="Staff member" value={actor} onChange={setActor} options={[{ value: "all", label: "All staff & system" }, ...actors.map((name) => ({ value: name, label: name }))]} /><SheetSelect label="Action" value={action} onChange={(value) => setAction(value as "all" | AuditAction)} options={[{ value: "all", label: "All actions" }, ...Object.entries(auditActionLabels).map(([value, label]) => ({ value, label }))]} /><SheetSelect label="Date range" value={dateRange} onChange={(value) => setDate(value as DateRange)} options={Object.entries(dateLabels).map(([value, label]) => ({ value, label }))} /><div className="flex gap-3 pt-2"><Button variant="outline" onClick={clear} className="min-h-11 flex-1 rounded-full"><X className="h-4 w-4" /> Clear</Button><Button onClick={() => setOpen(false)} className="min-h-11 flex-1 rounded-full">Apply filters</Button></div></div></SheetContent></Sheet>;
}

function SheetSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) {
  return <label className="block text-sm font-medium">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-outline-variant bg-surface px-3">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}

function Pagination({ page, pages, count, onChange }: { page: number; pages: number; count: number; onChange: (page: number) => void }) {
  return <div className="flex items-center justify-between border-t border-outline-variant/30 p-4"><p className="text-xs text-on-surface-variant">Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, count)} of {count} events</p><nav aria-label="Audit log pagination" className="flex items-center gap-1"><button aria-label="Previous page" disabled={page === 1} onClick={() => onChange(page - 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-container disabled:opacity-30"><ChevronLeft className="h-4 w-4" /></button>{Array.from({ length: pages }, (_, index) => index + 1).slice(0, 4).map((number) => <button key={number} aria-current={number === page ? "page" : undefined} onClick={() => onChange(number)} className={cn("grid h-11 w-11 place-items-center rounded-full text-sm", number === page ? "bg-primary-container text-on-primary-container" : "hover:bg-surface-container")}>{number}</button>)}<button aria-label="Next page" disabled={page === pages} onClick={() => onChange(page + 1)} className="grid h-11 w-11 place-items-center rounded-full hover:bg-surface-container disabled:opacity-30"><ChevronRight className="h-4 w-4" /></button></nav></div>;
}

function formatTimestamp(value: string) { return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(new Date(value)); }
function matchesDate(timestamp: string, range: DateRange) { if (range === "all") return true; const date = new Date(timestamp); const latest = new Date("2023-10-24T23:59:59-04:00"); const days = (latest.getTime() - date.getTime()) / 86400000; if (range === "today") return days < 1; if (range === "7days") return days < 7; return days < 30; }
