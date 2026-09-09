"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle, CheckSquare, Clock, EyeOff, Flag, Filter as FilterIcon, MessageSquare as MessageSquareIcon, Search, Send, ShieldCheck, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/ui/rating-stars";
import { cn } from "@/lib/utils";
import { mockProducts } from "@/lib/mock-data";
import { approveReview, computeDistribution, computeMetrics, flagReview, hideReview, publishReply, Review, ReviewStatus } from "@/lib/admin-reviews";
import { ReviewsEmpty, ReviewsNoResults } from "./states";

type ConfirmAction = { type: "hide" | "flag"; ids: string[] } | null;
type DateFilter = "all" | "7d" | "30d" | "90d";

const statusConfig: Record<ReviewStatus, { label: string; icon: React.ComponentType<{ className?: string }>; classes: string }> = {
  pending: { label: "Pending", icon: Clock, classes: "bg-tertiary-container text-on-tertiary-container" },
  published: { label: "Published", icon: CheckCircle, classes: "bg-secondary-container text-on-secondary-container" },
  hidden: { label: "Hidden", icon: EyeOff, classes: "bg-surface-container-highest text-on-surface-variant" },
  flagged: { label: "Flagged", icon: Flag, classes: "bg-error-container text-error" },
};

const moderationReasons = ["Inappropriate content", "Spam", "Off-topic", "Privacy concern", "Competitor content", "Other"];
const dateLabels: Record<DateFilter, string> = { all: "All time", "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days" };

