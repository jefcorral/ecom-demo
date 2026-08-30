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
const checkoutActionClass = "h-14 bg-primary-container hover:bg-primary-fixed text-on-primary-container font-label-md text-body-md font-bold uppercase tracking-widest rounded-full transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2";

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [orderSummaryOpen, setOrderSummaryOpen] = useState(false);
  const [sameAsDelivery, setSameAsDelivery] = useState(true);
  const [giftNoteOpen, setGiftNoteOpen] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [minimumDeliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  });
  const [deliveryDate, setDeliveryDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  });
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return new Date(date.getFullYear(), date.getMonth(), 1);
  });
  const [deliverySlot, setDeliverySlot] = useState("afternoon");
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
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
  const calendarLabel = calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstWeekday = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarDays = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index < firstWeekday ? null : index - firstWeekday + 1);

  function selectCalendarDate(day: number) {
    const date = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day, 12);
    setDeliveryDate(date.toISOString().split("T")[0]);
  }

  function changeCalendarMonth(offset: number) {
    setCalendarMonth((month) => new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

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

        <div className="-mx-6 mb-8 border-y border-outline-variant/30 bg-surface-container-lowest lg:hidden">
          <button type="button" aria-expanded={orderSummaryOpen} aria-controls="mobile-order-summary" onClick={() => setOrderSummaryOpen((open) => !open)} className="flex w-full items-center justify-between px-6 py-5 text-left active:scale-[0.98] transition-transform">
            <span><strong className="block font-medium">Your order (2 items)</strong><span className="text-sm text-on-surface-variant">{orderSummaryOpen ? "Hide details" : "Review details"}</span></span>
            <span className="flex items-center gap-3 font-serif text-xl">${total.toFixed(2)}<ChevronDown className={`h-4 w-4 transition-transform duration-300 ${orderSummaryOpen ? "rotate-180" : ""}`} /></span>
          </button>
          <div id="mobile-order-summary" className={`overflow-hidden px-6 transition-all duration-300 ${orderSummaryOpen ? "max-h-[600px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
            <div className="flex flex-col gap-md border-t border-outline-variant/30 pt-lg">
              {orderItems.map((item) => (
                <div key={item.name} className="flex items-center gap-md">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-surface-container"><Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" /></div>
                  <div className="min-w-0 flex-1"><strong className="block truncate text-sm">{item.name}</strong><span className="block truncate text-xs text-on-surface-variant">{item.detail}</span></div>
                  <span className="shrink-0 text-sm">${item.price.toFixed(2)}</span>
                </div>
              ))}
              <dl className="space-y-2 border-t border-outline-variant/30 pt-4 text-sm"><SummaryRow label="Subtotal" value={subtotal} /><SummaryRow label="Delivery Fee" value={delivery} />{promoApplied && <SummaryRow label="Discount (BLOOM15)" value={-discount} accent />}<SummaryRow label="Taxes" value={tax} /></dl>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl relative items-start">
          <main className="flex flex-col gap-xl lg:col-span-7">
            {step === 0 && (
              <form onSubmit={continueToPayment} className="flex flex-col gap-xl">
                <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mb-md">Delivery Details</h1>
                <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm" aria-labelledby="recipient-title">
                  <h2 id="recipient-title" className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm"><CircleUserRound className="h-5 w-5 text-primary" />Recipient Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <Field label="First Name" placeholder="Jane" value={address.firstName} onChange={(value) => updateAddress("firstName", value)} required />
                    <Field label="Last Name" placeholder="Doe" value={address.lastName} onChange={(value) => updateAddress("lastName", value)} required />
                    <Field label="Phone Number" placeholder="(555) 123-4567" type="tel" value={address.phone} onChange={(value) => updateAddress("phone", value)} className="md:col-span-2" />
                    <Field label="Street Address" placeholder="123 Floral Way, Apt 4B" value={address.line1} onChange={(value) => updateAddress("line1", value)} required className="md:col-span-2" />
                    <Field label="City" placeholder="New York" value={address.city} onChange={(value) => updateAddress("city", value)} required />
                    <div className="grid grid-cols-2 gap-md">
                      <label className="flex flex-col gap-xs"><span className="font-label-sm text-label-sm text-on-surface-variant ml-sm">State</span><select value={address.state} onChange={(event) => updateAddress("state", event.target.value)} className="w-full bg-surface rounded-full px-md py-sm text-body-md font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary transition-shadow appearance-none cursor-pointer"><option value="">State</option><option>NY</option><option>CA</option></select></label>
                      <Field label="Zip" placeholder="10001" value={address.postalCode} onChange={(value) => updateAddress("postalCode", value)} required />
                    </div>
                  </div>
                </section>

                <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm" aria-labelledby="timing-title">
                  <h2 id="timing-title" className="font-headline-md text-headline-md text-on-surface mb-lg flex items-center gap-sm"><CalendarDays className="h-5 w-5 text-primary" />Delivery Timing</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div>
                      <label className="mb-sm ml-sm block text-xs font-semibold text-on-surface-variant">Select Date</label>
                      <input type="date" min={minimumDeliveryDate} value={deliveryDate} onChange={(event) => { setDeliveryDate(event.target.value); const date = new Date(`${event.target.value}T12:00:00`); setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1)); }} className={`${fieldClass} md:hidden`} required />
                      <div className="hidden rounded-xl bg-surface p-sm md:block">
                        <div className="mb-sm flex items-center justify-between px-sm"><button type="button" aria-label="Previous month" onClick={() => changeCalendarMonth(-1)} className="h-8 w-8 transition hover:scale-95 hover:text-primary">‹</button><span className="text-sm font-medium">{calendarLabel}</span><button type="button" aria-label="Next month" onClick={() => changeCalendarMonth(1)} className="h-8 w-8 transition hover:scale-95 hover:text-primary">›</button></div>
                        <div className="mb-xs grid grid-cols-7 gap-xs text-center text-[10px] text-on-surface-variant">{"SMTWTFS".split("").map((day, index) => <span key={`${day}-${index}`}>{day}</span>)}</div>
                        <div className="grid grid-cols-7 gap-xs text-center">{calendarDays.map((day, index) => {
                          if (!day) return <span key={`blank-${index}`} />;
                          const value = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                          const selected = deliveryDate === value;
                          const disabled = value < minimumDeliveryDate;
                          return <button key={value} type="button" disabled={disabled} onClick={() => selectCalendarDate(day)} className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${selected ? "bg-primary text-on-primary shadow-sm" : disabled ? "text-outline-variant" : "text-on-surface hover:scale-95 hover:bg-surface-container-highest"}`}>{day}</button>;
                        })}</div>
                      </div>
                    </div>
                    <fieldset><legend className="mb-2 text-sm font-medium">Select Time Window</legend><div className="space-y-2">{[["morning", "Morning (8am - 12pm)"], ["afternoon", "Afternoon (12pm - 4pm)"], ["evening", "Evening (4pm - 8pm)"]].map(([value, label]) => <button key={value} type="button" aria-pressed={deliverySlot === value} onClick={() => setDeliverySlot(value)} className={`flex h-12 w-full items-center justify-between rounded-xl px-4 text-left transition ${deliverySlot === value ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container"}`}><span>{label}</span><span className={`h-5 w-5 rounded-full border ${deliverySlot === value ? "border-[6px] border-primary" : "border-outline-variant"}`} /></button>)}</div></fieldset>
                  </div>
                </section>

                <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm">
                  <button type="button" onClick={() => setGiftNoteOpen((value) => !value)} className="w-full flex items-center justify-between focus:outline-none group transform hover:scale-98 transition-transform"><span className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">Add a Gift Note</span><span className="text-2xl font-normal text-on-surface-variant group-hover:text-primary">{giftNoteOpen ? "−" : "+"}</span></button>
                  {giftNoteOpen && <div className="relative mt-4"><textarea value={giftNote} maxLength={200} onChange={(event) => setGiftNote(event.target.value)} className="min-h-28 w-full resize-none rounded-xl border border-outline-variant bg-surface-container-low p-4 pb-8 focus:border-primary focus:outline-none" placeholder="Write a heartfelt message..." /><span className="absolute bottom-3 right-3 text-xs text-on-surface-variant">{giftNote.length}/200</span></div>}
                </section>

                <Button type="submit" disabled={!deliveryComplete} className={`${checkoutActionClass} mt-8 w-full lg:hidden`}>Continue to Payment</Button>
              </form>
            )}

            {step === 1 && <><PaymentStep address={address} sameAsDelivery={sameAsDelivery} setSameAsDelivery={setSameAsDelivery} paymentError={paymentError} errorRef={errorRef} onContinue={() => setStep(2)} onError={() => { setPaymentError("Payment could not be processed. Check your details and try again."); setTimeout(() => errorRef.current?.focus(), 0); }} /><ReviewStep address={address} deliveryDate={deliveryDate} deliverySlot={deliverySlot} onEditDelivery={() => setStep(0)} onEditPayment={() => setStep(1)} /></>}
            {step === 2 && <ReviewStep address={address} deliveryDate={deliveryDate} deliverySlot={deliverySlot} onEditDelivery={() => setStep(0)} onEditPayment={() => setStep(1)} />}
          </main>

          <aside className="relative hidden lg:sticky lg:top-28 lg:col-span-5 lg:block"><OrderSummary step={step} subtotal={subtotal} delivery={delivery} discount={discount} tax={tax} total={total} promo={promo} promoApplied={promoApplied} onPromoChange={setPromo} onPromoApply={() => { if (promoApplied) { setPromoApplied(false); setPromo(""); } else { setPromoApplied(promo.trim().toUpperCase() === "BLOOM15"); } }} onContinue={() => step === 0 ? deliveryComplete && setStep(1) : step === 1 ? setStep(2) : placeOrder()} submitting={submitting} /></aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-outline-variant/30 bg-surface/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4"><div><span className="block text-xs font-medium text-on-surface-variant">Total Amount</span><strong className="font-serif text-2xl">${total.toFixed(2)}</strong></div><Button disabled={(step === 0 && !deliveryComplete) || submitting} onClick={() => step === 0 ? setStep(1) : step === 1 ? setStep(2) : placeOrder()} className={`${checkoutActionClass} min-w-52 px-6`}>{step === 0 ? "Continue to Payment" : step === 1 ? "Review Order" : submitting ? "Placing Order..." : "Complete Order"}</Button></div>
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

