"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Archive, ArrowDown, ArrowLeft, ArrowUp, CheckCircle, Clock, Download, DollarSign, Eye, Filter, GripVertical, Image as ImageIcon, LayoutGrid, Mail, Minus, Monitor, Pencil, Plus, Search, Send, Smartphone, Trash2, TrendingUp, Type, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import { archiveCampaign, Campaign, campaignToDraft, CampaignDraft, CampaignStatus, deleteCampaign, emptyCampaignDraft, exportSubscribersCSV, fetchNewsletterData, NewsletterData, saveCampaignDraft, scheduleCampaign, segmentCounts, segmentLabels, sendCampaign, sendTestCampaign, Subscriber, SubscriberSegment } from "@/lib/admin-newsletter";
import { CampaignsEmpty, SubscribersEmpty, SubscribersNoResults } from "./states";

type ConfirmAction = { type: "send" } | { type: "archive"; id: string } | { type: "delete"; id: string };
type BlockType = CampaignDraft["blocks"][number]["type"];
type PreviewMode = "desktop" | "mobile";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const percent = new Intl.NumberFormat("en-US", { style: "percent", minimumFractionDigits: 1, maximumFractionDigits: 1 });

const metrics = [
  { label: "Subscribers", value: "24,850", change: "+8.2%", icon: Users },
  { label: "Growth", value: "+12.4%", change: "vs last month", icon: TrendingUp },
  { label: "Average Open Rate", value: "52.4%", change: "+3.1%", icon: Eye },
  { label: "Revenue", value: "$68,080", change: "Tracked from email", icon: DollarSign },
];

const statusConfig: Record<CampaignStatus, { label: string; icon: typeof Clock; classes: string }> = {
  draft: { label: "Draft", icon: Pencil, classes: "bg-surface-container text-on-surface-variant" },
  scheduled: { label: "Scheduled", icon: Clock, classes: "bg-primary-container text-on-primary-container" },
  sent: { label: "Sent", icon: CheckCircle, classes: "bg-secondary-container text-on-secondary-container" },
  archived: { label: "Archived", icon: Archive, classes: "bg-surface-container-highest text-on-surface-variant" },
};

const blockLabels: Record<BlockType, string> = { hero: "Hero Image", heading: "Botanical Heading", text: "Rich Text Narrative", products: "Curated Stems Grid", button: "Primary Action Pill", divider: "Soft Divider" };
const blockIcons: Record<BlockType, typeof ImageIcon> = { hero: ImageIcon, heading: Type, text: Mail, products: LayoutGrid, button: Send, divider: Minus };
const timeZones = ["BST (London)", "CET (Paris)", "EST (New York)", "PST (Los Angeles)"];