export function ReviewsContent({ reviews: initialReviews }: { reviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [tab, setTab] = useState<ReviewStatus>("pending");
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [replyReview, setReplyReview] = useState<Review | null>(null);
  const [replyDraft, setReplyDraft] = useState("");
  const [replyError, setReplyError] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmAction>(null);
  const [confirmReason, setConfirmReason] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [now] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);

  const metrics = useMemo(() => computeMetrics(reviews), [reviews]);
  const distribution = useMemo(() => computeDistribution(reviews), [reviews]);
  const productOptions = useMemo(() => [{ id: "all", name: "All products" }, ...Array.from(new Map(mockProducts.map((p) => [p.id, p])).values()).slice(0, 20)], []);

  const filteredReviews = useMemo(() => {
    let list = reviews.filter((r) => r.status === tab);
    const term = search.trim().toLowerCase();
    if (term) list = list.filter((r) => `${r.customer} ${r.title} ${r.body} ${r.productName}`.toLowerCase().includes(term));
    if (ratingFilter !== "all") list = list.filter((r) => r.rating === ratingFilter);
    if (productFilter !== "all") list = list.filter((r) => r.productId === productFilter);
    if (dateFilter !== "all") { const days = { "7d": 7, "30d": 30, "90d": 90 }[dateFilter] ?? 0; const cutoff = now - days * 86400000; list = list.filter((r) => new Date(r.submittedAt).getTime() >= cutoff); }
    return list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [reviews, tab, search, ratingFilter, productFilter, dateFilter, now]);

  const tabCounts = useMemo(() => ({ pending: reviews.filter((r) => r.status === "pending").length, published: reviews.filter((r) => r.status === "published").length, hidden: reviews.filter((r) => r.status === "hidden").length, flagged: reviews.filter((r) => r.status === "flagged").length }), [reviews]);

  const clearFilters = () => { setSearch(""); setRatingFilter("all"); setProductFilter("all"); setDateFilter("all"); };
  const toggleSelect = (id: string) => { setSelected((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; }); };
  const clearSelection = () => setSelected(new Set());

  const updateReview = (id: string, patch: Partial<Review>) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, ...patch } : r));

  const handleApprove = async (ids: string[]) => {
    setBusy(true);
    try { for (const id of ids) { await approveReview(id); updateReview(id, { status: "published", moderationReason: undefined }); } toast.success(`${ids.length} review${ids.length > 1 ? "s" : ""} approved and published.`); clearSelection(); } catch { toast.error("Could not approve reviews."); } finally { setBusy(false); }
  };

  const openConfirm = (type: "hide" | "flag", ids: string[]) => { setConfirm({ type, ids }); setConfirmReason(""); setConfirmError(false); };
  const handleConfirm = async () => {
    if (!confirm) return;
    if (!confirmReason) { setConfirmError(true); return; }
    setBusy(true);
    try {
      for (const id of confirm.ids) { if (confirm.type === "hide") { await hideReview(id, confirmReason); updateReview(id, { status: "hidden", moderationReason: confirmReason }); } else { await flagReview(id, confirmReason); updateReview(id, { status: "flagged", moderationReason: confirmReason }); } }
      toast.success(`${confirm.ids.length} review${confirm.ids.length > 1 ? "s" : ""} ${confirm.type === "hide" ? "hidden" : "flagged"}.`);
      setConfirm(null);
      clearSelection();
    } catch { toast.error(`Could not ${confirm?.type} reviews.`); } finally { setBusy(false); }
  };

  const openReply = (review: Review) => { setReplyReview(review); setReplyDraft(review.staffReply?.text ?? ""); setReplyError(false); };
  const saveReplyDraft = () => { toast.info("Reply draft saved locally."); };
  const handlePublishReply = async () => {
    if (!replyReview || !replyDraft.trim()) { setReplyError(true); return; }
    setBusy(true);
    try { const updated = await publishReply(replyReview.id, replyDraft.trim()); updateReview(replyReview.id, { staffReply: updated.staffReply }); toast.success("Reply published."); setReplyReview(null); } catch { toast.error("Could not publish reply."); } finally { setBusy(false); }
  };

  return (
    <div className="mx-auto max-w-[1440px] space-y-6 px-5 py-6 lg:px-16 lg:py-10">
      <header className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Customer Voice</p>
          <h1 className="font-serif text-4xl text-on-surface">Review Moderation</h1>
          <p className="mt-1 text-sm text-on-surface-variant">Curate, respond to, and publish patron feedback.</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Review invitation link copied.")} className="min-h-11 rounded-full px-5"><Send className="h-4 w-4" /> Invite Reviews</Button>
      </header>
      <MetricsOverview metrics={metrics} distribution={distribution} />
      <section className="space-y-4 rounded-2xl bg-surface-container-lowest p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Review status">
            {(["pending", "published", "hidden", "flagged"] as ReviewStatus[]).map((status) => {
              const config = statusConfig[status];
              const Icon = config.icon;
              return <button key={status} role="tab" aria-selected={tab === status} onClick={() => setTab(status)} className={cn("flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors", tab === status ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high")}><Icon className="h-4 w-4" />{config.label}<span className={cn("rounded-full px-2 py-0.5 text-xs", tab === status ? "bg-on-primary/20 text-on-primary" : "bg-surface-container-high text-on-surface-variant")}>{tabCounts[status]}</span></button>;
            })}
          </div>
          <div className="hidden items-center gap-3 lg:flex">
            <label className="relative flex-1"><span className="sr-only">Search reviews</span><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews, products, customers..." className="min-h-11 rounded-full border-0 bg-surface-container pl-11" /></label>
            <Select value={String(ratingFilter)} onValueChange={(v) => v && setRatingFilter(v === "all" ? "all" : Number(v))}><SelectTrigger className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue placeholder="Rating" /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest"><SelectItem value="all">All ratings</SelectItem>{[5, 4, 3, 2, 1].map((r) => <SelectItem key={r} value={String(r)}>{r} stars</SelectItem>)}</SelectContent></Select>
            <Select value={productFilter} onValueChange={(v) => v && setProductFilter(v)}><SelectTrigger className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue placeholder="Product" /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest">{productOptions.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select>
            <Select value={dateFilter} onValueChange={(v) => v && setDateFilter(v as DateFilter)}><SelectTrigger className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue placeholder="Date" /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest">{(Object.keys(dateLabels) as DateFilter[]).map((k) => <SelectItem key={k} value={k}>{dateLabels[k]}</SelectItem>)}</SelectContent></Select>
          </div>
          <Button variant="outline" onClick={() => setFiltersOpen(true)} className="min-h-11 rounded-full px-5 lg:hidden"><FilterIcon className="h-4 w-4" /> Filters</Button>
        </div>
        {reviews.length === 0 && tab === "pending" ? <ReviewsEmpty onCreate={() => toast.success("Review invitation link copied.")} /> :
        filteredReviews.length === 0 ? <ReviewsNoResults onClear={clearFilters} /> :
        <>
          {selected.size > 0 && <BulkBar selected={selected.size} onApprove={() => handleApprove(Array.from(selected))} onHide={() => openConfirm("hide", Array.from(selected))} onFlag={() => openConfirm("flag", Array.from(selected))} onClear={clearSelection} busy={busy} />}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filteredReviews.map((review) => <ReviewCard key={review.id} review={review} selected={selected.has(review.id)} onToggle={() => toggleSelect(review.id)} onApprove={() => handleApprove([review.id])} onHide={() => openConfirm("hide", [review.id])} onFlag={() => openConfirm("flag", [review.id])} onReply={() => openReply(review)} busy={busy} />)}</div>
        </>}
      </section>
      <ReplyDialog open={!!replyReview} onOpenChange={(open) => !open && setReplyReview(null)} review={replyReview} draft={replyDraft} setDraft={setReplyDraft} error={replyError} setError={setReplyError} onSaveDraft={saveReplyDraft} onPublish={handlePublishReply} busy={busy} />
      <ConfirmDialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)} action={confirm} reason={confirmReason} setReason={setConfirmReason} error={confirmError} setError={setConfirmError} onConfirm={handleConfirm} busy={busy} />
      <FilterSheet open={filtersOpen} onOpenChange={setFiltersOpen} search={search} setSearch={setSearch} rating={ratingFilter} setRating={setRatingFilter} product={productFilter} setProduct={setProductFilter} date={dateFilter} setDate={setDateFilter} productOptions={productOptions} />
    </div>
  );
}