function Field({ label, placeholder = "", value, onChange, required = false, type = "text", className = "" }: { label: string; placeholder?: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; className?: string }) {
  const id = label.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-");
  return <label htmlFor={id} className={`flex flex-col gap-xs ${className}`}><span className="font-label-sm text-label-sm text-on-surface-variant ml-sm">{label}</span><input id={id} type={type} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} required={required} className="w-full bg-surface rounded-full px-md py-sm text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow" /></label>;
}

function PaymentStep({ address, sameAsDelivery, setSameAsDelivery, paymentError, errorRef, onContinue, onError }: { address: Record<string, string>; sameAsDelivery: boolean; setSameAsDelivery: (value: boolean) => void; paymentError: string; errorRef: React.RefObject<HTMLDivElement>; onContinue: () => void; onError: () => void }) {
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "", name: `${address.firstName} ${address.lastName}`.trim() });
  return <section><h1 className="font-serif text-3xl font-semibold md:text-4xl">Payment Method</h1><p className="mt-2 text-on-surface-variant">All transactions are secure and encrypted.</p>{paymentError && <div ref={errorRef} tabIndex={-1} role="alert" className="mt-6 rounded-xl bg-error-container p-4 text-sm text-on-error-container outline-none"><strong className="block">Payment could not be processed</strong>{paymentError}<button type="button" onClick={onError} className="ml-2 font-semibold underline">Try Again</button></div>}<div className="mt-8 rounded-2xl bg-surface-container-lowest p-6 shadow-sm"><div className="mb-6 flex gap-4 border-b border-outline-variant/30 pb-5"><span className="flex items-center gap-2 rounded-full bg-surface-container px-4 py-2 text-sm"><CreditCard className="h-4 w-4" />Credit Card</span><span className="px-4 py-2 text-sm">PayPal</span></div><div className="grid gap-4 sm:grid-cols-2"><Field label="Card Number" value={card.number} onChange={(value) => setCard((current) => ({ ...current, number: value }))} className="sm:col-span-2" /><Field label="Expiry Date" value={card.expiry} onChange={(value) => setCard((current) => ({ ...current, expiry: value }))} /><Field label="CVC" value={card.cvc} onChange={(value) => setCard((current) => ({ ...current, cvc: value }))} /><Field label="Name on Card" value={card.name} onChange={(value) => setCard((current) => ({ ...current, name: value }))} className="sm:col-span-2" /></div><label className="mt-5 flex min-h-11 items-center gap-3"><input type="checkbox" checked={sameAsDelivery} onChange={(event) => setSameAsDelivery(event.target.checked)} className="h-5 w-5 accent-primary" />Billing address is same as delivery address</label><div className="mt-6 flex items-center gap-3 text-xs text-on-surface-variant"><ShieldCheck className="h-5 w-5 text-primary" />PCI DSS compliant payment form placeholder. Stripe Elements remains the production payment provider.</div><div className="mt-6 flex gap-3"><Button type="button" variant="outline" onClick={onError} className="h-12 flex-1 rounded-full">Simulate Error</Button><Button type="button" onClick={onContinue} className={`${checkoutActionClass} flex-1`}>Review Order</Button></div></div></section>;
}