export function NewsletterContent({ data: initialData }: { data: NewsletterData }) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(initialData.subscribers);
  const [campaigns, setCampaigns] = useState<Campaign[]>(initialData.campaigns);
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState<CampaignDraft>(emptyCampaignDraft());
  const [activeSegment, setActiveSegment] = useState<SubscriberSegment>("all");
  const [search, setSearch] = useState("");
  const [campaignTab, setCampaignTab] = useState<CampaignStatus>("draft");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [scheduleTime, setScheduleTime] = useState("09:00");
  const [scheduleTz, setScheduleTz] = useState("BST (London)");
  const [testEmail, setTestEmail] = useState("test@bloomstem.com");
  const [busy, setBusy] = useState(false);
  const [validation, setValidation] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const filteredSubscribers = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = subscribers;
    if (activeSegment !== "all") list = list.filter((s) => s.segment === activeSegment);
    if (term) list = list.filter((s) => `${s.name} ${s.email} ${s.source}`.toLowerCase().includes(term));
    return list;
  }, [subscribers, activeSegment, search]);

  const filteredCampaigns = useMemo(() => campaigns.filter((c) => c.status === campaignTab), [campaigns, campaignTab]);
  const tabCounts = useMemo(() => ({ draft: campaigns.filter((c) => c.status === "draft").length, scheduled: campaigns.filter((c) => c.status === "scheduled").length, sent: campaigns.filter((c) => c.status === "sent").length, archived: campaigns.filter((c) => c.status === "archived").length }), [campaigns]);

  const openComposer = (base?: CampaignDraft) => { setDraft(base ?? emptyCampaignDraft()); setValidation([]); setComposing(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const closeComposer = () => { setComposing(false); setDraft(emptyCampaignDraft()); setValidation([]); };
  const updateDraft = (patch: Partial<CampaignDraft>) => setDraft((prev) => ({ ...prev, ...patch }));
  const addBlock = (type: BlockType) => setDraft((prev) => ({ ...prev, blocks: [...prev.blocks, { id: `block-${Date.now()}`, type, label: blockLabels[type] }] }));
  const moveBlock = (index: number, direction: -1 | 1) => { const target = index + direction; if (target < 0 || target >= draft.blocks.length) return; const blocks = [...draft.blocks]; [blocks[index], blocks[target]] = [blocks[target], blocks[index]]; setDraft((prev) => ({ ...prev, blocks })); };
  const removeBlock = (index: number) => { const blocks = draft.blocks.filter((_, i) => i !== index); setDraft((prev) => ({ ...prev, blocks })); };
  const clearFilters = () => { setSearch(""); setActiveSegment("all"); };

  const validate = () => {
    const errors: string[] = [];
    if (!draft.name.trim()) errors.push("Campaign name is required.");
    if (!draft.subject.trim()) errors.push("Subject line is required.");
    if (!draft.previewText.trim()) errors.push("Preview text is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.senderEmail)) errors.push("Sender email is invalid.");
    setValidation(errors);
    return errors.length === 0;
  };

  const saveDraft = async () => {
    if (!validate()) { toast.error("Please fix the highlighted fields before saving."); return; }
    setBusy(true);
    try {
      const saved = await saveCampaignDraft(draft);
      setCampaigns((prev) => { const idx = prev.findIndex((c) => c.id === saved.id); if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; } return [saved, ...prev]; });
      setDraft((prev) => ({ ...prev, id: saved.id }));
      toast.success("Draft saved.");
    } catch { toast.error("Could not save draft."); } finally { setBusy(false); }
  };

  const sendTest = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) { toast.error("Enter a valid test email address."); return; }
    setBusy(true);
    try { await sendTestCampaign(draft, testEmail); toast.success(`Test email sent to ${testEmail}.`); } catch { toast.error("Could not send test email. Check the address and try again."); } finally { setBusy(false); }
  };

  const openSchedule = () => { if (!validate()) { toast.error("Please fix the highlighted fields before scheduling."); return; } setScheduleOpen(true); };
  const handleSchedule = async () => {
    const date = `${scheduleDate} ${scheduleTime} ${scheduleTz}`;
    setBusy(true);
    try {
      const saved = await scheduleCampaign(draft, date);
      setCampaigns((prev) => { const idx = prev.findIndex((c) => c.id === saved.id); if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; } return [saved, ...prev]; });
      toast.success(`Campaign scheduled for ${date}.`);
      setScheduleOpen(false);
      closeComposer();
    } catch { toast.error("Could not schedule campaign."); } finally { setBusy(false); }
  };

  const openSendConfirm = () => { if (!validate()) { toast.error("Please fix the highlighted fields before sending."); return; } setConfirm({ type: "send" }); };
  const handleSend = async () => {
    setBusy(true);
    try {
      const saved = await sendCampaign(draft);
      setCampaigns((prev) => { const idx = prev.findIndex((c) => c.id === saved.id); if (idx >= 0) { const next = [...prev]; next[idx] = saved; return next; } return [saved, ...prev]; });
      toast.success(`Campaign sent to ${segmentCounts[saved.audience].toLocaleString()} recipients.`);
      setConfirm(null);
      closeComposer();
    } catch { toast.error("Could not send campaign."); setConfirm(null); } finally { setBusy(false); }
  };

  const handleArchive = async (id: string) => {
    setBusy(true);
    try {
      await archiveCampaign(id);
      setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: "archived", date: "Archived just now" } : c));
      toast.success("Campaign archived.");
      setConfirm(null);
    } catch { toast.error("Could not archive campaign."); } finally { setBusy(false); }
  };

  const handleDelete = async (id: string) => {
    setBusy(true);
    try {
      await deleteCampaign(id);
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      toast.success("Campaign deleted.");
      setConfirm(null);
    } catch { toast.error("Could not delete campaign."); } finally { setBusy(false); }
  };

  const editCampaign = (campaign: Campaign) => { openComposer(campaignToDraft(campaign)); };
  const duplicateCampaign = (campaign: Campaign) => { const { id: _, ...rest } = campaignToDraft(campaign); openComposer(rest); };

  const nameError = validation.length > 0 && !draft.name.trim();
  const subjectError = validation.length > 0 && !draft.subject.trim();
  const previewError = validation.length > 0 && !draft.previewText.trim();
  const senderError = validation.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.senderEmail);

  if (composing) {
    return (
      <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <button onClick={closeComposer} className="flex min-h-11 items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface"><ArrowLeft className="h-4 w-4" /> Back to Newsletter</button>
            <h1 className="mt-2 font-serif text-4xl text-on-surface">Campaign Composer</h1>
            <p className="text-on-surface-variant">Design, preview, and dispatch your botanical dispatch.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={saveDraft} disabled={busy} className="min-h-11 rounded-full px-5">Save Draft</Button>
            <Button variant="outline" onClick={sendTest} disabled={busy} className="min-h-11 rounded-full px-5">Send Test</Button>
            <Button variant="outline" onClick={openSchedule} disabled={busy} className="min-h-11 rounded-full px-5">Schedule</Button>
            <Button onClick={openSendConfirm} disabled={busy} className="min-h-11 rounded-full px-5"><Send className="h-4 w-4" /> Send Campaign</Button>
          </div>
        </header>
        {validation.length > 0 && <div role="alert" className="rounded-2xl bg-error-container p-4 text-error"><div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /><p className="font-serif text-xl">Please review the composer fields</p></div><ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{validation.map((e) => <li key={e}>{e}</li>)}</ul></div>}
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="space-y-6 rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
            <h2 className="font-serif text-2xl">Configuration</h2>
            <Field id="campaign-name" label="Campaign Name" error={nameError}><Input id="campaign-name" value={draft.name} onChange={(e) => updateDraft({ name: e.target.value })} placeholder="Spring Peony Preview" aria-invalid={nameError} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="campaign-audience" label="Audience"><Select value={draft.audience} onValueChange={(value) => value && updateDraft({ audience: value as CampaignDraft["audience"] })}><SelectTrigger id="campaign-audience" className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest">{Object.entries(segmentLabels).map(([key, label]) => <SelectItem key={key} value={key} className="text-sm text-on-surface">{label}</SelectItem>)}</SelectContent></Select><p className="mt-2 text-xs text-on-surface-variant"><span aria-live="polite" aria-atomic="true">{segmentCounts[draft.audience].toLocaleString()} estimated recipients</span></p></Field>
              <Field id="sender-name" label="Sender Name"><Input id="sender-name" value={draft.senderName} onChange={(e) => updateDraft({ senderName: e.target.value })} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            </div>
            <Field id="sender-email" label="Sender Email" error={senderError}><Input id="sender-email" type="email" value={draft.senderEmail} onChange={(e) => updateDraft({ senderEmail: e.target.value })} aria-invalid={senderError} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            <Field id="subject" label="Subject Line" error={subjectError}><Input id="subject" value={draft.subject} onChange={(e) => updateDraft({ subject: e.target.value })} placeholder="A private preview from Bloom & Stem" aria-invalid={subjectError} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            <Field id="preview" label="Preview Text" error={previewError}><Textarea id="preview" value={draft.previewText} onChange={(e) => updateDraft({ previewText: e.target.value })} placeholder="A concise line that follows the subject in the inbox." aria-invalid={previewError} className="rounded-xl bg-surface-container" /></Field>
            <Field id="test-email" label="Test Email"><Input id="test-email" type="email" value={testEmail} onChange={(e) => setTestEmail(e.target.value)} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            <div>
              <p className="mb-3 text-sm font-medium">Content Blocks</p>
              <div className="space-y-2">
                {draft.blocks.map((block, index) => {
                  const Icon = blockIcons[block.type];
                  return (
                    <div key={block.id} draggable onDragStart={() => setDragIndex(index)} onDragOver={(e) => { e.preventDefault(); setDropIndex(index); }} onDrop={() => { if (dragIndex !== null && dropIndex !== null) { const blocks = [...draft.blocks]; const [moved] = blocks.splice(dragIndex, 1); blocks.splice(dropIndex, 0, moved); setDraft((prev) => ({ ...prev, blocks })); } setDragIndex(null); setDropIndex(null); }} onDragEnd={() => { setDragIndex(null); setDropIndex(null); }} className={cn("flex min-h-11 items-center gap-2 rounded-xl border border-outline-variant/30 bg-surface-container px-3", dragIndex === index && "opacity-60")}>
                      <GripVertical className="h-4 w-4 text-on-surface-variant" />
                      <Icon className="h-4 w-4 text-secondary" />
                      <span className="flex-1 text-sm">{block.label}</span>
                      <button aria-label={`Move ${block.label} up`} disabled={index === 0} onClick={() => moveBlock(index, -1)} className="grid h-9 w-9 place-items-center rounded-full disabled:opacity-40"><ArrowUp className="h-4 w-4" /></button>
                      <button aria-label={`Move ${block.label} down`} disabled={index === draft.blocks.length - 1} onClick={() => moveBlock(index, 1)} className="grid h-9 w-9 place-items-center rounded-full disabled:opacity-40"><ArrowDown className="h-4 w-4" /></button>
                      <button aria-label={`Remove ${block.label}`} onClick={() => removeBlock(index)} className="grid h-9 w-9 place-items-center rounded-full text-error"><X className="h-4 w-4" /></button>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(Object.keys(blockLabels) as BlockType[]).map((type) => <button key={type} onClick={() => addBlock(type)} className="flex min-h-10 items-center gap-2 rounded-full bg-surface-container px-3 text-sm text-on-surface hover:bg-surface-container-high"><Plus className="h-4 w-4" />{blockLabels[type]}</button>)}
              </div>
            </div>
          </section>
          <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-serif text-2xl">Live Preview</h2>
              <div className="flex rounded-full bg-surface-container p-1">
                <button onClick={() => setPreviewMode("desktop")} className={cn("flex min-h-10 items-center gap-2 rounded-full px-4 text-sm", previewMode === "desktop" && "bg-white shadow-sm")}><Monitor className="h-4 w-4" /> Desktop</button>
                <button onClick={() => setPreviewMode("mobile")} className={cn("flex min-h-10 items-center gap-2 rounded-full px-4 text-sm", previewMode === "mobile" && "bg-white shadow-sm")}><Smartphone className="h-4 w-4" /> Mobile</button>
              </div>
            </div>
            <EmailPreview draft={draft} mode={previewMode} />
          </section>
        </div>
        <div className="sticky bottom-4 z-20 flex flex-col gap-3 rounded-2xl bg-surface-container-high p-4 shadow-lg sm:flex-row sm:items-center">
          <div className="flex-1"><p className="font-medium">{draft.id ? "Editing existing draft" : "New campaign draft"}</p><p className="text-xs text-on-surface-variant"><span aria-live="polite">{segmentCounts[draft.audience].toLocaleString()} estimated recipients</span> · {draft.blocks.length} content blocks</p></div>
          <Button variant="ghost" onClick={closeComposer} disabled={busy}>Cancel</Button>
          <Button variant="outline" onClick={saveDraft} disabled={busy}>Save Draft</Button>
          <Button variant="outline" onClick={openSchedule} disabled={busy}>Schedule</Button>
          <Button onClick={openSendConfirm} disabled={busy}><Send className="h-4 w-4" /> Send Campaign</Button>
        </div>
        <ScheduleDialog open={scheduleOpen} onOpenChange={setScheduleOpen} date={scheduleDate} setDate={setScheduleDate} time={scheduleTime} setTime={setScheduleTime} tz={scheduleTz} setTz={setScheduleTz} onConfirm={handleSchedule} busy={busy} />
        <ConfirmDialog action={confirm} onOpenChange={(open) => !open && setConfirm(null)} draft={draft} busy={busy} onSend={handleSend} onArchive={() => confirm?.type === "archive" && handleArchive(confirm.id)} onDelete={() => confirm?.type === "delete" && handleDelete(confirm.id)} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Marketing</p>
          <h1 className="font-serif text-4xl text-on-surface">Newsletter & Campaigns</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Grow your audience, design botanical dispatches, and track campaign performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setToolsOpen(true)} className="min-h-11 rounded-full px-5 lg:hidden"><Filter className="h-4 w-4" /> Subscriber Tools</Button>
          <Button onClick={() => openComposer()} className="min-h-11 rounded-full px-5"><Plus className="h-4 w-4" /> Create Campaign</Button>
        </div>
      </header>
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-secondary-container text-secondary"><metric.icon className="h-5 w-5" /></span>
              <div>
                <p className="text-xs text-on-surface-variant">{metric.label}</p>
                <p className="font-serif text-2xl">{metric.value}</p>
              </div>
            </div>
            <p className="mt-3 text-xs text-secondary">{metric.change}</p>
          </div>
        ))}
      </section>
      <section className="space-y-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <h2 className="font-serif text-2xl">Subscribers</h2>
          <div className="hidden items-center gap-3 lg:flex">
            <label className="relative flex-1">
              <span className="sr-only">Search subscribers</span>
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, source..." className="min-h-11 rounded-full border-0 bg-surface-container pl-11" />
            </label>
            <Button variant="outline" onClick={() => downloadCSV(filteredSubscribers)} className="min-h-11 rounded-full px-5"><Download className="h-4 w-4" /> Export CSV</Button>
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Subscriber segments">
          {(Object.keys(segmentLabels) as SubscriberSegment[]).map((segment) => (
            <button key={segment} role="tab" aria-selected={activeSegment === segment} onClick={() => setActiveSegment(segment)} className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors", activeSegment === segment ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}>
              {segmentLabels[segment]}<span className={cn("rounded-full px-2 py-0.5 text-xs", activeSegment === segment ? "bg-on-primary/20 text-on-primary" : "bg-surface-container-high text-on-surface-variant")}>{segmentCounts[segment].toLocaleString()}</span>
            </button>
          ))}
        </div>
        {subscribers.length === 0 ? <SubscribersEmpty onCreate={() => openComposer()} /> :
        filteredSubscribers.length === 0 ? <SubscribersNoResults onClear={clearFilters} /> :
        <>
          <div className="hidden overflow-hidden rounded-2xl bg-surface-container md:block">
            <Table>
              <TableHeader className="bg-surface-container/30 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70"><TableRow><TableHead className="p-4">Subscriber</TableHead><TableHead className="p-4">Segment</TableHead><TableHead className="p-4">Consent</TableHead><TableHead className="p-4">Source</TableHead><TableHead className="p-4">Joined</TableHead><TableHead className="p-4">Status</TableHead></TableRow></TableHeader>
              <TableBody>{filteredSubscribers.map((subscriber) => <SubscriberRow key={subscriber.id} subscriber={subscriber} />)}</TableBody>
            </Table>
          </div>
          <div className="grid gap-3 md:hidden">{filteredSubscribers.map((subscriber) => <SubscriberCard key={subscriber.id} subscriber={subscriber} />)}</div>
        </>}
      </section>
      <section className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <h2 className="font-serif text-2xl">Campaigns</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Campaign status">
          {(["draft", "scheduled", "sent", "archived"] as CampaignStatus[]).map((status) => (
            <button key={status} role="tab" aria-selected={campaignTab === status} onClick={() => setCampaignTab(status)} className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors", campaignTab === status ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}>
              {statusConfig[status].label}<span className={cn("rounded-full px-2 py-0.5 text-xs", campaignTab === status ? "bg-on-primary/20 text-on-primary" : "bg-surface-container-high text-on-surface-variant")}>{tabCounts[status]}</span>
            </button>
          ))}
        </div>
        {filteredCampaigns.length === 0 ? <div className="mt-4"><CampaignsEmpty onCreate={() => openComposer()} /></div> :
        <>
          <div className="mt-4 hidden overflow-hidden rounded-2xl bg-surface-container md:block">
            <Table>
              <TableHeader className="bg-surface-container/30 text-xs font-medium uppercase tracking-widest text-on-surface-variant/70"><TableRow><TableHead className="p-4">Campaign</TableHead><TableHead className="p-4">Audience</TableHead><TableHead className="p-4">Status</TableHead><TableHead className="p-4">Date</TableHead><TableHead className="p-4 text-right">Delivered</TableHead><TableHead className="p-4 text-right">Open</TableHead><TableHead className="p-4 text-right">Click</TableHead><TableHead className="p-4 text-right">Conv.</TableHead><TableHead className="p-4 text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{filteredCampaigns.map((campaign) => <CampaignRow key={campaign.id} campaign={campaign} onEdit={editCampaign} onDuplicate={duplicateCampaign} onArchive={() => setConfirm({ type: "archive", id: campaign.id })} onDelete={() => setConfirm({ type: "delete", id: campaign.id })} busy={busy} />)}</TableBody>
            </Table>
          </div>
          <div className="mt-4 grid gap-3 md:hidden">{filteredCampaigns.map((campaign) => <CampaignCard key={campaign.id} campaign={campaign} onEdit={editCampaign} onDuplicate={duplicateCampaign} onArchive={() => setConfirm({ type: "archive", id: campaign.id })} onDelete={() => setConfirm({ type: "delete", id: campaign.id })} busy={busy} />)}</div>
        </>}
      </section>
      <SubscriberToolsSheet open={toolsOpen} onOpenChange={setToolsOpen} search={search} setSearch={setSearch} activeSegment={activeSegment} setActiveSegment={setActiveSegment} onExport={() => downloadCSV(filteredSubscribers)} />
      <ConfirmDialog action={confirm} onOpenChange={(open) => !open && setConfirm(null)} draft={draft} busy={busy} onSend={handleSend} onArchive={() => confirm?.type === "archive" && handleArchive(confirm.id)} onDelete={() => confirm?.type === "delete" && handleDelete(confirm.id)} />
    </div>
  );
}

