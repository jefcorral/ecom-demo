"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { CalendarDays, Check, ChevronDown, ChevronRight, Heart, ImageIcon, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import { useCart, useWishlist } from "@/app/providers";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { showErrorToast, showSuccessToast } from "@/lib/toast-helper";
import type { Product } from "@/types";

const details = [
  { title: "Description", text: "Each stem is selected for its unique shape and character, then hand-tied by our floral designers for a naturally abundant finish." },
  { title: "Care Instructions", text: "Trim stems at an angle, refresh the water every two days, and keep your arrangement away from direct sunlight and heat." },
  { title: "Delivery Details", text: "Your flowers arrive hand-tied in recyclable packaging with a care card. Delivery timing is selected at checkout." },
];

const sizes = [
  { name: "Petite", multiplier: 0.8 },
  { name: "Classic", multiplier: 1 },
  { name: "Luxe", multiplier: 1.25 },
  { name: "Grand", multiplier: 1.6 },
];

const gallery = [
  { src: "/product-detail/bouquet-main.png", alt: "Garden rose and peony bouquet" },
  { src: "/product-detail/peony-detail.png", alt: "Pink peony detail" },
  { src: "/product-detail/packaging.png", alt: "Hand-tied bouquet packaging" },
  { src: "/product-detail/lifestyle.png", alt: "Bouquet on a dining table" },
];

const addOns = [
  { name: "Artisan Truffles", price: 18, image: "/product-detail/packaging.png" },
  { name: "Signature Glass Vase", price: 15, image: "/product-detail/bouquet-main.png" },
  { name: "Botanical Candle", price: 22, image: "/product-detail/lifestyle.png" },
];

