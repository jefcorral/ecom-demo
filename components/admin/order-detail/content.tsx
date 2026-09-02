"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  Send,
  Star,
  Truck,
  Undo2,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LoadingButton } from "@/components/ui/loading-button";
import { successToast } from "@/components/ui/success-toast";
import { cn } from "@/lib/utils";
import type { AdminOrderDetail, AdminOrderNote } from "@/lib/admin-orders";

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "designing", label: "Designing" },
  { value: "sourcing", label: "Sourcing" },
  { value: "in_progress", label: "In Progress" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusConfig: Record<
  string,
  { label: string; classes: string; dot: string; icon: typeof Clock }
> = {
  pending: { label: "Pending", classes: "bg-tertiary-fixed/40 text-on-tertiary-fixed border border-tertiary/20", dot: "bg-tertiary", icon: Clock },
  designing: { label: "Designing", classes: "bg-tertiary-container/30 text-on-tertiary-container border border-tertiary/20", dot: "bg-tertiary", icon: Package },
  sourcing: { label: "Sourcing", classes: "bg-primary-container/20 text-on-primary-container border border-primary/20", dot: "bg-primary", icon: Package },
  in_progress: { label: "In Progress", classes: "bg-primary-container/20 text-on-primary-container border border-primary/20", dot: "bg-primary", icon: Truck },
  delivered: { label: "Delivered", classes: "bg-secondary-container text-on-secondary-container border border-secondary/20", dot: "bg-secondary", icon: CheckCircle },
  cancelled: { label: "Cancelled", classes: "bg-error-container/30 text-error border border-error/20", dot: "bg-error", icon: X },
  refunded: { label: "Refunded", classes: "bg-error-container/30 text-error border border-error/20", dot: "bg-error", icon: Undo2 },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? statusConfig.pending;
  const Icon = config.icon;
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium", config.classes)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      <Icon className="h-3.5 w-3.5" />
      {config.label}
    </span>
  );
}