function downloadCSV(items: Subscriber[]) {
  const csv = exportSubscribersCSV(items);
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Subscriber list exported.");
}

function SegmentBadge({ segment }: { segment: SubscriberSegment | Exclude<SubscriberSegment, "all"> }) {
  const labels = segmentLabels;
  const active = segment === "all" ? "All" : labels[segment];
  const colors: Record<string, string> = { all: "bg-surface-container text-on-surface-variant", vip: "bg-primary-container text-on-primary-container", seasonal: "bg-secondary-container text-on-secondary-container", new: "bg-tertiary-container text-on-tertiary-container", lapsed: "bg-error-container text-error" };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", colors[segment])}><span className="h-1.5 w-1.5 rounded-full bg-current" />{active}</span>;
}

function CampaignStatusBadge({ status }: { status: CampaignStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.classes)}><span className="h-1.5 w-1.5 rounded-full bg-current" /><Icon className="h-3.5 w-3.5" />{config.label}</span>;
}

function SubscriberRow({ subscriber }: { subscriber: Subscriber }) {
  return (
    <TableRow className="border-b border-outline-variant/40">
      <TableCell className="p-4"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full bg-secondary-container font-medium text-on-secondary-container">{subscriber.initials}</div><div><p className="font-serif font-medium">{subscriber.name}</p><p className="text-xs text-on-surface-variant">{subscriber.email}</p></div></div></TableCell>
      <TableCell className="p-4"><SegmentBadge segment={subscriber.segment} /></TableCell>
      <TableCell className="p-4 text-sm text-on-surface-variant">{subscriber.consent}</TableCell>
      <TableCell className="p-4 text-sm text-on-surface-variant">{subscriber.source}</TableCell>
      <TableCell className="p-4 text-sm text-on-surface-variant">{subscriber.joined}</TableCell>
      <TableCell className="p-4"><div className="flex items-center gap-1.5 text-sm"><CheckCircle className="h-4 w-4 text-secondary" />{subscriber.status}</div></TableCell>
    </TableRow>
  );
}

