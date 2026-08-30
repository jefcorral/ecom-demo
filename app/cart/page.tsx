"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Gift, Info, Leaf, LockKeyhole, Minus, PackageOpen, Plus, ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockProducts } from "@/lib/mock-data";

const initialItems = [
  {
    id: "cart-1",
    product: mockProducts[0],
    name: "Garden Rose & Peony Bouquet",
    image: "https://lh3.googleusercontent.com/aida/AEtjO1WIFT30l0NvUsHmUEmV-6IGcPU4MN56IFgOgEP1Kq_KBySyi7LHQcz2mZOU3o-qQficFESGoJ9xVhfayNsF13vNF40h0p2wqOqoYj1W7YyW1cbNvgAKn9D0JVlCa6eiaoe2FBCc3XoJqF4opcv8TN03C_m9TeP4U2ilmmX8mAKs-ILAkjX5ssOQZabOHNF__cu2fGmxc4sy4McDbXJpd3ItLYneYvp42Yb3zyPuzwDrvsfpgGvn20ZBpw",
    price: 86,
    stock: 8,
    quantity: 2,
    variant: "Luxe",
    note: "Gift note included",
    delivery: "Fri, May 9 Morning",
  },
  {
    id: "cart-2",
    product: mockProducts[5],
    name: "Artisan Chocolates",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6PqPJ8XNwyWobzSPsIIs8c3KKCjPeFFwGNq0tbd6xMCg5ubZMhStdQT-r80v7eL_snqDc0Rf5L6zjGCzQKzo-YmUHvDMUYz_hn6IuCkY3GYIvvMKsTixn6U75G4HdMi0B-X_uW86Cx21VFv4Mz03FMQSKSuFHLHboFC6kgGQBH9YhKY-f6-np3-QxAeXFenXVbVp3Pct9cBCYsMxAeL2LXvi7nWWrBP99Tzeo6MfTNLkr55C56cjZ",
    price: 18,
    stock: 20,
    quantity: 1,
    variant: "12-piece assortment",
  },
  {
    id: "cart-3",
    product: mockProducts[7],
    name: "Spring Tulip Arrangement",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3Jcl6rZ9PnIaMz1vNDOhlUsruyPpXqk6Gjhh7K79_Eph--HBz_2H5O_ZZP08daL-F9hyJx1T-Qmx-KI8eQZ_WSzCf1AWqfpbXPu0eI08ewz3BRUdAshS526CeIlxCGKG2CVX4GsHWgMHHTS4FYT6n-LWkxZNRWpWTqv39RrtX877yjQ_Y87zjMkHPCMzjTXabdwTjHuojMbz7s_oDn-VGGF95tSsv7Mcq8I3n92jQ5eaVPtgT7GTs",
    price: 54,
    stock: 2,
    quantity: 1,
    variant: "Classic",
  },
];

const addOns = [
  { id: "vase", name: "Glass Vase", price: 15, image: "/product-detail/bouquet-main.png" },
  { id: "balloon", name: "Mylar Balloon", price: 8, image: "/product-detail/peony-detail.png" },
  { id: "card", name: "Premium Card", price: 5, image: "/product-detail/packaging.png" },
  { id: "wrap", name: "Gift Wrap", price: 10, image: "/product-detail/lifestyle.png" },
];