export function ProductDetail({ product, relatedProducts }: { product: Product; relatedProducts: Product[] }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const mobileGalleryRef = useRef<HTMLDivElement>(null);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("Classic");
  const [note, setNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const isWishlisted = isInWishlist(product.id);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(["Signature Glass Vase"]);
  const [adding, setAdding] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [minimumDate] = useState(() => new Date(Date.now() + 86400000).toISOString().split("T")[0]);
  const [deliveryOptions] = useState(() => Array.from({ length: 4 }, (_, index) => {
    const date = new Date(Date.now() + (index + 1) * 86400000);
    return { value: date.toISOString().split("T")[0], weekday: date.toLocaleDateString("en-US", { weekday: "short" }), day: date.getDate() };
  }));
  const selectedSize = sizes.find((option) => option.name === size) ?? sizes[1];
  const unitPrice = Number(product.salePrice ?? product.price) * selectedSize.multiplier;
  const addOnTotal = addOns.filter((addOn) => selectedAddOns.includes(addOn.name)).reduce((sum, addOn) => sum + addOn.price, 0);
  const totalPrice = unitPrice * quantity + addOnTotal;
  const isOutOfStock = product.stock === 0;

  async function handleToggleWishlist() {
    try {
      const wasAdded = await toggleWishlist(product);
      showSuccessToast(wasAdded ? "Saved to favorites" : "Removed from favorites");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not update wishlist";
      showErrorToast(msg);
    }
  }

  function selectMobileImage(index: number) {
    const galleryElement = mobileGalleryRef.current;
    if (!galleryElement) return;
    galleryElement.scrollTo({ left: galleryElement.clientWidth * index, behavior: "smooth" });
  }

  async function handleAddToCart() {
    setAdding(true);
    try {
      await addItem(product.id, quantity, note || undefined);
      showSuccessToast(`${quantity} × ${product.name} added to cart`);
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : "Could not add item");
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="pb-40 md:pb-0">
      <div className="mx-auto w-full max-w-[1140px] px-4 py-8 md:px-8 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 hidden items-center gap-1 text-xs text-on-surface-variant md:flex">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/products" className="transition-colors hover:text-primary">{product.category?.name ?? "Flowers"}</Link>
          <ChevronRight className="hidden h-4 w-4 sm:block" />
          <span aria-current="page" className="hidden truncate text-on-surface sm:block">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          <section className="-mx-4 -mt-8 h-fit md:mx-0 md:mt-0 lg:sticky lg:top-24 lg:col-span-7" aria-label="Product gallery" aria-roledescription="carousel">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="order-2 hidden w-20 shrink-0 flex-col gap-2 md:flex">
                {gallery.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    aria-label={`View image ${index + 1}`}
                    aria-current={selectedImage === index}
                    onClick={() => { setSelectedImage(index); setImageLoading(true); setImageError(false); }}
                    className={`relative h-20 w-20 overflow-hidden rounded-lg border-2 transition hover:scale-95 ${selectedImage === index ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"}`}
                  >
                    <Image src={image.src} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
              <div className="group relative order-1 aspect-square flex-1 overflow-hidden bg-surface-container-high shadow-[0_4px_30px_rgba(44,62,42,0.06)] md:order-2 md:rounded-2xl">
                <div
                  ref={mobileGalleryRef}
                  tabIndex={0}
                  aria-label="Product images"
                  onScroll={(event) => setSelectedImage(Math.round(event.currentTarget.scrollLeft / event.currentTarget.clientWidth))}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowLeft") selectMobileImage(Math.max(0, selectedImage - 1));
                    if (event.key === "ArrowRight") selectMobileImage(Math.min(gallery.length - 1, selectedImage + 1));
                  }}
                  className="flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth focus-visible:outline-2 focus-visible:outline-primary motion-reduce:scroll-auto md:hidden"
                >
                  {gallery.map((image, index) => (
                    <div key={image.src} className="relative h-full w-full shrink-0 snap-center">
                      <Image src={image.src} alt={image.alt} fill priority={index === 0} sizes="100vw" className="object-cover" />
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 hidden md:block">
                  {!imageError ? (
                    <>
                      {imageLoading && <Skeleton className="absolute inset-0 h-full w-full" />}
                      <Image
                        key={gallery[selectedImage].src}
                        src={gallery[selectedImage].src}
                        alt={gallery[selectedImage].alt}
                        fill
                        priority
                        sizes="50vw"
                        onLoad={() => setImageLoading(false)}
                        onError={() => { setImageLoading(false); setImageError(true); }}
                        className={`object-cover transition duration-700 group-hover:scale-105 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                      />
                    </>
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-3 text-on-surface-variant">
                      <ImageIcon className="h-16 w-16 stroke-1" />
                      <span>No image available</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={isWishlisted}
                  onClick={handleToggleWishlist}
                  className="absolute right-4 top-4 hidden h-11 w-11 items-center justify-center rounded-full bg-surface-container-lowest/85 text-on-surface-variant shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-surface-container hover:text-primary md:flex"
                >
                  <Heart className={`h-5 w-5 transition-transform duration-200 active:scale-125 ${isWishlisted ? "fill-primary text-primary scale-110" : "text-on-surface-variant"}`} />
                </button>
                <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2 md:hidden">
                  {gallery.map((image, index) => (
                    <button key={image.src} type="button" aria-label={`View image ${index + 1}`} aria-current={selectedImage === index} onClick={() => selectMobileImage(index)} className="flex h-11 w-11 items-center justify-center rounded-full">
                      <span className={`h-2 w-2 rounded-full ${selectedImage === index ? "bg-primary" : "bg-surface-variant"}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col lg:col-span-5">
            <div className="mb-10">
              <p className="mb-2 hidden text-xs font-semibold uppercase tracking-[0.18em] text-primary md:block">{product.category?.name ?? "Signature Collection"}</p>
              <div className="flex items-start justify-between gap-4">
                <h1 className="font-serif text-3xl font-semibold leading-tight text-on-surface md:text-4xl">{product.name}</h1>
                <button
                  type="button"
                  aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={isWishlisted}
                  onClick={handleToggleWishlist}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-container-lowest text-on-surface-variant shadow-sm transition-all duration-300 hover:bg-surface-container md:hidden"
                >
                  <Heart className={`h-6 w-6 transition-transform duration-200 active:scale-125 ${isWishlisted ? "fill-primary text-primary scale-110" : "text-on-surface-variant"}`} />
                </button>
              </div>
              <div className="my-4 hidden items-center gap-3 md:flex">
                <div className="flex text-primary-fixed-dim" aria-label="Rated 4.8 out of 5">
                  {Array.from({ length: 5 }, (_, index) => <Star key={index} className="h-4 w-4 fill-current" />)}
                </div>
                <span className="text-xs text-on-surface-variant">4.8 (124 reviews)</span>
              </div>
              <div className="hidden items-baseline gap-3 md:flex">
                <p className="font-serif text-3xl font-semibold text-primary">${unitPrice.toFixed(2)}</p>
                {product.salePrice && <p className="text-base text-outline line-through">${(Number(product.price) * selectedSize.multiplier).toFixed(2)}</p>}
              </div>
              <p className="mt-5 text-base leading-7 text-on-surface-variant">{product.description ?? "A hand-tied seasonal arrangement designed with care."}</p>
              {product.stock > 0 && product.stock <= (product.lowStockThreshold ?? 5) && <p className="mt-3 text-sm font-medium text-tertiary">Only {product.stock} left</p>}
            </div>

            <fieldset className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <legend className="text-sm font-semibold uppercase tracking-wider text-on-surface">Select size</legend>
                <span className="text-xs text-on-surface-variant">Hand-tied to order</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {sizes.map((option) => {
                  const selected = size === option.name;
                  return (
                    <button
                      key={option.name}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSize(option.name)}
                      className={`relative rounded-lg border px-2 py-3 text-center transition ${option.name === "Grand" ? "hidden sm:block" : ""} ${selected ? "border-primary bg-surface-container-low text-primary" : "border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary/50"}`}
                    >
                      <span className="block text-sm font-medium">{option.name}</span>
                      <span className="mt-1 block text-[11px] opacity-70">${(Number(product.salePrice ?? product.price) * option.multiplier).toFixed(0)}</span>
                      {option.name === "Classic" && <span className="absolute -right-1 -top-2 rounded-full bg-primary px-2 py-0.5 text-[9px] font-bold text-on-primary">POPULAR</span>}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mb-8 md:hidden">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider">Delivery date</h2>
                <span className="flex items-center gap-1 text-xs font-medium text-primary"><CalendarDays className="h-4 w-4" />View Calendar</span>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {deliveryOptions.map((option, index) => (
                  <button key={option.value} type="button" onClick={() => setDeliveryDate(option.value)} className={`flex h-[88px] w-[72px] shrink-0 flex-col items-center justify-center rounded-xl bg-surface-container-lowest shadow-sm transition active:scale-95 ${deliveryDate === option.value || (!deliveryDate && index === 1) ? "outline outline-2 outline-primary" : ""}`}>
                    <span className="text-xs">{option.weekday}</span>
                    <span className="mt-1 font-serif text-2xl">{option.day}</span>
                    <span className="mt-1 text-[10px] text-primary">Free</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8 hidden gap-4 border-y border-outline-variant/30 py-6 md:grid md:grid-cols-2">
              <label className="text-sm font-medium text-on-surface">
                <span className="mb-2 flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" />Delivery date</span>
                <input type="date" min={minimumDate} value={deliveryDate} onChange={(event) => setDeliveryDate(event.target.value)} className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm" />
              </label>
              <label className="text-sm font-medium text-on-surface">
                <span className="mb-2 block">Delivery window</span>
                <select className="h-11 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-sm" defaultValue="afternoon">
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </label>
            </div>

            <div className="mb-8">
              <button type="button" onClick={() => setNoteOpen((value) => !value)} className="hidden w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wider md:flex">
                Add a gift note <ChevronDown className={`h-4 w-4 transition-transform ${noteOpen ? "rotate-180" : ""}`} />
              </button>
              <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider md:hidden">Gift message</h2>
              <div className={`relative mt-3 ${noteOpen ? "md:block" : "md:hidden"}`}>
                <textarea value={note} maxLength={200} onChange={(event) => setNote(event.target.value)} placeholder="Write a heartfelt message..." className="min-h-28 w-full resize-none rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4 pb-8 text-sm shadow-sm focus:border-primary focus:outline-none" />
                <p className="absolute bottom-3 right-3 text-xs text-on-surface-variant/60">{note.length}/200</p>
              </div>
            </div>

            <section className="-mx-4 mb-8 border-t border-outline-variant/30 px-4 pt-6 md:hidden" aria-labelledby="add-ons-title">
              <h2 id="add-ons-title" className="mb-4 font-serif text-2xl font-semibold">Complete the Gift</h2>
              <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
                {addOns.map((addOn) => {
                  const selected = selectedAddOns.includes(addOn.name);
                  return (
                    <article key={addOn.name} className="w-[140px] shrink-0 snap-start">
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-surface-container-high">
                        <Image src={addOn.image} alt={addOn.name} fill sizes="140px" className="object-cover" />
                        <button type="button" aria-label={`${selected ? "Remove" : "Add"} ${addOn.name}`} aria-pressed={selected} onClick={() => setSelectedAddOns((current) => selected ? current.filter((name) => name !== addOn.name) : [...current, addOn.name])} className={`absolute bottom-2 right-2 flex h-11 w-11 items-center justify-center rounded-full shadow-md ${selected ? "bg-surface-container-lowest text-primary" : "bg-primary text-on-primary"}`}>
                          {selected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                        </button>
                      </div>
                      <h3 className="mt-2 truncate text-xs font-semibold">{addOn.name}</h3>
                      <p className="text-xs font-semibold text-primary">+${addOn.price}</p>
                    </article>
                  );
                })}
              </div>
            </section>

            <div className="hidden items-center gap-4 border-b border-outline-variant/30 pb-8 md:flex">
              <QuantityControl quantity={quantity} stock={product.stock} onChange={setQuantity} />
              <Button onClick={handleAddToCart} disabled={isOutOfStock || adding} className="h-12 flex-1 rounded-full bg-primary text-base text-on-primary hover:bg-primary/90">
                {isOutOfStock ? "Out of stock" : adding ? "Adding..." : <>Add to Cart <span className="opacity-70">•</span> ${totalPrice.toFixed(2)} <ShoppingBag className="h-4 w-4" /></>}
              </Button>
              <button
                type="button"
                aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-pressed={isWishlisted}
                onClick={handleToggleWishlist}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface-variant transition-all duration-300 hover:bg-surface-container hover:text-primary"
              >
                <Heart className={`h-5 w-5 transition-transform duration-200 active:scale-125 ${isWishlisted ? "fill-primary text-primary scale-110" : "text-on-surface-variant"}`} />
              </button>
            </div>

            <div className="divide-y divide-outline-variant/30 border-b border-outline-variant/30">
              {details.map((detail, index) => (
                <details key={detail.title} open={index === 0} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-semibold uppercase tracking-wider text-on-surface">
                    {detail.title}<ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="pb-5 text-sm leading-6 text-on-surface-variant">{index === 0 ? `${product.description ?? ""} ${detail.text}` : detail.text}</p>
                </details>
              ))}
            </div>
          </section>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-20 md:mt-28" aria-labelledby="related-products-title">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">More to love</p>
                <h2 id="related-products-title" className="mt-1 font-serif text-3xl font-semibold">You May Also Like</h2>
              </div>
              <Link href="/products" className="text-sm font-medium text-primary hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
              {relatedProducts.map((related) => <ProductCard key={related.id} product={related} />)}
            </div>
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-16 z-40 border-t border-outline-variant/30 bg-surface/95 p-3 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-lg items-center gap-4">
          <div className="shrink-0">
            <span className="block text-xs text-on-surface-variant">Price</span>
            <span className="font-serif text-2xl font-semibold text-primary">${totalPrice.toFixed(2)}</span>
          </div>
          <Button onClick={handleAddToCart} disabled={isOutOfStock || adding} className="h-14 flex-1 rounded-lg bg-primary text-on-primary hover:bg-primary/90">
            <ShoppingBag className="h-5 w-5" />{isOutOfStock ? "Out of stock" : adding ? "Adding..." : "Add to Bouquet"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuantityControl({ quantity, stock, onChange, compact = false }: { quantity: number; stock: number; onChange: (value: number) => void; compact?: boolean }) {
  return (
    <div className={`flex h-12 items-center rounded-full border border-outline-variant bg-surface-container-lowest px-1 ${compact ? "shrink-0" : ""}`}>
      <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => onChange(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container disabled:opacity-30"><Minus className="h-4 w-4" /></button>
      <span className="w-7 text-center text-sm" aria-live="polite">{quantity}</span>
      <button type="button" aria-label="Increase quantity" disabled={quantity >= stock} onClick={() => onChange(Math.min(stock, quantity + 1))} className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container disabled:opacity-30"><Plus className="h-4 w-4" /></button>
    </div>
  );
}