function SubscriberCard({ subscriber }: { subscriber: Subscriber }) {
  return (
    <article className="rounded-2xl bg-surface-container p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-secondary-container font-medium text-on-secondary-container">{subscriber.initials}</div>
        <div className="min-w-0 flex-1"><p className="font-serif text-lg font-medium">{subscriber.name}</p><p className="truncate text-xs text-on-surface-variant">{subscriber.email}</p></div>
        <SegmentBadge segment={subscriber.segment} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs text-on-surface-variant">Source</p><p>{subscriber.source}</p></div>
        <div><p className="text-xs text-on-surface-variant">Joined</p><p>{subscriber.joined}</p></div>
        <div><p className="text-xs text-on-surface-variant">Consent</p><p>{subscriber.consent}</p></div>
        <div><p className="text-xs text-on-surface-variant">Status</p><p className="flex items-center gap-1"><CheckCircle className="h-3.5 w-3.5 text-secondary" />{subscriber.status}</p></div>
      </div>
    </article>
  );
}

function CampaignRow({ campaign, onEdit, onDuplicate, onArchive, onDelete, busy }: { campaign: Campaign; onEdit: (c: Campaign) => void; onDuplicate: (c: Campaign) => void; onArchive: () => void; onDelete: () => void; busy: boolean }) {
  return (
    <TableRow className="border-b border-outline-variant/40">
      <TableCell className="p-4"><div><p className="font-serif font-medium">{campaign.name}</p><p className="text-xs text-on-surface-variant">{campaign.subject}</p></div></TableCell>
      <TableCell className="p-4"><SegmentBadge segment={campaign.audience} /></TableCell>
      <TableCell className="p-4"><CampaignStatusBadge status={campaign.status} /></TableCell>
      <TableCell className="p-4 text-sm text-on-surface-variant">{campaign.date}</TableCell>
      <TableCell className="p-4 text-right text-sm">{campaign.delivered?.toLocaleString() ?? "—"}</TableCell>
      <TableCell className="p-4 text-right text-sm">{campaign.openRate != null ? `${campaign.openRate}%` : "—"}</TableCell>
      <TableCell className="p-4 text-right text-sm">{campaign.clickRate != null ? `${campaign.clickRate}%` : "—"}</TableCell>
      <TableCell className="p-4 text-right text-sm">{campaign.conversions != null ? `${campaign.conversions}%` : "—"}</TableCell>
      <TableCell className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          {campaign.status === "draft" || campaign.status === "scheduled" ? <button aria-label={`Edit ${campaign.name}`} disabled={busy} onClick={() => onEdit(campaign)} className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"><Pencil className="h-4 w-4" /></button> : <button aria-label={`Duplicate ${campaign.name}`} disabled={busy} onClick={() => onDuplicate(campaign)} className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"><Plus className="h-4 w-4" /></button>}
          {campaign.status === "sent" && <button aria-label={`Archive ${campaign.name}`} disabled={busy} onClick={onArchive} className="grid h-9 w-9 place-items-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-40"><Archive className="h-4 w-4" /></button>}
          {(campaign.status === "draft" || campaign.status === "scheduled") && <button aria-label={`Delete ${campaign.name}`} disabled={busy} onClick={onDelete} className="grid h-9 w-9 place-items-center rounded-full text-error hover:bg-error-container disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>}
        </div>
      </TableCell>
    </TableRow>
  );
}

function CampaignCard({ campaign, onEdit, onDuplicate, onArchive, onDelete, busy }: { campaign: Campaign; onEdit: (c: Campaign) => void; onDuplicate: (c: Campaign) => void; onArchive: () => void; onDelete: () => void; busy: boolean }) {
  return (
    <article className="rounded-2xl bg-surface-container p-4">
      <div className="flex items-start justify-between gap-3">
        <div><p className="font-serif text-lg font-medium">{campaign.name}</p><p className="text-xs text-on-surface-variant">{campaign.subject}</p></div>
        <CampaignStatusBadge status={campaign.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs text-on-surface-variant">Audience</p><SegmentBadge segment={campaign.audience} /></div>
        <div><p className="text-xs text-on-surface-variant">Date</p><p>{campaign.date}</p></div>
        <div><p className="text-xs text-on-surface-variant">Open Rate</p><p>{campaign.openRate != null ? `${campaign.openRate}%` : "—"}</p></div>
        <div><p className="text-xs text-on-surface-variant">Revenue</p><p>{campaign.revenue != null ? money.format(campaign.revenue) : "—"}</p></div>
      </div>
      <div className="mt-4 flex gap-2">
        {campaign.status === "draft" || campaign.status === "scheduled" ? <Button variant="outline" size="sm" onClick={() => onEdit(campaign)} disabled={busy} className="min-h-11 rounded-full">Edit</Button> : <Button variant="outline" size="sm" onClick={() => onDuplicate(campaign)} disabled={busy} className="min-h-11 rounded-full">Duplicate</Button>}
        {campaign.status === "sent" && <Button variant="outline" size="sm" onClick={onArchive} disabled={busy} className="min-h-11 rounded-full">Archive</Button>}
        {(campaign.status === "draft" || campaign.status === "scheduled") && <Button variant="destructive" size="sm" onClick={onDelete} disabled={busy} className="min-h-11 rounded-full">Delete</Button>}
      </div>
    </article>
  );
}

function EmailPreview({ draft, mode }: { draft: CampaignDraft; mode: PreviewMode }) {
  const products = mockProducts.slice(0, 3);
  return (
    <div className={cn("mx-auto overflow-hidden rounded-xl border border-outline-variant/30 bg-white shadow-sm transition-all", mode === "desktop" ? "max-w-none" : "max-w-sm")}>
      <div className="border-b border-outline-variant/30 bg-surface-container-lowest p-4 text-xs text-on-surface-variant"><p className="font-medium text-on-surface">From:</p><p>{draft.senderName} &lt;{draft.senderEmail}&gt;</p><p className="mt-1 font-medium text-on-surface">Subject:</p><p>{draft.subject || "(no subject)"}</p><p className="mt-1 font-medium text-on-surface">Preview:</p><p>{draft.previewText || "(no preview text)"}</p></div>
      <div className="space-y-4 p-5 text-center">
        {draft.blocks.map((block) => {
          if (block.type === "hero") return <div key={block.id} aria-hidden className="h-40 w-full rounded-xl bg-cover bg-center" style={{ backgroundImage: `url(https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?w=800&h=400&fit=crop)` }} />;
          if (block.type === "heading") return <h3 key={block.id} className="font-serif text-2xl text-on-surface">{draft.name || "Your seasonal preview"}</h3>;
          if (block.type === "text") return <p key={block.id} className="mx-auto max-w-md text-sm leading-relaxed text-on-surface-variant">Hand-tied arrangements from Bloom & Stem arrive fresh from the atelier, chosen for the season and delivered with care.</p>;
          if (block.type === "products") return <div key={block.id} className="grid grid-cols-3 gap-2">{products.map((product) => <div key={product.id} className="text-left"><div className="aspect-square rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${product.imageUrl})` }} /><p className="mt-1 truncate text-xs font-medium">{product.name}</p><p className="text-xs text-on-surface-variant">${product.price}</p></div>)}</div>;
          if (block.type === "button") return <a key={block.id} href="#" className="inline-flex min-h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-on-primary">Shop the Edit</a>;
          if (block.type === "divider") return <hr key={block.id} className="border-outline-variant/30" />;
          return null;
        })}
        <p className="text-xs text-on-surface-variant">Bloom & Stem Atelier · 12 Chelsea Embankment, London</p>
      </div>
    </div>
  );
}

function ScheduleDialog({ open, onOpenChange, date, setDate, time, setTime, tz, setTz, onConfirm, busy }: { open: boolean; onOpenChange: (v: boolean) => void; date: string; setDate: (v: string) => void; time: string; setTime: (v: string) => void; tz: string; setTz: (v: string) => void; onConfirm: () => void; busy: boolean }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ width: "min(28rem, calc(100vw - 2rem))", maxWidth: "none", backgroundColor: "#fff" }} className="rounded-2xl p-6">
        <DialogHeader><span className="grid h-12 w-12 place-items-center rounded-full bg-primary-fixed text-primary"><Clock className="h-5 w-5" /></span><DialogTitle className="font-serif text-2xl">Schedule Campaign</DialogTitle><DialogDescription>Choose when your dispatch should reach each inbox.</DialogDescription></DialogHeader>
        <div className="space-y-4">
          <Field id="schedule-date" label="Date"><Input id="schedule-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="min-h-11 rounded-xl bg-surface-container" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field id="schedule-time" label="Time"><Input id="schedule-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="min-h-11 rounded-xl bg-surface-container" /></Field>
            <Field id="schedule-tz" label="Time Zone"><Select value={tz} onValueChange={(v) => v && setTz(v)}><SelectTrigger id="schedule-tz" className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest">{timeZones.map((zone) => <SelectItem key={zone} value={zone} className="text-sm text-on-surface">{zone}</SelectItem>)}</SelectContent></Select></Field>
          </div>
        </div>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button onClick={onConfirm} disabled={busy}><Clock className="h-4 w-4" /> Confirm Schedule</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({ action, onOpenChange, draft, busy, onSend, onArchive, onDelete }: { action: ConfirmAction | null; onOpenChange: (open: boolean) => void; draft: CampaignDraft; busy: boolean; onSend: () => void; onArchive: () => void; onDelete: () => void }) {
  const open = action !== null;
  if (!action) return null;
  const title = action.type === "send" ? "Send this campaign now?" : action.type === "archive" ? "Archive campaign?" : "Delete campaign?";
  const description = action.type === "send" ? `This will send to ${segmentCounts[draft.audience].toLocaleString()} recipients. Scheduled sends cannot be recalled once dispatched.` : action.type === "archive" ? "The campaign will be moved to your archived list and can be duplicated later." : "This campaign will be permanently removed. This action cannot be undone.";
  const Icon = action.type === "send" ? Send : action.type === "archive" ? Archive : Trash2;
  const buttonText = action.type === "send" ? "Send Campaign" : action.type === "archive" ? "Archive Campaign" : "Delete Campaign";
  const onConfirm = action.type === "send" ? onSend : action.type === "archive" ? onArchive : onDelete;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ width: "min(30rem, calc(100vw - 2rem))", maxWidth: "none", backgroundColor: "#fff" }} className="rounded-2xl p-6">
        <DialogHeader><span className={cn("grid h-12 w-12 place-items-center rounded-full", action.type === "delete" ? "bg-error-container text-error" : "bg-primary-fixed text-primary")}><Icon className="h-5 w-5" /></span><DialogTitle className="font-serif text-2xl">{title}</DialogTitle><DialogDescription>{description}</DialogDescription></DialogHeader>
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button variant={action.type === "delete" ? "destructive" : "default"} onClick={onConfirm} disabled={busy}>{buttonText}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SubscriberToolsSheet({ open, onOpenChange, search, setSearch, activeSegment, setActiveSegment, onExport }: { open: boolean; onOpenChange: (v: boolean) => void; search: string; setSearch: (v: string) => void; activeSegment: SubscriberSegment; setActiveSegment: (v: SubscriberSegment) => void; onExport: () => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85svh] rounded-t-2xl p-6">
        <SheetHeader><SheetTitle className="font-serif text-2xl">Subscriber Tools</SheetTitle><SheetDescription>Search and filter your audience, then export the matching list.</SheetDescription></SheetHeader>
        <div className="mt-4 space-y-4">
          <label className="relative block">
            <span className="sr-only">Search subscribers</span>
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, source..." className="min-h-11 rounded-full border-0 bg-surface-container pl-11" />
          </label>
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Subscriber segments">
            {(Object.keys(segmentLabels) as SubscriberSegment[]).map((segment) => (
              <button key={segment} role="tab" aria-selected={activeSegment === segment} onClick={() => setActiveSegment(segment)} className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors", activeSegment === segment ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}>
                {segmentLabels[segment]}
              </button>
            ))}
          </div>
        </div>
        <SheetFooter className="mt-4"><Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button><Button variant="outline" onClick={onExport}><Download className="h-4 w-4" /> Export CSV</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Field({ id, label, error, children }: { id: string; label: string; error?: boolean; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={id} className={cn(error && "text-error")}>{label}</Label>{children}</div>;
}