function MetricsOverview({ metrics, distribution }: { metrics: { averageRating: number; totalReviews: number; awaitingReview: number; responseRate: number }; distribution: { star: number; count: number; percentage: number }[] }) {
  const percent = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 0 });
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Average Rating" value={metrics.averageRating.toFixed(1)} change={`from ${metrics.totalReviews} reviews`} icon={Star} />
        <MetricCard label="Total Reviews" value={metrics.totalReviews.toLocaleString()} change="All time" icon={MessageSquareIcon} />
        <MetricCard label="Awaiting Review" value={metrics.awaitingReview.toLocaleString()} change="Pending approval" icon={Clock} />
        <MetricCard label="Response Rate" value={percent.format(metrics.responseRate)} change="Staff replies" icon={Send} />
      </div>
      <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
        <h2 className="font-serif text-xl">Rating Distribution</h2>
        <div className="mt-4 space-y-3">
          {distribution.map(({ star, count, percentage }) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="flex w-12 items-center gap-1 font-medium"><Star className="h-3.5 w-3.5 fill-primary text-primary" />{star}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container"><div className="h-full rounded-full bg-primary transition-all motion-reduce:transition-none" style={{ width: `${percentage}%` }} /></div>
              <span className="w-10 text-right text-on-surface-variant">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, icon: Icon }: { label: string; value: string; change: string; icon: React.ComponentType<{ className?: string }> }) { return <div className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm"><div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-full bg-secondary-container text-secondary"><Icon className="h-5 w-5" /></span><div><p className="text-xs text-on-surface-variant">{label}</p><p className="font-serif text-2xl">{value}</p></div></div><p className="mt-3 text-xs text-secondary">{change}</p></div>; }

function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", config.classes)}><span className="h-1.5 w-1.5 rounded-full bg-current" /><Icon className="h-3.5 w-3.5" />{config.label}</span>;
}