type CartItem = (typeof initialItems)[number];

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0) + addOns.filter((addOn) => selectedAddOns.includes(addOn.id)).reduce((sum, addOn) => sum + addOn.price, 0), [items, selectedAddOns]);
  const estimatedTax = subtotal * 0.0815;
  const total = subtotal + estimatedTax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  function updateQuantity(id: string, quantity: number) {
    setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, Math.min(item.stock, quantity)) } : item));
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function addExtra(addOnId: string) {
    setSelectedAddOns((current) => current.includes(addOnId) ? current.filter((id) => id !== addOnId) : [...current, addOnId]);
  }

  if (items.length === 0) {
    return <EmptyCart onRestore={() => setItems(initialItems)} />;
  }

  return (
    <div className="pb-40 lg:pb-0">
      <div className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-16">
        <Link href="/products" className="mb-10 hidden items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-primary md:flex">
          <ArrowLeft className="h-4 w-4" />Continue shopping
        </Link>

        <div className="relative flex flex-col items-start gap-10 lg:flex-row lg:gap-16">
          <section className="w-full lg:w-[65%]" aria-labelledby="cart-title">
            <div className="mb-6 flex items-end justify-between">
              <h1 id="cart-title" className="font-serif text-3xl font-semibold text-primary md:text-4xl">Your <span className="md:hidden">Bag</span><span className="hidden md:inline">Cart</span></h1>
              <span className="text-sm text-on-surface-variant md:font-serif md:text-xl">{itemCount} {itemCount === 1 ? "item" : "items"}</span>
            </div>

            <div className="divide-y divide-outline-variant/30 md:flex md:flex-col md:gap-6 md:divide-y-0">
              {items.map((item) => (
                <CartLineItem key={item.id} item={item} onQuantityChange={updateQuantity} onRemove={removeItem} />
              ))}
            </div>

            <section className="-mx-4 mt-12 bg-surface-container-low px-4 py-8 md:mx-0 md:bg-transparent md:px-0 md:py-0" aria-labelledby="add-ons-heading">
              <h2 id="add-ons-heading" className="mb-6 font-serif text-2xl font-semibold text-primary">Complete Your Gift</h2>
              <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:px-0">
                {addOns.map((addOn) => {
                  const selected = selectedAddOns.includes(addOn.id);
                  return (
                    <article key={addOn.id} className={`w-[148px] shrink-0 snap-start rounded-xl bg-surface-container-lowest p-2 shadow-sm transition md:w-auto md:p-4 ${selected ? "ring-2 ring-primary" : ""}`}>
                      <div className="relative aspect-square overflow-hidden rounded-lg md:mx-auto md:h-16 md:w-16 md:rounded-full">
                        <Image src={addOn.image} alt={addOn.name} fill sizes="148px" className="object-cover" />
                      </div>
                      <h3 className="mt-2 truncate text-sm font-medium md:text-center">{addOn.name}</h3>
                      <p className="text-xs font-semibold text-primary md:text-center">+${addOn.price.toFixed(2)}</p>
                      <Button type="button" onClick={() => addExtra(addOn.id)} className={`mt-3 h-9 w-full rounded-full text-xs ${selected ? "bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80" : "bg-primary-container text-on-primary-container hover:bg-primary-fixed"}`}>
                        {selected ? <><Check className="h-4 w-4" />Added</> : "Add"}
                      </Button>
                    </article>
                  );
                })}
              </div>
            </section>
          </section>

          <aside className="w-full lg:sticky lg:top-24 lg:w-[35%]" aria-label="Order summary">
            <OrderSummary itemCount={itemCount} subtotal={subtotal} estimatedTax={estimatedTax} total={total} />
          </aside>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-outline-variant/30 bg-surface/95 px-4 py-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <div><span className="block text-xs text-on-surface-variant">Total</span><strong className="font-serif text-2xl text-on-surface">${total.toFixed(2)}</strong></div>
          <Button render={<Link href="/checkout" />} className="h-12 min-w-40 rounded-full bg-primary text-on-primary shadow-md hover:bg-primary/90">Checkout <ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function CartLineItem({ item, onQuantityChange, onRemove }: { item: CartItem; onQuantityChange: (id: string, quantity: number) => void; onRemove: (id: string) => void }) {
  const price = item.price;
  const lowStock = item.stock <= 2;

  return (
    <article className="group relative flex flex-col gap-lg overflow-hidden rounded-xl bg-surface-container-lowest p-lg shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      <Link href={`/products/${item.product.id}`} className="relative h-[140px] w-full shrink-0 overflow-hidden rounded-lg bg-surface-container sm:w-[140px]">
        {item.image ? <Image src={item.image} alt={item.name} fill unoptimized sizes="140px" className="object-cover transition-transform duration-700 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center"><Gift className="h-8 w-8 text-outline-variant" /></div>}
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-lg font-semibold text-on-surface"><Link href={`/products/${item.product.id}`} className="hover:text-primary">{item.name}</Link></h3>
            <p className="mt-1 text-base text-on-surface-variant">{item.variant.includes("assortment") ? item.variant : `Size: ${item.variant}`}</p>
            {item.delivery && <p className="mt-3 flex w-fit items-center gap-2 rounded-full bg-surface-container px-3 py-1 text-xs text-primary-container"><Truck className="h-3.5 w-3.5" />{item.delivery}</p>}
            {item.note && <p className="mt-2 flex items-center gap-2 text-xs text-on-surface-variant"><Gift className="h-3.5 w-3.5" />{item.note}</p>}
            {lowStock && <p className="mt-2 flex w-fit items-center gap-1 text-xs text-error"><Info className="h-3.5 w-3.5" />Only {item.stock} left</p>}
          </div>
          <strong className="whitespace-nowrap text-base font-semibold">${(price * item.quantity).toFixed(2)}</strong>
        </div>
        <div className="relative mt-4 flex items-center justify-between pt-4 before:absolute before:left-0 before:top-0 before:h-px before:w-full before:bg-outline-variant/30 sm:mt-0">
          <QuantityControl value={item.quantity} max={item.stock} onChange={(quantity) => onQuantityChange(item.id, quantity)} />
          <button type="button" aria-label={`Remove ${item.name}`} onClick={() => onRemove(item.id)} className="text-xs uppercase tracking-widest text-on-surface-variant underline decoration-outline-variant underline-offset-4 transition-colors hover:text-error hover:decoration-error">Remove</button>
        </div>
      </div>
    </article>
  );
}

function QuantityControl({ value, max, onChange }: { value: number; max: number; onChange: (value: number) => void }) {
  return (
    <div className="flex h-10 items-center rounded-full bg-surface-container px-1">
      <button type="button" aria-label="Decrease quantity" disabled={value <= 1} onClick={() => onChange(value - 1)} className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-surface-container-high disabled:opacity-30"><Minus className="h-4 w-4" /></button>
      <span className="w-7 text-center text-sm" aria-live="polite">{value}</span>
      <button type="button" aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)} className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-surface-container-high disabled:opacity-30"><Plus className="h-4 w-4" /></button>
    </div>
  );
}

