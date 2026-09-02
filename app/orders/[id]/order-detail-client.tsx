"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, CreditCard, Headphones, MapPin, MessageSquareText, PackageSearch, Printer, Tag, Truck } from "lucide-react";
import { OrderTimeline } from "@/components/order-tracking/order-timeline";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingButton } from "@/components/ui/loading-button";
import { SkeletonPage } from "@/components/ui/skeleton-patterns";
import { successToast } from "@/components/ui/success-toast";
import { cn } from "@/lib/utils";

const items = [
  { name: "The Juliet Arrangement", detail: "Grand · Ceramic Matte White", quantity: 1, price: 145, image: "/product-detail/bouquet-main.png", note: "Gift note included" },
  { name: "Botanical Truffle Collection", detail: "12-piece artisan signature set", quantity: 1, price: 38, image: "/product-detail/packaging.png" },
];

export default function OrderDetailClient({ id }: { id: string }) {
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [status, setStatus] = useState(() => id.toLowerCase().includes("failed") ? "payment_failed" : id.toLowerCase().includes("cancel") ? "cancelled" : id.toLowerCase().includes("refund") ? "refunded" : "shipped");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(timer);
  }, []);

  async function reorder() {
    setReordering(true);
    await new Promise((resolve) => setTimeout(resolve, 650));
    setReordering(false);
    successToast("Items added to cart", "Your previous order is ready in your cart.");
  }

  if (loading) return <SkeletonPage variant="orders" />;
  if (!id) return <EmptyState icon={PackageSearch} title="Order not found" description="We couldn't find an order with that reference." action={<Button render={<Link href="/orders" />}>Back to Orders</Button>} />;
  const exceptional = status !== "shipped";

  return <div className="mx-auto w-full max-w-[1140px] px-4 py-8 pb-28 md:px-6 md:py-12 md:pb-12">
    <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary"><ArrowLeft className="size-4" />Back to Orders</Link>
    <header className="mt-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h1 className="font-serif text-2xl font-semibold md:text-3xl">Order #{id.slice(0, 13).toUpperCase()}</h1><StatusBadge status={status} /></div><p className="mt-2 text-sm text-on-surface-variant">Placed May 6, 2024</p></div><div className="hidden items-center gap-2 md:flex"><LoadingButton loading={reordering} loadingLabel="Adding items..." onClick={reorder}>Reorder</LoadingButton><Button render={<Link href="/contact" />} variant="outline">Contact Support</Button><Button variant="ghost" size="icon" onClick={() => window.print()} aria-label="Print receipt"><Printer className="size-5" /></Button></div></header>
    {exceptional && <div role="status" className="mt-6 rounded-lg bg-error-container p-4 text-sm text-on-error-container"><strong className="capitalize">{status.replaceAll("_", " ")}</strong><p className="mt-1">This order requires attention. Contact support if you have questions.</p></div>}
    <section aria-labelledby="timeline-title" className="mt-8 rounded-lg bg-surface-container-lowest p-5 shadow-sm md:p-8"><h2 id="timeline-title" className="sr-only">Order status</h2><OrderTimeline activeStep={status === "payment_failed" ? 1 : status === "cancelled" || status === "refunded" ? 2 : 3} status={status} /></section>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.65fr_0.85fr]">
      <div className="space-y-6"><ItemsCard /><DeliveryCard /></div>
      <div className="space-y-6"><SummaryCard /><section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm"><Headphones className="size-6 text-primary" /><h2 className="mt-3 font-serif text-xl font-semibold">Need Help?</h2><p className="mt-2 text-sm text-on-surface-variant">Questions about your delivery? Our florist support team is here.</p><Button render={<Link href="/contact" />} variant="outline" className="mt-4 w-full">Chat with Support</Button>{["paid", "processing", "shipped"].includes(status) && <Button variant="ghost" onClick={() => setCancelOpen(true)} className="mt-2 w-full text-error hover:bg-error-container hover:text-error">Request Cancellation</Button>}</section></div>
    </div>
    <div className="fixed inset-x-0 bottom-16 z-40 flex gap-3 border-t border-outline-variant bg-surface/95 p-3 backdrop-blur md:hidden"><Button render={<Link href="/contact" />} variant="outline" className="flex-1">Need Help?</Button><LoadingButton loading={reordering} loadingLabel="Adding..." onClick={reorder} className="flex-1">Reorder</LoadingButton></div>
    <Dialog open={cancelOpen} onOpenChange={setCancelOpen}><DialogContent><DialogHeader><DialogTitle>Request cancellation?</DialogTitle><DialogDescription>We’ll ask the florist to stop this order. Cancellation is not guaranteed once preparation has started.</DialogDescription></DialogHeader><DialogFooter><DialogClose render={<Button variant="outline" />}>Keep Order</DialogClose><Button variant="destructive" onClick={() => { setStatus("cancelled"); setCancelOpen(false); successToast("Cancellation requested", "We’ll email you when the florist responds."); }}>Request Cancellation</Button></DialogFooter></DialogContent></Dialog>
  </div>;
}