function StatusSelect({ status, onChange, className }: { status: string; onChange: (value: string) => void; className?: string }) {
  return (
    <Select value={status} onValueChange={(value) => value && onChange(value)}>
      <SelectTrigger aria-label="Update order status" className={cn("h-11 gap-2 rounded-full border-outline-variant/40 bg-surface-container px-4 text-sm font-medium text-on-surface hover:bg-surface-container-high focus:ring-0", className)}>
        <SelectValue placeholder="Update Status" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-outline-variant/30 bg-surface-container-lowest">
        {statusOptions.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-sm text-on-surface focus:bg-surface-container focus:text-on-surface">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function OrderDetailContent({ order: initialOrder }: { order: AdminOrderDetail }) {
  const [order, setOrder] = useState(initialOrder);
  const [status, setStatus] = useState(order.status);
  const [notes, setNotes] = useState<AdminOrderNote[]>(order.notes);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [courier, setCourier] = useState(order.courier);
  const [assigning, setAssigning] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState(false);

  const subtotal = useMemo(() => order.lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [order.lineItems]);
  const delivery = 25;
  const tax = +(subtotal * 0.08).toFixed(2);
  const total = subtotal + delivery + tax;
  const exceptional = status === "cancelled" || status === "refunded";

  const updateStatus = (value: string) => {
    setStatus(value as AdminOrderDetail["status"]);
    setOrder((prev) => ({
      ...prev,
      status: value as AdminOrderDetail["status"],
      auditHistory: [
        ...prev.auditHistory,
        { id: `a-${Date.now()}`, status: value, label: `Status updated to ${statusOptions.find((s) => s.value === value)?.label ?? value}`, timestamp: "Just now" },
      ],
    }));
    successToast("Status updated", `Order is now ${statusOptions.find((s) => s.value === value)?.label ?? value}.`);
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    setSavingNote(true);
    await new Promise((resolve) => setTimeout(resolve, 400));
    const newNote: AdminOrderNote = { id: `note-${Date.now()}`, author: "Admin User", role: "Manager", text: noteText.trim(), createdAt: "Just now" };
    setNotes((prev) => [newNote, ...prev]);
    setNoteText("");
    setSavingNote(false);
    successToast("Note added", "Internal note saved.");
  };

  const assignCourier = async () => {
    setAssigning(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setCourier({ id: "c1", name: "Alex Rivera", phone: "(555) 019-2831" });
    setAssigning(false);
    successToast("Courier assigned", "Alex Rivera is assigned to this delivery.");
  };

  const printSlip = () => {
    window.print();
    successToast("Print job sent", "Packing slip sent to printer.");
  };

  const resendReceipt = async () => {
    setProcessingAction(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setProcessingAction(false);
    successToast("Receipt resent", "A copy has been emailed to the customer.");
  };

  const refundOrder = async () => {
    setProcessingAction(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("refunded");
    setRefundOpen(false);
    setProcessingAction(false);
    successToast("Refund processed", "The order has been refunded.");
  };

  const cancelOrder = async () => {
    setProcessingAction(true);
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("cancelled");
    setCancelOpen(false);
    setProcessingAction(false);
    successToast("Order cancelled", "The order has been cancelled.");
  };

  return (
    <div className="mx-auto max-w-[1440px] px-5 pb-28 pt-6 lg:px-16 lg:pb-10 lg:pt-10">
      <div className="mb-6 flex items-center gap-2 lg:mb-8">
        <Button render={<Link href="/dashboard/orders" />} variant="ghost" size="sm" className="gap-2 text-on-surface-variant hover:text-primary">
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Button>
      </div>

      <header className="mb-6 flex flex-col gap-4 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-2xl text-on-surface lg:text-4xl">{order.number}</h1>
            <StatusBadge status={status} />
            {order.priority && (
              <Badge variant="warning" className="gap-1">
                <Star className="h-3 w-3 fill-current" /> Priority
              </Badge>
            )}
          </div>
          <p className="mt-2 flex items-center gap-2 text-sm text-on-surface-variant">
            <Calendar className="h-4 w-4" /> Placed on {order.createdAt}
          </p>
        </div>
        <div className="hidden flex-wrap items-center gap-3 lg:flex">
          <Button variant="outline" onClick={printSlip} className="gap-2 rounded-full border-outline-variant/40 bg-surface-container-low px-5 text-on-surface hover:bg-surface-container">
            <Printer className="h-4 w-4" /> Print Slip
          </Button>
          <Button variant="outline" onClick={resendReceipt} disabled={processingAction} className="gap-2 rounded-full border-outline-variant/40 bg-surface-container-low px-5 text-on-surface hover:bg-surface-container">
            <Mail className="h-4 w-4" /> Resend Receipt
          </Button>
          <Button variant="outline" onClick={() => successToast("Invoice opened", "Invoice preview opened in a new tab.")} disabled={processingAction} className="gap-2 rounded-full border-outline-variant/40 bg-surface-container-low px-5 text-on-surface hover:bg-surface-container">
            <FileText className="h-4 w-4" /> Invoice
          </Button>
          <StatusSelect status={status} onChange={updateStatus} />
          <Button variant="destructive" onClick={() => setRefundOpen(true)} disabled={exceptional} className="gap-2 rounded-full">
            <Undo2 className="h-4 w-4" /> Refund
          </Button>
          <Button variant="destructive" onClick={() => setCancelOpen(true)} disabled={exceptional} className="gap-2 rounded-full">
            <X className="h-4 w-4" /> Cancel
          </Button>
        </div>
      </header>

      {exceptional && (
        <div role="alert" className="mb-6 rounded-2xl border border-error/20 bg-error-container/30 p-4 text-sm text-error">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <strong className="font-medium capitalize">{status}</strong>
              <p className="mt-1">This order is in a terminal state. Fulfillment actions are limited.</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl text-on-surface lg:text-2xl">Order Items</h2>
              <span className="text-sm text-on-surface-variant">{order.lineItems.reduce((sum, item) => sum + item.quantity, 0)} items</span>
            </div>
            <div className="space-y-4">
              {order.lineItems.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-2xl bg-surface-container-low p-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg lg:h-24 lg:w-24">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 1024px) 80px, 96px" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <h3 className="font-medium text-on-surface">{item.name}</h3>
                      <span className="font-medium text-on-surface">{formatCurrency(item.unitPrice)}</span>
                    </div>
                    {item.options && <p className="mt-1 text-sm text-on-surface-variant">{item.options}</p>}
                    <p className="mt-2 text-xs text-on-surface-variant">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {order.giftMessage && (
            <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
              <h2 className="mb-4 font-serif text-xl text-on-surface lg:text-2xl">Gift Message</h2>
              <div className="rounded-2xl bg-surface-container-low p-5">
                <p className="font-serif italic leading-relaxed text-on-surface-variant">&ldquo;{order.giftMessage}&rdquo;</p>
              </div>
            </section>
          )}

          <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
            <h2 className="mb-4 font-serif text-xl text-on-surface lg:text-2xl">Internal Notes</h2>
            <div className="space-y-4">
              {notes.length === 0 && <p className="text-sm text-on-surface-variant">No internal notes yet.</p>}
              {notes.map((note) => (
                <div key={note.id} className="flex gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4">
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", note.role === "Designer" ? "bg-tertiary text-on-tertiary" : "bg-secondary text-on-secondary")}>
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium text-on-surface">{note.author}</span>
                      <span className="text-xs text-on-surface-variant">({note.role})</span>
                    </div>
                    <p className="mt-1 text-sm text-on-surface-variant">{note.text}</p>
                    <span className="mt-2 block text-xs text-on-surface-variant/60">{note.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <Textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add an internal note..."
                className="min-h-0 flex-1 resize-none rounded-2xl border-outline-variant/40 bg-surface-container-low px-4 py-3 text-sm"
                rows={2}
              />
              <LoadingButton loading={savingNote} loadingLabel="Saving" onClick={addNote} className="h-auto rounded-2xl px-4">
                <Send className="h-4 w-4" />
              </LoadingButton>
            </div>
          </section>

          <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
            <h2 className="mb-6 font-serif text-xl text-on-surface lg:text-2xl">Status History</h2>
            <div className="relative space-y-6 pl-6">
              <span className="absolute bottom-2 left-[11px] top-2 w-0.5 bg-outline-variant/30" />
              {order.auditHistory.map((event, index) => {
                const final = index === order.auditHistory.length - 1;
                return (
                  <div key={event.id} className="relative">
                    <span
                      className={cn(
                        "absolute -left-[26px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-surface-container-lowest",
                        final ? "bg-primary text-on-primary" : "bg-surface-container-high text-on-surface-variant"
                      )}
                    >
                      {final ? <Check className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-on-surface-variant" />}
                    </span>
                    <p className="text-sm font-medium text-on-surface">{event.label}</p>
                    <p className="mt-0.5 text-xs text-on-surface-variant">{event.timestamp}</p>
                    {event.note && <p className="mt-1 text-xs text-on-surface-variant/70">{event.note}</p>}
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:col-span-4">
          <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
            <h2 className="mb-4 font-serif text-xl text-on-surface">Customer</h2>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-outline-variant/20 bg-surface-variant text-sm font-medium text-secondary">
                {order.customer.initials ?? order.customer.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-on-surface">{order.customer.name}</p>
                <p className="text-sm text-on-surface-variant">{order.customer.email}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm text-on-surface-variant">
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4" /> {order.customerPhone}
              </p>
              {order.customer.isVip && (
                <p className="flex items-center gap-2 text-primary">
                  <Star className="h-4 w-4 fill-current" /> VIP Member
                </p>
              )}
            </div>
            <div className="mt-5 rounded-2xl bg-surface-container-low p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Billing Address</p>
              <p className="mt-1 text-sm text-on-surface">{order.billingAddress}</p>
            </div>
          </section>

          <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
            <h2 className="mb-4 font-serif text-xl text-on-surface">Delivery</h2>
            <div className="mb-4 rounded-2xl bg-surface-container-low p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Date &amp; Time</p>
              <p className="mt-1 flex items-center gap-2 text-sm font-medium text-on-surface">
                <Calendar className="h-4 w-4" /> {order.targetDate}
              </p>
              {order.serviceTime && <p className="mt-1 text-sm text-on-surface-variant">{order.serviceTime}</p>}
            </div>
            <div className="mb-4 space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-on-surface-variant">Recipient / Venue</p>
              <p className="font-medium text-on-surface">{order.recipient}</p>
              <p className="text-sm text-on-surface-variant">{order.venue}</p>
              <p className="flex items-start gap-2 text-sm text-on-surface-variant">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" /> {order.address}
              </p>
            </div>
            <div className="relative h-32 w-full overflow-hidden rounded-2xl bg-surface-container-low">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-on-surface-variant/50">
                <MapPin className="h-8 w-8" />
                <span className="mt-1 text-xs">Map preview</span>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
            <h2 className="mb-4 font-serif text-xl text-on-surface">Courier Assignment</h2>
            {courier ? (
              <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
                  <Truck className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-on-surface">{courier.name}</p>
                  <p className="text-sm text-on-surface-variant">{courier.phone}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between rounded-2xl bg-surface-container-low p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
                    <Truck className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-on-surface-variant">Pending Assignment</span>
                </div>
                <LoadingButton loading={assigning} loadingLabel="Assigning" onClick={assignCourier} className="rounded-full px-4">
                  Assign
                </LoadingButton>
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:p-6">
            <h2 className="mb-4 font-serif text-xl text-on-surface">Payment</h2>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between text-on-surface-variant">
                <dt>Subtotal</dt>
                <dd className="text-on-surface">{formatCurrency(subtotal)}</dd>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <dt>Delivery Fee</dt>
                <dd className="text-on-surface">{formatCurrency(delivery)}</dd>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <dt>Tax</dt>
                <dd className="text-on-surface">{formatCurrency(tax)}</dd>
              </div>
              <div className="my-4 h-px bg-outline-variant/30" />
              <div className="flex justify-between font-serif text-lg text-on-surface">
                <dt>Total</dt>
                <dd>{formatCurrency(total)}</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-center gap-3 rounded-2xl bg-secondary-container/30 p-4">
              <CreditCard className="h-5 w-5 text-secondary" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-on-surface">{order.paymentDetails.method}{order.paymentDetails.lastFour && ` ending in ${order.paymentDetails.lastFour}`}</p>
                <p className="text-xs text-on-surface-variant/70">{order.paymentDetails.transactionId} • {order.paymentDetails.paidAt}</p>
              </div>
            </div>
          </section>

          <section className="space-y-3 rounded-3xl bg-surface-container-lowest p-5 shadow-sm lg:hidden">
            <Button variant="outline" onClick={() => successToast("Invoice opened", "Invoice preview opened in a new tab.")} disabled={processingAction} className="w-full gap-2 rounded-full">
              <FileText className="h-4 w-4" /> Invoice
            </Button>
            <Button variant="outline" onClick={printSlip} className="w-full gap-2 rounded-full">
              <Printer className="h-4 w-4" /> Print Slip
            </Button>
            <Button variant="outline" onClick={resendReceipt} disabled={processingAction} className="w-full gap-2 rounded-full">
              <Mail className="h-4 w-4" /> Resend Receipt
            </Button>
            <Button variant="destructive" onClick={() => setRefundOpen(true)} disabled={exceptional} className="w-full gap-2 rounded-full">
              <Undo2 className="h-4 w-4" /> Refund
            </Button>
            <Button variant="destructive" onClick={() => setCancelOpen(true)} disabled={exceptional} className="w-full gap-2 rounded-full">
              <X className="h-4 w-4" /> Cancel
            </Button>
          </section>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-30 flex items-center gap-3 border-t border-outline-variant/20 bg-surface/95 p-3 backdrop-blur lg:hidden">
        <Button variant="outline" onClick={printSlip} className="flex-1 gap-2 rounded-full">
          <Printer className="h-4 w-4" /> Print
        </Button>
        <StatusSelect status={status} onChange={updateStatus} className="flex-1" />
      </div>

      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Full Refund?</DialogTitle>
            <DialogDescription>This action cannot be undone. It will immediately refund {formatCurrency(total)} to the original payment method and cancel the delivery.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Keep Order</DialogClose>
            <LoadingButton loading={processingAction} loadingLabel="Refunding..." onClick={refundOrder} variant="destructive">
              Confirm Refund
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Order?</DialogTitle>
            <DialogDescription>This will cancel the order and release reserved inventory. The customer will be notified.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Keep Order</DialogClose>
            <LoadingButton loading={processingAction} loadingLabel="Cancelling..." onClick={cancelOrder} variant="destructive">
              Confirm Cancellation
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