function ReviewCard({ review, selected, onToggle, onApprove, onHide, onFlag, onReply, busy }: { review: Review; selected: boolean; onToggle: () => void; onApprove: () => void; onHide: () => void; onFlag: () => void; onReply: () => void; busy: boolean }) {
  const date = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(review.submittedAt));
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-secondary-container font-medium text-on-secondary-container">{review.initials}</div>
          <div><p className="font-serif font-medium">{review.customer}</p><p className="text-xs text-on-surface-variant">{review.email}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <ReviewStatusBadge status={review.status} />
          <button aria-label={selected ? "Deselect review" : "Select review"} onClick={onToggle} className={cn("grid h-8 w-8 place-items-center rounded-md border bg-white", selected && "bg-secondary text-on-secondary")}>{selected && <CheckSquare className="h-4 w-4" />}</button>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2"><RatingStars value={review.rating} /><span className="text-sm font-medium text-on-surface">{review.title}</span></div>
      <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">{review.body}</p>
      {review.photos.length > 0 && <div className="mt-3 flex gap-2">{review.photos.map((photo, index) => <div key={index} className="h-16 w-16 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${photo})` }} />)}</div>}
      <div className="mt-4 flex items-center gap-3 rounded-xl bg-surface-container p-3">
        <div className="h-12 w-12 shrink-0 rounded-lg bg-cover bg-center" style={{ backgroundImage: `url(${review.productImage})` }} />
        <div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{review.productName}</p><p className="text-xs text-on-surface-variant">{review.orderRef}{review.verified && <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-secondary-container px-2 py-0.5 text-xs text-on-secondary-container"><ShieldCheck className="h-3 w-3" /> Verified</span>}</p></div>
      </div>
      {review.staffReply && <div className="mt-4 rounded-xl bg-secondary-container/30 p-3 text-sm"><p className="font-medium text-on-secondary-container">Reply from {review.staffReply.author}</p><p className="mt-1 text-on-surface-variant">{review.staffReply.text}</p></div>}
      {review.moderationReason && <p className="mt-3 text-xs text-error">Reason: {review.moderationReason}</p>}
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-outline-variant/30 pt-4">
        <span className="mr-auto text-xs text-on-surface-variant">{date}</span>
        {review.status !== "published" && <Button size="sm" onClick={onApprove} disabled={busy} className="min-h-10 rounded-full"><CheckCircle className="h-4 w-4" /> Approve</Button>}
        <Button variant="outline" size="sm" onClick={onReply} disabled={busy} className="min-h-10 rounded-full"><MessageSquareIcon className="h-4 w-4" /> Reply</Button>
        {review.status !== "hidden" && <Button variant="outline" size="sm" onClick={onHide} disabled={busy} className="min-h-10 rounded-full"><EyeOff className="h-4 w-4" /> Hide</Button>}
        {review.status !== "flagged" && <Button variant="outline" size="sm" onClick={onFlag} disabled={busy} className="min-h-10 rounded-full"><Flag className="h-4 w-4" /> Flag</Button>}
      </div>
    </article>
  );
}

function BulkBar({ selected, onApprove, onHide, onFlag, onClear, busy }: { selected: number; onApprove: () => void; onHide: () => void; onFlag: () => void; onClear: () => void; busy: boolean }) {
  return <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-inverse-surface px-5 py-3 text-inverse-on-surface" role="status"><span className="mr-auto font-medium" aria-live="polite">{selected} selected</span><Button variant="outline" onClick={onApprove} disabled={busy} className="min-h-10 rounded-full bg-transparent text-inverse-on-surface"><CheckCircle className="h-4 w-4" /> Approve</Button><Button variant="outline" onClick={onHide} disabled={busy} className="min-h-10 rounded-full bg-transparent text-inverse-on-surface"><EyeOff className="h-4 w-4" /> Hide</Button><Button variant="outline" onClick={onFlag} disabled={busy} className="min-h-10 rounded-full bg-transparent text-inverse-on-surface"><Flag className="h-4 w-4" /> Flag</Button><Button variant="outline" onClick={onClear} className="min-h-10 rounded-full bg-transparent text-inverse-on-surface">Clear</Button></div>;
}

function ReplyDialog({ open, onOpenChange, review, draft, setDraft, error, setError, onSaveDraft, onPublish, busy }: { open: boolean; onOpenChange: (open: boolean) => void; review: Review | null; draft: string; setDraft: (v: string) => void; error: boolean; setError: (v: boolean) => void; onSaveDraft: () => void; onPublish: () => void; busy: boolean }) {
  if (!review) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ width: "min(34rem, calc(100vw - 2rem))", maxWidth: "none", backgroundColor: "#fff" }} className="rounded-2xl p-6">
        <DialogHeader><span className="grid h-12 w-12 place-items-center rounded-full bg-secondary-container text-secondary"><MessageSquareIcon className="h-5 w-5" /></span><DialogTitle className="font-serif text-2xl">Reply to {review.customer}</DialogTitle><DialogDescription>Respond to their review of {review.productName}.</DialogDescription></DialogHeader>
        <div className="rounded-xl bg-surface-container p-4 text-sm"><div className="flex items-center gap-2"><RatingStars value={review.rating} /><span className="font-medium">{review.title}</span></div><p className="mt-2 text-on-surface-variant">{review.body}</p></div>
        <div className="space-y-2"><Label htmlFor="reply-text" className={cn(error && "text-error")}>Response</Label><Textarea id="reply-text" value={draft} onChange={(e) => { setDraft(e.target.value); if (error && e.target.value.trim()) setError(false); }} placeholder="Thank you for sharing your experience..." aria-invalid={error} className="rounded-xl bg-surface-container" /><p className="text-right text-xs text-on-surface-variant">{draft.length}/1000</p>{error && <p className="text-sm text-error">A reply cannot be empty.</p>}</div>
        <DialogFooter><Button variant="outline" onClick={onSaveDraft} disabled={busy}>Save Draft</Button><Button onClick={onPublish} disabled={busy || !draft.trim()}><Send className="h-4 w-4" /> Publish Reply</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ConfirmDialog({ open, onOpenChange, action, reason, setReason, error, setError, onConfirm, busy }: { open: boolean; onOpenChange: (open: boolean) => void; action: ConfirmAction; reason: string; setReason: (v: string) => void; error: boolean; setError: (v: boolean) => void; onConfirm: () => void; busy: boolean }) {
  if (!action) return null;
  const title = action.type === "hide" ? `Hide ${action.ids.length} review${action.ids.length > 1 ? "s" : ""}?` : `Flag ${action.ids.length} review${action.ids.length > 1 ? "s" : ""}?`;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ width: "min(30rem, calc(100vw - 2rem))", maxWidth: "none", backgroundColor: "#fff" }} className="rounded-2xl p-6">
        <DialogHeader><span className="grid h-12 w-12 place-items-center rounded-full bg-error-container text-error"><AlertTriangle className="h-5 w-5" /></span><DialogTitle className="font-serif text-2xl">{title}</DialogTitle><DialogDescription>Select a reason so your team can follow up consistently.</DialogDescription></DialogHeader>
        <Select value={reason} onValueChange={(v) => { if (!v) return; setReason(v); if (error) setError(false); }}><SelectTrigger aria-invalid={error} className="h-11 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface"><SelectValue placeholder="Select a reason" /></SelectTrigger><SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest">{moderationReasons.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent></Select>
        {error && <p className="text-sm text-error">Please select a reason.</p>}
        <DialogFooter><Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>Cancel</Button><Button variant="destructive" onClick={onConfirm} disabled={busy}>{action.type === "hide" ? "Hide" : "Flag"}</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FilterSheet({ open, onOpenChange, search, setSearch, rating, setRating, product, setProduct, date, setDate, productOptions }: { open: boolean; onOpenChange: (v: boolean) => void; search: string; setSearch: (v: string) => void; rating: number | "all"; setRating: (v: number | "all") => void; product: string; setProduct: (v: string) => void; date: DateFilter; setDate: (v: DateFilter) => void; productOptions: { id: string; name: string }[] }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85svh] rounded-t-2xl p-6">
        <SheetHeader><SheetTitle className="font-serif text-2xl">Filter reviews</SheetTitle><SheetDescription>Narrow reviews by rating, product, and date.</SheetDescription></SheetHeader>
        <div className="mt-4 space-y-4">
          <label className="relative block"><span className="sr-only">Search reviews</span><Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-outline" /><Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews..." className="min-h-11 rounded-full border-0 bg-surface-container pl-11" /></label>
          <label className="block text-sm font-medium">Rating<select value={String(rating)} onChange={(e) => setRating(e.target.value === "all" ? "all" : Number(e.target.value))} className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3"><option value="all">All ratings</option>{[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} stars</option>)}</select></label>
          <label className="block text-sm font-medium">Product<select value={product} onChange={(e) => setProduct(e.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3">{productOptions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
          <label className="block text-sm font-medium">Date<select value={date} onChange={(e) => setDate(e.target.value as DateFilter)} className="mt-2 min-h-11 w-full rounded-xl border border-outline-variant bg-surface px-3">{(Object.keys(dateLabels) as DateFilter[]).map((k) => <option key={k} value={k}>{dateLabels[k]}</option>)}</select></label>
        </div>
        <SheetFooter className="mt-4"><Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button></SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