function ReviewStep({ address, deliveryDate, deliverySlot, onEditDelivery, onEditPayment }: { address: Record<string, string>; deliveryDate: string; deliverySlot: string; onEditDelivery: () => void; onEditPayment: () => void }) {
  return <section><h1 className="mb-8 font-serif text-3xl font-semibold md:text-4xl">Review Your Order</h1><div className="rounded-2xl bg-surface-container-lowest p-6 shadow-sm"><div className="mb-5 flex justify-between text-xs uppercase tracking-wider"><span>Items (2)</span><Link href="/cart" className="text-primary">Edit Cart</Link></div>{orderItems.map((item) => <div key={item.name} className="flex items-center gap-4 border-b border-outline-variant/30 py-4"><div className="relative h-16 w-16 overflow-hidden rounded-lg"><Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" /></div><div className="flex-1"><strong>{item.name}</strong><p className="text-sm text-on-surface-variant">{item.detail}</p></div><span>${item.price.toFixed(2)}</span></div>)}<div className="mt-6 grid gap-6 sm:grid-cols-2"><div><div className="flex justify-between text-xs uppercase tracking-wider"><span>Delivery to</span><button onClick={onEditDelivery} className="text-primary">Edit</button></div><p className="mt-3">{address.firstName} {address.lastName}<br />{address.line1}<br />{address.city}, {address.state} {address.postalCode}</p></div><div className="sm:border-l sm:border-outline-variant/30 sm:pl-6"><div className="flex justify-between text-xs uppercase tracking-wider"><span>Schedule</span><button onClick={onEditDelivery} className="text-primary">Edit</button></div><p className="mt-3 flex gap-2"><CalendarDays className="h-5 w-5 text-primary" />{deliveryDate}<br />{deliverySlot}</p><button onClick={onEditPayment} className="mt-4 text-sm text-primary underline">Edit payment</button></div></div></div></section>;
}

function OrderSummary({ step, subtotal, delivery, discount, tax, total, promo, promoApplied, onPromoChange, onPromoApply, onContinue, submitting }: { step: number; subtotal: number; delivery: number; discount: number; tax: number; total: number; promo: string; promoApplied: boolean; onPromoChange: (value: string) => void; onPromoApply: () => void; onContinue: () => void; submitting: boolean }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg shadow-md flex flex-col gap-lg">
      <h2 className="font-headline-md text-headline-md text-on-surface border-b-2 border-surface-container-high pb-sm">Order Summary</h2>
      <div className="flex flex-col gap-md">
        {orderItems.map((item) => (
          <div key={item.name} className="flex items-start gap-md">
            <div className="w-20 h-24 rounded-lg bg-surface-container overflow-hidden shrink-0 shadow-sm relative"><Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover absolute inset-0" /></div>
            <div className="flex-1 flex flex-col pt-xs"><span className="font-label-md text-on-surface-variant uppercase tracking-wider text-[10px] mb-1">{item.name.includes("Chocolate") ? "Add-On" : "Arrangement"}</span><h3 className="font-serif text-headline-md text-on-surface leading-tight">{item.name}</h3><span className="font-body-md text-body-md text-on-surface-variant mt-sm">{item.detail}</span></div>
            <span className="font-label-md text-label-md text-on-surface pt-xs">${item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>
      {step === 0 && <div className="flex items-center gap-sm bg-surface rounded-full p-1 pl-md shadow-sm border border-outline-variant/30"><input value={promo} onChange={(event) => onPromoChange(event.target.value)} placeholder="Promo code" className="flex-1 bg-transparent text-body-md font-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none" /><button onClick={onPromoApply} className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-label-md text-label-md hover:bg-secondary-container/80 transition-colors transform hover:scale-95">{promoApplied ? "Remove" : "Apply"}</button></div>}
      <dl className="flex flex-col gap-sm pt-md border-t border-outline-variant/30"><SummaryRow label="Subtotal" value={subtotal} /><SummaryRow label="Delivery Fee" value={delivery} />{promoApplied && <SummaryRow label="Discount (BLOOM15)" value={-discount} accent />}<SummaryRow label="Taxes" value={tax} /><div className="flex justify-between items-end mt-sm pt-sm border-t-2 border-surface-container-high"><dt className="font-headline-md text-headline-md text-on-surface">Total</dt><dd className="font-serif text-display-lg text-primary tracking-tight">${total.toFixed(2)}</dd></div></dl>
      <Button disabled={submitting} onClick={onContinue} className={`${checkoutActionClass} mt-md w-full`}>{step === 0 ? "Continue to Payment" : step === 1 ? "Review Order" : submitting ? "Placing Order..." : `Place Order — $${total.toFixed(2)}`}<ArrowRight className="h-4 w-4" /></Button>
      <div className="flex items-center justify-center gap-xs text-on-surface-variant font-label-sm text-label-sm"><LockKeyhole className="h-3.5 w-3.5" />Secure, encrypted checkout</div>
    </div>
  );
}

function SummaryRow({ label, value, accent = false }: { label: string; value: number; accent?: boolean }) { return <div className={`flex justify-between ${accent ? "text-primary" : ""}`}><dt>{label}</dt><dd>${value.toFixed(2)}</dd></div>; }

function Confirmation({ total, address, deliveryDate, deliverySlot }: { total: number; address: Record<string, string>; deliveryDate: string; deliverySlot: string }) {
  return <div className="mx-auto w-full max-w-[1000px] px-4 py-16 text-center md:py-24"><div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-primary-container text-on-primary-container shadow-lg"><Check className="h-14 w-14" /></div><p className="mt-7 text-xs uppercase tracking-[0.2em]">Order #ORD-9025</p><h1 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">Order Confirmed!</h1><p className="mx-auto mt-5 max-w-2xl text-on-surface-variant">Thank you for choosing Bloom & Stem. Your artisanal arrangement is being carefully prepared.</p><div className="mt-8 flex justify-center gap-3"><Button render={<Link href="/orders" />} className={`${checkoutActionClass} px-7`}>Track Your Order</Button><Button render={<Link href="/products" />} variant="outline" className="h-12 rounded-full px-7">Continue Shopping</Button></div><div className="mt-14 grid gap-6 text-left md:grid-cols-[1.5fr_1fr]"><div className="rounded-2xl bg-surface-container-lowest p-7 shadow-sm"><div className="mb-5 flex justify-between"><h2 className="font-serif text-2xl font-semibold">Order Summary</h2><span>2 Items</span></div>{orderItems.map((item) => <div key={item.name} className="flex items-center gap-4 border-t border-outline-variant/30 py-5"><div className="relative h-24 w-24 overflow-hidden rounded-lg"><Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" /></div><div className="flex-1"><strong className="font-serif text-xl">{item.name}</strong><p className="text-sm text-on-surface-variant">{item.detail}</p></div><span>${item.price.toFixed(2)}</span></div>)}</div><div className="space-y-6"><div className="rounded-2xl bg-primary-fixed p-7"><h2 className="flex items-center gap-2 font-serif text-2xl font-semibold"><Truck className="h-6 w-6" />Delivery Details</h2><p className="mt-5 text-xs uppercase tracking-wider">Date & Time</p><p>{deliveryDate}<br />{deliverySlot}</p><p className="mt-5 text-xs uppercase tracking-wider">Recipient</p><p>{address.firstName} {address.lastName}<br />{address.line1}<br />{address.city}, {address.state} {address.postalCode}</p></div><div className="rounded-2xl bg-surface-container-lowest p-7 shadow-sm"><h2 className="font-serif text-2xl font-semibold">Receipt</h2><dl className="mt-5 space-y-3"><SummaryRow label="Total" value={total} /></dl></div></div></div><div className="mt-16 grid gap-8 border-t border-outline-variant/30 pt-10 text-left md:grid-cols-3"><Trust icon={ShieldCheck} title="Secure Checkout" /><Trust icon={Leaf} title="Freshness Guarantee" /><Trust icon={Headphones} title="Expert Support" /></div></div>;
}

function Trust({ icon: Icon, title }: { icon: React.ComponentType<{ className?: string }>; title: string }) { return <div><Icon className="h-6 w-6 text-primary" /><h3 className="mt-3 font-serif text-xl font-semibold">{title}</h3><p className="mt-1 text-sm text-on-surface-variant">Your experience is protected and supported.</p></div>; }