function StatusBadge({ status }: { status: string }) { const exceptional = status !== "shipped"; return <span className={cn("inline-flex items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-xs font-semibold uppercase tracking-wider text-on-primary-container transition-colors", exceptional && "bg-error-container text-error")}><Truck className="size-4" />{status === "shipped" ? "Out for Delivery" : status.replaceAll("_", " ")}</span>; }
function ItemsCard() { return <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm md:p-7"><div className="flex justify-between"><h2 className="font-serif text-xl font-semibold">Items Ordered</h2><span className="text-sm">2 Items</span></div><div className="mt-4 divide-y divide-outline-variant/40">{items.map((item) => <div key={item.name} className="flex gap-4 py-5"><div className="relative size-20 shrink-0 overflow-hidden rounded-md"><Image src={item.image} alt="" fill className="object-cover" /></div><div className="min-w-0 flex-1"><h3 className="font-medium">{item.name}</h3><p className="mt-1 text-sm text-on-surface-variant">{item.detail}</p><p className="mt-2 text-xs">Qty: {item.quantity}{item.note && ` · ${item.note}`}</p></div><p className="self-center font-medium">${item.price.toFixed(2)}</p></div>)}</div></section>; }
function DeliveryCard() { return <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm md:p-7"><h2 className="font-serif text-xl font-semibold">Delivery Details</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><div className="flex gap-3"><MapPin className="size-5 text-primary" /><p className="text-sm"><strong className="mb-1 block uppercase tracking-wider">Recipient</strong>Sarah Jenkins<br />1234 Willow Creek Way, Apt 8B<br />San Francisco, CA 94110</p></div><div className="flex gap-3"><Truck className="size-5 text-primary" /><p className="text-sm"><strong className="mb-1 block uppercase tracking-wider">Requested Slot</strong>Friday, May 9<br />Morning · 9 AM–12 PM</p></div></div><div className="mt-6 flex gap-3 border-t border-outline-variant/40 pt-5"><MessageSquareText className="size-5 text-primary" /><p className="text-sm"><strong className="block">Gift Message</strong><em>“Happy Birthday! Wishing you a year as beautiful and vibrant as these blooms.”</em></p></div></section>; }
function SummaryCard() { return <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm"><h2 className="font-serif text-xl font-semibold">Payment Summary</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>$183.00</dd></div><div className="flex justify-between text-[#9a7300]"><dt className="flex items-center gap-2"><Tag className="size-4" />BLOOM15</dt><dd>-$27.45</dd></div><div className="flex justify-between"><dt>Delivery Fee</dt><dd>$15.00</dd></div><div className="flex justify-between"><dt>Taxes</dt><dd>$14.50</dd></div><div className="flex justify-between border-t border-outline-variant pt-4 text-xl font-semibold"><dt>Total</dt><dd>$185.05</dd></div></dl><div className="mt-5 rounded-md bg-surface-container-low p-4 text-sm"><p className="flex items-center gap-2 font-medium"><CreditCard className="size-5" />Visa ending in 4242</p><p className="mt-1 text-xs text-on-surface-variant">Paid · Transaction BNS-7F82A91</p></div></section>; }
