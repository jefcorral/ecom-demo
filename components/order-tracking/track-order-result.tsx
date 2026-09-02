"use client";

import Image from "next/image";
import Link from "next/link";
import { CreditCard, Headphones, MapPin, MessageSquareText, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderTimeline } from "@/components/order-tracking/order-timeline";

const items = [
  { name: "The Ivory Elegance", detail: "Large · Ceramic Vase", quantity: 1, price: 125, image: "/product-detail/bouquet-main.png" },
  { name: "Artisanal Truffles", detail: "Add-on", quantity: 1, price: 24, image: "/product-detail/packaging.png" },
];

export function TrackOrderResult({ orderId, guest = true }: { orderId: string; guest?: boolean }) {
  return <section aria-labelledby="tracking-result-title" tabIndex={-1} className="mx-auto w-full max-w-[1140px] px-4 py-8 outline-none md:px-6 md:py-12">
    <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Order</p><h1 id="tracking-result-title" className="font-serif text-2xl font-semibold text-on-surface">#{orderId}</h1></div><span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-container px-4 py-2 text-sm font-medium text-on-primary-container"><Truck className="size-4" />Out for Delivery</span></header>
    <div className="rounded-lg bg-surface-container-lowest p-5 shadow-sm md:p-8"><div className="mb-6"><h2 className="font-serif text-xl font-semibold">Arriving Today</h2><p className="mt-1 text-sm text-on-surface-variant">Estimated delivery: 2:00 PM – 4:00 PM</p></div><OrderTimeline /></div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-6"><OrderItemsList /><OrderAddressCard /></div>
      <div className="space-y-6"><OrderSummaryCard /><div className="rounded-lg bg-surface-container-lowest p-5 shadow-sm"><Headphones className="size-6 text-primary" /><h2 className="mt-3 font-serif text-xl font-semibold">Need help?</h2><p className="mt-2 text-sm text-on-surface-variant">Our florist support team is here for delivery questions.</p><Button render={<Link href="/contact" />} variant="outline" className="mt-4 w-full">Contact Support</Button></div></div>
    </div>
    {!guest && <div className="sticky bottom-20 mt-6 flex gap-3 bg-surface/90 py-3 backdrop-blur md:static md:justify-end md:bg-transparent"><Button variant="outline" className="flex-1 md:flex-none">Need Help?</Button><Button className="flex-1 md:flex-none">Reorder</Button></div>}
  </section>;
}

function OrderItemsList() {
  return <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm"><h2 className="font-serif text-xl font-semibold">Items Ordered</h2><div className="mt-4 divide-y divide-outline-variant/50">{items.map((item) => <div key={item.name} className="flex gap-4 py-4"><div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-surface-container"><Image src={item.image} alt="" fill className="object-cover" /></div><div className="min-w-0 flex-1"><h3 className="font-medium">{item.name}</h3><p className="mt-1 text-sm text-on-surface-variant">{item.detail}</p><p className="mt-2 text-sm">Qty: {item.quantity}</p></div><p className="self-end font-medium">${item.price.toFixed(2)}</p></div>)}</div></section>;
}

function OrderAddressCard() {
  return <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm"><h2 className="font-serif text-xl font-semibold">Delivery Details</h2><div className="mt-5 space-y-5 text-sm"><div className="flex gap-3"><MapPin className="mt-1 size-5 shrink-0 text-primary" /><p><strong className="block">Recipient</strong>Sarah Jenkins<br />1240 Blossom Lane, Apt 4B<br />Portland, OR 97204</p></div><div className="flex gap-3 border-t border-outline-variant/50 pt-5"><MessageSquareText className="mt-1 size-5 shrink-0 text-primary" /><p><strong className="block">Card Message</strong><em>“Thinking of you on your special day. Hope these brighten your week!”</em></p></div></div></section>;
}

function OrderSummaryCard() {
  return <section className="rounded-lg bg-surface-container-lowest p-5 shadow-sm"><h2 className="font-serif text-xl font-semibold">Payment Summary</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>$149.00</dd></div><div className="flex justify-between"><dt>Delivery</dt><dd>$15.00</dd></div><div className="flex justify-between"><dt>Tax</dt><dd>$12.50</dd></div><div className="flex justify-between border-t border-outline-variant pt-4 text-base font-semibold"><dt>Total</dt><dd className="text-[#785900]">$176.50</dd></div></dl><p className="mt-4 flex items-center gap-2 rounded-md bg-surface-container-low p-3 text-sm"><CreditCard className="size-4" />Visa ending in 4242</p></section>;
}
