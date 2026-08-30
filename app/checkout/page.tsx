"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, Check, ChevronDown, CircleUserRound, CreditCard, Headphones, Leaf, LockKeyhole, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = ["Delivery", "Payment", "Review", "Done"];
const orderItems = [
  { name: "Garden Rose & Peony", detail: "Qty: 1 · Signature Vase", price: 155, image: "/product-detail/bouquet-main.png" },
  { name: "Artisan Chocolates", detail: "Qty: 1 · 12-Piece Box", price: 45, image: "/product-detail/packaging.png" },
];

const fieldClass = "h-14 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-md text-base text-on-surface outline-none transition focus:border-primary focus:bg-surface md:h-10 md:rounded-full md:border-transparent md:bg-surface md:focus:ring-2 md:focus:ring-primary";

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [giftNoteOpen, setGiftNoteOpen] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("2026-09-01");
  const [deliverySlot, setDeliverySlot] = useState("afternoon");
  const [promo, setPromo] = useState("BLOOM15");
  const [promoApplied, setPromoApplied] = useState(true);
  const [paymentError, setPaymentError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const errorRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState({ firstName: "", lastName: "", phone: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "US" });
  const subtotal = 200;
  const delivery = 24;
  const discount = promoApplied ? 16.6 : 0;
  const tax = 16.9;
  const total = subtotal + delivery + tax - discount;
  const deliveryComplete = Boolean(address.firstName && address.lastName && address.line1 && address.city && address.state && address.postalCode && deliveryDate && deliverySlot);

  function updateAddress(field: keyof typeof address, value: string) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  function continueToPayment(event: React.FormEvent) {
    event.preventDefault();
    if (deliveryComplete) setStep(1);
  }

  async function placeOrder() {
    setSubmitting(true);
    setPaymentError("");
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSubmitting(false);
    setStep(3);
  }

  if (step === 3) return <Confirmation total={total} address={address} deliveryDate={deliveryDate} deliverySlot={deliverySlot} />;

  return (
    <div className="pb-36 lg:pb-0">
      <div className="mx-auto w-full max-w-[1140px] px-6 py-xl">
        <Link href="/cart" className="mb-8 hidden items-center gap-2 text-sm text-on-surface-variant hover:text-primary md:flex"><ArrowLeft className="h-4 w-4" />Back to Cart</Link>
        <Progress step={step} />

        <button type="button" className="-mx-4 mb-8 flex w-[calc(100%+2rem)] items-center justify-between border-y border-outline-variant/30 bg-surface-container-lowest px-6 py-5 text-left lg:hidden">
          <span><strong className="block font-medium">Your order (2 items)</strong><span className="text-sm text-on-surface-variant">Review details</span></span>
          <span className="flex items-center gap-3 font-serif text-xl">${total.toFixed(2)}<ChevronDown className="h-4 w-4" /></span>
        </button>

        <div className="grid grid-cols-1 items-start gap-xl lg:grid-cols-12">
          <main className="flex flex-col gap-xl lg:col-span-7">
            {step === 0 && (
              <form onSubmit={continueToPayment}>
                <h1 className="mb-8 font-serif text-3xl font-semibold md:text-4xl">Delivery Details</h1>
                <section className="rounded-xl bg-surface-container-lowest p-0 md:p-lg md:shadow-sm" aria-labelledby="recipient-title">
                  <h2 id="recipient-title" className="mb-6 flex items-center gap-3 font-serif text-xl font-semibold md:text-2xl"><CircleUserRound className="h-5 w-5 text-primary" />Recipient Information</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First Name" value={address.firstName} onChange={(value) => updateAddress("firstName", value)} required />
                    <Field label="Last Name" value={address.lastName} onChange={(value) => updateAddress("lastName", value)} required />
                    <Field label="Phone Number" type="tel" value={address.phone} onChange={(value) => updateAddress("phone", value)} className="sm:col-span-2" />
                    <Field label="Street Address" value={address.line1} onChange={(value) => updateAddress("line1", value)} required className="sm:col-span-2" />
                    <Field label="Apt / Suite" value={address.line2} onChange={(value) => updateAddress("line2", value)} />
                    <Field label="City" value={address.city} onChange={(value) => updateAddress("city", value)} required />
                    <Field label="State" value={address.state} onChange={(value) => updateAddress("state", value)} required />
                    <Field label="Zip Code" value={address.postalCode} onChange={(value) => updateAddress("postalCode", value)} required />
                  </div>
                </section>

                <section className="mt-8 rounded-xl bg-surface-container-lowest p-0 md:p-lg md:shadow-sm" aria-labelledby="timing-title">
                  <h2 id="timing-title" className="mb-6 flex items-center gap-3 font-serif text-xl font-semibold md:text-2xl"><CalendarDays className="h-5 w-5 text-primary" />Delivery Timing</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-sm ml-sm block text-xs font-semibold text-on-surface-variant">Select Date</label>
                      <input type="date" min="2026-08-31" value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} className={`${fieldClass} md:hidden`} required />
                      <div className="hidden rounded-xl bg-surface p-sm md:block">
                        <div className="mb-sm flex items-center justify-between px-sm"><button type="button" className="h-8 w-8">‹</button><span className="text-sm font-medium">September 2026</span><button type="button" className="h-8 w-8">›</button></div>
                        <div className="mb-xs grid grid-cols-7 gap-xs text-center text-[10px] text-on-surface-variant">{"SMTWTFS".split("").map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
                        <div className="grid grid-cols-7 gap-xs text-center">{Array.from({ length: 15 }, (_, index) => { const day = index + 1; const selected = deliveryDate === `2026-09-${String(day).padStart(2, "0")}`; return <button key={day} type="button" onClick={() => setDeliveryDate(`2026-09-${String(day).padStart(2, "0")}`)} className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition hover:scale-95 ${selected ? "bg-primary text-on-primary shadow-sm" : "hover:bg-surface-container-highest"}`}>{day}</button>; })}</div>
                      </div>
                    </div>
                    <fieldset><legend className="mb-2 text-sm font-medium">Select Time Window</legend><div className="space-y-2">{[["morning", "Morning (8am - 12pm)"], ["afternoon", "Afternoon (12pm - 4pm)"], ["evening", "Evening (4pm - 8pm)"]].map(([value, label]) => <button key={value} type="button" aria-pressed={deliverySlot === value} onClick={() => setDeliverySlot(value)} className={`flex h-12 w-full items-center justify-between rounded-xl px-4 text-left transition ${deliverySlot === value ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container"}`}><span>{label}</span><span className={`h-5 w-5 rounded-full border ${deliverySlot === value ? "border-[6px] border-primary" : "border-outline-variant"}`} /></button>)}</div></fieldset>
                  </div>
                </section>

                <section className="mt-8 rounded-2xl bg-surface-container-lowest p-5 shadow-sm md:p-7">
                  <button type="button" onClick={() => setGiftNoteOpen((value) => !value)} className="flex min-h-11 w-full items-center justify-between font-serif text-xl font-semibold"><span>Add a Gift Note</span><span className="text-2xl font-normal">{giftNoteOpen ? "−" : "+"}</span></button>
                  {giftNoteOpen && <div className="relative mt-4"><textarea value={giftNote} maxLength={200} onChange={(event) => setGiftNote(event.target.value)} className="min-h-28 w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low p-4 pb-8 focus:border-primary focus:outline-none" placeholder="Write a heartfelt message..." /><span className="absolute bottom-3 right-3 text-xs text-on-surface-variant">{giftNote.length}/200</span></div>}
                </section>

                <label className="mt-6 flex min-h-11 items-center gap-3 text-sm"><input type="checkbox" checked={sameAsDelivery} onChange={(event) => setSameAsDelivery(event.target.checked)} className="h-5 w-5 accent-primary" />Billing address is the same as delivery address</label>
                {!sameAsDelivery && <div className="mt-4 rounded-xl border border-outline-variant p-4 text-sm text-on-surface-variant">Billing address fields will be collected with payment details.</div>}
                <Button type="submit" disabled={!deliveryComplete} className="mt-8 h-14 w-full rounded-xl bg-primary text-sm font-bold uppercase tracking-[0.14em] text-on-primary hover:bg-primary/90 lg:hidden">Continue to Payment</Button>
              </form>
            )}

            {step === 1 && <><PaymentStep address={address} sameAsDelivery={sameAsDelivery} setSameAsDelivery={setSameAsDelivery} paymentError={paymentError} errorRef={errorRef} onContinue={() => setStep(2)} onError={() => { setPaymentError("Payment could not be processed. Check your details and try again."); setTimeout(() => errorRef.current?.focus(), 0); }} /><ReviewStep address={address} deliveryDate={deliveryDate} deliverySlot={deliverySlot} onEditDelivery={() => setStep(0)} onEditPayment={() => setStep(1)} /></>}
            {step === 2 && <ReviewStep address={address} deliveryDate={deliveryDate} deliverySlot={deliverySlot} onEditDelivery={() => setStep(0)} onEditPayment={() => setStep(1)} />}
          </main>

          <aside className="relative hidden lg:col-span-5 lg:block"><div className="sticky top-28"><OrderSummary step={step} subtotal={subtotal} delivery={delivery} discount={discount} tax={tax} total={total} promo={promo} promoApplied={promoApplied} onPromoChange={setPromo} onPromoApply={() => setPromoApplied(promo.trim().toUpperCase() === "BLOOM15")} onContinue={() => step === 0 ? deliveryComplete && setStep(1) : step === 1 ? setStep(2) : placeOrder()} submitting={submitting} /></div></aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-outline-variant/30 bg-surface/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4"><div><span className="block text-xs font-medium text-on-surface-variant">Total Amount</span><strong className="font-serif text-2xl">${total.toFixed(2)}</strong></div><Button disabled={(step === 0 && !deliveryComplete) || submitting} onClick={() => step === 0 ? setStep(1) : step === 1 ? setStep(2) : placeOrder()} className="h-14 min-w-52 rounded-lg bg-primary text-sm font-bold uppercase tracking-wider text-on-primary hover:bg-primary/90">{step === 0 ? "Continue to Payment" : step === 1 ? "Review Order" : submitting ? "Placing Order..." : "Complete Order"}</Button></div>
      </div>
    </div>
  );
}

function Progress({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-2xl relative">
      <div className="absolute top-4 left-8 right-6 h-0.5 bg-outline-variant -translate-y-1/2 z-0" />
      {steps.map((label, index) => {
        const active = index === step;
        const complete = index < step;
        return (
          <div key={label} className="flex flex-col items-center gap-xs relative z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md transform hover:scale-95 transition-transform cursor-default ${active || complete ? "bg-primary text-on-primary shadow-md" : "bg-surface-container-high text-on-surface-variant"}`}>
              {complete ? <Check className="h-4 w-4" /> : index === 0 ? <Truck className="h-4 w-4" /> : index === 3 ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span className={`font-label-sm text-label-sm ${active ? "text-on-surface" : "text-on-surface-variant"}`}>{label}</span>
          </div>
        );
      })}
    </div>
  );
}

function Field({ label, value, onChange, required = false, type = "text", className = "" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; className?: string }) {
  const id = label.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");
  return <label htmlFor={id} className={`text-sm font-medium ${className}`}>{label}<input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className={`${fieldClass} mt-2`} /></label>;
}

function PaymentStep({ address, sameAsDelivery, setSameAsDelivery, paymentError, errorRef, onContinue, onError }: { address: Record<string, string>; sameAsDelivery: boolean; setSameAsDelivery: (value: boolean) => void; paymentError: string; errorRef: React.RefObject<HTMLDivElement>; onContinue: () => void; onError: () => void }) {
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: `${address.firstName} ${address.lastName}`.trim() });
  return <section><h1 className="font-serif text-3xl font-semibold md:text-4xl">Payment Method</h1><p className="mt-2 text-on-surface-variant">All transactions are secure and encrypted.</p>{paymentError && <div ref={errorRef} tabIndex={-1} role="alert" className="mt-6 rounded-xl bg-error-container p-4 text-sm text-on-error-container outline-none"><strong className="block">Payment could not be processed</strong>{paymentError}<button type="button" onClick={onError} className="ml-2 font-semibold underline">Try Again</button></div>}<div className="mt-8 rounded-2xl bg-surface-container-lowest p-6 shadow-sm"><div className="mb-6 flex gap-4 border-b border-outline-variant/30 pb-5"><span className="flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-sm"><CreditCard className="h-4 w-4" />Credit Card</span><span className="px-4 py-2 text-sm">PayPal</span></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Card Number" value={card.number} onChange={(value) => setCard((current) => ({ ...current, number: value }))} className="sm:col-span-2" /><Field label="Expiry Date" value={card.expiry} onChange={(value) => setCard((current) => ({ ...current, expiry: value }))} /><Field label="CVC" value={card.cvc} onChange={(value) => setCard((current) => ({ ...current, cvc: value }))} /><Field label="Name on Card" value={card.name} onChange={(value) => setCard((current) => ({ ...current, name: value }))} className="sm:col-span-2" /></div><label className="mt-5 flex min-h-11 items-center gap-3"><input type="checkbox" checked={sameAsDelivery} onChange={(event) => setSameAsDelivery(event.target.checked)} className="h-5 w-5 accent-primary" />Billing address is same as delivery address</label><div className="mt-6 flex items-center gap-3 text-xs text-on-surface-variant"><ShieldCheck className="h-5 w-5 text-primary" />PCI DSS compliant payment form placeholder. Stripe Elements remains the production payment provider.</div><div className="mt-6 flex gap-3"><Button type="button" variant="outline" onClick={onError} className="h-12 flex-1 rounded-full">Simulate Error</Button><Button type="button" onClick={onContinue} className="h-12 flex-1 rounded-full bg-primary text-on-primary">Review Order</Button></div></div></section>;
}

function ReviewStep({ address, deliveryDate, deliverySlot, onEditDelivery, onEditPayment }: { address: Record<string, string>; deliveryDate: string; deliverySlot: string; onEditDelivery: () => void; onEditPayment: () => void }) {
  return <section><h1 className="mb-8 font-serif text-3xl font-semibold md:text-4xl">Review Your Order</h1><div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm"><div className="mb-5 flex justify-between text-xs uppercase tracking-wider"><span>Items (2)</span><Link href="/cart" className="text-primary">Edit Cart</Link></div>{orderItems.map((item) => <div key={item.name} className="flex items-center gap-4 border-b border-outline-variant/30 py-4"><div className="relative h-16 w-16 overflow-hidden rounded-lg"><Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" /></div><div className="flex-1"><strong>{item.name}</strong><p className="text-sm text-on-surface-variant">{item.detail}</p></div><span>${item.price.toFixed(2)}</span></div>)}<div className="mt-6 grid gap-6 sm:grid-cols-2"><div><div className="flex justify-between text-xs uppercase tracking-wider"><span>Delivery to</span><button onClick={onEditDelivery} className="text-primary">Edit</button></div><p className="mt-3">{address.firstName} {address.lastName}<br />{address.line1}<br />{address.city}, {address.state} {address.postalCode}</p></div><div className="sm:border-l sm:border-outline-variant/30 sm:pl-6"><div className="flex justify-between text-xs uppercase tracking-wider"><span>Schedule</span><button onClick={onEditDelivery} className="text-primary">Edit</button></div><p className="mt-3 flex gap-2"><CalendarDays className="h-5 w-5 text-primary" />{deliveryDate}<br />{deliverySlot}</p><button onClick={onEditPayment} className="mt-4 text-sm text-primary underline">Edit payment</button></div></div></div></section>;
}

function OrderSummary({ step, subtotal, delivery, discount, tax, total, promo, promoApplied, onPromoChange, onPromoApply, onContinue, submitting }: { step: number; subtotal: number; delivery: number; discount: number; tax: number; total: number; promo: string; promoApplied: boolean; onPromoChange: (value: string) => void; onPromoApply: () => void; onContinue: () => void; submitting: boolean }) {
  return <div className="rounded-2xl bg-surface-container-lowest p-7 shadow-[0_10px_30px_rgba(44,62,42,0.12)]"><h2 className="border-b border-outline-variant/30 pb-5 font-serif text-2xl font-semibold">Order Summary</h2><div className="space-y-4 py-5">{orderItems.map((item) => <div key={item.name} className="flex gap-4"><div className="relative h-20 w-20 overflow-hidden rounded-lg"><Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" /></div><div className="min-w-0 flex-1"><span className="text-xs uppercase tracking-wider text-on-surface-variant">{item.name.includes("Chocolate") ? "Add-on" : "Arrangement"}</span><strong className="block text-lg">{item.name}</strong><span className="text-sm text-on-surface-variant">{item.detail}</span></div><span className="text-sm">${item.price.toFixed(2)}</span></div>)}</div>{step === 0 && <div className="mb-5 flex rounded-full border border-outline-variant bg-surface-container-low px-4"><input value={promo} onChange={(event) => onPromoChange(event.target.value)} placeholder="Promo code" className="h-11 min-w-0 flex-1 bg-transparent outline-none" /><button onClick={onPromoApply} className="text-sm text-primary">{promoApplied ? "Applied" : "Apply"}</button></div>}<dl className="space-y-4 border-y border-outline-variant/30 py-5"><SummaryRow label="Subtotal" value={subtotal} /><SummaryRow label="Delivery Fee" value={delivery} />{promoApplied && <SummaryRow label="Discount" value={-discount} accent />}<SummaryRow label="Taxes" value={tax} /></dl><div className="flex items-end justify-between py-6"><span className="font-serif text-2xl font-semibold">Total</span><strong className="font-serif text-4xl text-primary">${total.toFixed(2)}</strong></div><Button disabled={submitting || (step === 0 && !promoApplied && false)} onClick={onContinue} className="h-14 w-full rounded-full bg-primary text-on-primary hover:bg-primary/90">{step === 0 ? "Continue to Payment" : step === 1 ? "Review Order" : submitting ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}<ArrowRight className="h-4 w-4" /></Button><p className="mt-5 flex items-center justify-center gap-2 text-xs"><LockKeyhole className="h-4 w-4" />Secure, encrypted checkout</p></div>;
}

function SummaryRow({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) { return <div className={`flex justify-between ${accent ? "text-primary" : ""}`}><dt>{label}</dt><dd>${value.toFixed(2)}</dd></div>; }

function Confirmation({ total, address, deliveryDate, deliverySlot }: { total: number; address: Record<string, string>; deliveryDate: string; deliverySlot: string }) {
  return <div className="mx-auto w-full max-w-[1000px] px-4 py-16 text-center md:py-24"><div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-lg"><Check className="h-14 w-14" /></div><p className="mt-7 text-xs uppercase tracking-[0.2em]">Order #ORD-9025</p><h1 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">Order Confirmed!</h1><p className="mx-auto mt-5 max-w-2xl text-on-surface-variant">Thank you for choosing Bloom & Stem. Your artisanal arrangement is being carefully prepared.</p><div className="mt-8 flex justify-center gap-3"><Button render={<Link href="/orders" />} className="h-12 rounded-full bg-primary px-7 text-on-primary">Track Your Order</Button><Button render={<Link href="/products" />} variant="outline" className="h-12 rounded-full px-7">Continue Shopping</Button></div><div className="mt-14 grid gap-6 text-left md:grid-cols-[1.5fr_1fr]"><div className="rounded-2xl bg-surface-container-lowest p-7 shadow-sm"><div className="mb-5 flex justify-between"><h2 className="font-serif text-2xl font-semibold">Order Summary</h2><span>2 Items</span></div>{orderItems.map((item) => <div key={item.name} className="flex items-center gap-4 border-t border-outline-variant/30 py-5"><div className="relative h-24 w-24 overflow-hidden rounded-lg"><Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" /></div><div className="flex-1"><strong className="font-serif text-xl">{item.name}</strong><p className="text-sm text-on-surface-variant">{item.detail}</p></div><span>${item.price.toFixed(2)}</span></div>)}</div><div className="space-y-6"><div className="rounded-2xl bg-primary-fixed p-7"><h2 className="flex items-center gap-2 font-serif text-2xl font-semibold"><Truck className="h-6 w-6" />Delivery Details</h2><p className="mt-5 text-xs uppercase tracking-wider">Date & Time</p><p>{deliveryDate}<br />{deliverySlot}</p><p className="mt-5 text-xs uppercase tracking-wider">Recipient</p><p>{address.firstName} {address.lastName}<br />{address.line1}<br />{address.city}, {address.state} {address.postalCode}</p></div><div className="rounded-2xl bg-surface-container-lowest p-7 shadow-sm"><h2 className="font-serif text-2xl font-semibold">Receipt</h2><dl className="mt-5 space-y-3"><SummaryRow label="Total" value={total} /></dl></div></div></div><div className="mt-16 grid gap-8 border-t border-outline-variant/30 pt-10 text-left md:grid-cols-3"><Trust icon={ShieldCheck} title="Secure Checkout" /><Trust icon={Leaf} title="Freshness Guarantee" /><Trust icon={Headphones} title="Expert Support" /></div></div>;
}

function Trust({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) { return <div><Icon className="h-6 w-6 text-primary" /><h3 className="mt-3 font-serif text-xl font-semibold">{title}</h3><p className="mt-1 text-sm text-on-surface-variant">Your experience is protected and supported.</p></div>; }