function OrderSummary({ itemCount, subtotal, estimatedTax, total }: { itemCount: number; subtotal: number; estimatedTax: number; total: number }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-6 shadow-[0_12px_30px_rgba(44,62,42,0.12)] lg:p-7">
      <h2 className="mb-7 font-serif text-2xl font-semibold text-primary">Order Summary</h2>
      <dl className="space-y-5 text-sm md:text-base">
        <div className="flex justify-between"><dt className="text-on-surface-variant">Subtotal ({itemCount} items)</dt><dd className="font-semibold">${subtotal.toFixed(2)}</dd></div>
        <div className="flex justify-between"><dt className="text-on-surface-variant">Estimated Tax</dt><dd className="font-semibold">${estimatedTax.toFixed(2)}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-on-surface-variant">Shipping</dt><dd className="text-right text-xs uppercase tracking-widest">Calculated at checkout</dd></div>
      </dl>
      <div className="my-7 flex items-end justify-between border-t border-outline-variant/30 pt-5"><span className="font-semibold">Total</span><strong className="font-serif text-3xl text-primary">${total.toFixed(2)}</strong></div>
      <Button render={<Link href="/checkout" />} className="hidden h-14 w-full rounded-full bg-primary-container font-bold uppercase tracking-widest text-on-primary-container shadow-md hover:bg-primary-fixed lg:flex">Proceed to Checkout <ArrowRight className="h-5 w-5" /></Button>
      <div className="mt-6 rounded-xl bg-surface-container p-4 text-xs leading-5 text-on-surface-variant lg:hidden"><Info className="mr-2 inline h-4 w-4 text-primary" />Deliveries are made between 9am and 5pm. Specific time requests cannot be guaranteed.</div>
      <div className="mt-6 hidden justify-center gap-8 text-on-surface-variant lg:flex"><TrustBadge icon={LockKeyhole} label="Secure" /><TrustBadge icon={Truck} label="Tracked" /><TrustBadge icon={Leaf} label="Fresh" /></div>
    </div>
  );
}

function TrustBadge({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return <div className="flex flex-col items-center gap-1 text-[10px] uppercase tracking-wider"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container"><Icon className="h-4 w-4" /></span>{label}</div>;
}

function EmptyCart({ onRestore }: { onRestore: () => void }) {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <span className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-surface-container-low"><PackageOpen className="h-12 w-12 stroke-1 text-primary" /></span>
      <h1 className="font-serif text-4xl font-semibold text-primary">Your cart is empty</h1>
      <p className="mt-3 max-w-sm text-on-surface-variant">Discover our seasonal bouquets, plants, and thoughtful gifts.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button render={<Link href="/products" />} className="h-12 rounded-full bg-primary px-7 text-on-primary hover:bg-primary/90"><ShoppingBag className="h-4 w-4" />Shop Best Sellers</Button><Button type="button" variant="outline" onClick={onRestore} className="h-12 rounded-full border-outline-variant px-7">Preview filled cart</Button></div>
    </div>
  );
}
