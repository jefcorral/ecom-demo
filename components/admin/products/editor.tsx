"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Archive,
  ArrowLeft,
  Check,
  ChevronDown,
  Eye,
  FileImage,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  archiveAdminProduct,
  createAdminProduct,
  fetchAdminCategories,
  fetchAdminOccasions,
  fetchAdminTags,
  slugify,
  updateAdminProduct,
} from "@/lib/admin-products";
import { Category, Occasion, Product, ProductVariant, Tag } from "@/types";

interface DraftImage {
  id: string;
  url: string;
  file?: File;
  isPrimary: boolean;
}

interface DraftProduct {
  id?: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  tags: string[];
  occasions: string[];
  price: number;
  salePrice: number | null;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  backorder: boolean;
  variants: ProductVariant[];
  images: DraftImage[];
  sameDayDelivery: boolean;
  funeralLocation: boolean;
  funeralTime: boolean;
  allowRibbon: boolean;
  leadTime: number;
  featured: boolean;
  isBestSeller: boolean;
  metaTitle: string;
  metaDescription: string;
  isActive: boolean;
}

function productToDraft(product: Product): DraftProduct {
  const category = product.category ?? { id: "", name: "" };
  const slug = product.slug ?? slugify(product.name);
  return {
    id: product.id,
    name: product.name,
    slug,
    description: product.description ?? "",
    categoryId: product.categoryId ?? category.id,
    tags: product.tags ?? [],
    occasions: product.occasions ?? [],
    price: product.price,
    salePrice: product.salePrice ?? null,
    sku: product.sku,
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold ?? 5,
    backorder: product.backorder ?? false,
    variants: product.variants ?? [],
    images:
      product.images?.map((img) => ({ ...img, file: undefined })) ??
      (product.imageUrl
        ? [{ id: "img-1", url: product.imageUrl, isPrimary: true }]
        : []),
    sameDayDelivery: product.sameDayDelivery ?? false,
    funeralLocation: product.funeralLocation ?? false,
    funeralTime: product.funeralTime ?? false,
    allowRibbon: product.allowRibbon ?? false,
    leadTime: product.leadTime ?? 2,
    featured: product.featured ?? false,
    isBestSeller: product.isBestSeller ?? false,
    metaTitle: product.metaTitle ?? product.name,
    metaDescription: product.metaDescription ?? product.description ?? "",
    isActive: product.isActive,
  };
}

function draftToProduct(draft: DraftProduct, categories: Category[]): Product {
  const category = categories.find((c) => c.id === draft.categoryId) ?? null;
  return {
    id: draft.id ?? "",
    name: draft.name,
    slug: draft.slug,
    description: draft.description || null,
    categoryId: draft.categoryId,
    category,
    price: draft.price,
    stock: draft.stock,
    lowStockThreshold: draft.lowStockThreshold,
    isActive: draft.isActive,
    imageUrl: draft.images.find((img) => img.isPrimary)?.url ?? draft.images[0]?.url ?? null,
    sku: draft.sku,
    createdAt: "",
    updatedAt: "",
    tags: draft.tags,
    occasions: draft.occasions,
    variants: draft.variants,
    images: draft.images.map(({ file, ...img }) => img),
    backorder: draft.backorder,
    featured: draft.featured,
    sameDayDelivery: draft.sameDayDelivery,
    salePrice: draft.salePrice,
    isBestSeller: draft.isBestSeller,
    metaTitle: draft.metaTitle,
    metaDescription: draft.metaDescription,
    funeralLocation: draft.funeralLocation,
    funeralTime: draft.funeralTime,
    allowRibbon: draft.allowRibbon,
    leadTime: draft.leadTime,
  };
}

function blankDraft(): DraftProduct {
  return {
    name: "",
    slug: "",
    description: "",
    categoryId: "",
    tags: [],
    occasions: [],
    price: 0,
    salePrice: null,
    sku: "",
    stock: 0,
    lowStockThreshold: 5,
    backorder: false,
    variants: [],
    images: [],
    sameDayDelivery: false,
    funeralLocation: false,
    funeralTime: false,
    allowRibbon: false,
    leadTime: 2,
    featured: false,
    isBestSeller: false,
    metaTitle: "",
    metaDescription: "",
    isActive: false,
  };
}

function money(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function ProductEditor({
  product,
  mode,
}: {
  product?: Product | null;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [occasions, setOccasions] = React.useState<Occasion[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [draft, setDraft] = React.useState<DraftProduct>(() =>
    product ? productToDraft(product) : blankDraft()
  );
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [autosaving, setAutosaving] = React.useState(false);
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null);
  const [hasChanges, setHasChanges] = React.useState(false);
  const [slugManual, setSlugManual] = React.useState(false);
  const [archiveOpen, setArchiveOpen] = React.useState(false);
  const [tagInput, setTagInput] = React.useState("");
  const [imageError, setImageError] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const initialRef = React.useRef<string>(JSON.stringify(draft));
  const imagesRef = React.useRef<DraftImage[]>([]);

  React.useEffect(() => {
    imagesRef.current = draft.images;
  }, [draft.images]);

  React.useEffect(() => {
    Promise.all([fetchAdminCategories(), fetchAdminOccasions(), fetchAdminTags()])
      .then(([c, o, t]) => {
        setCategories(c);
        setOccasions(o);
        setTags(t);
        setDraft((prev) => ({ ...prev, categoryId: prev.categoryId || (c[0]?.id ?? "") }));
      })
      .catch(() => setError("We could not load the editor. Please try again."));
  }, []);

  React.useEffect(() => {
    setHasChanges(JSON.stringify(draft) !== initialRef.current);
  }, [draft]);

  React.useEffect(() => {
    if (!hasChanges || mode === "create" || saving) return;
    const timer = setTimeout(() => {
      setAutosaving(true);
      updateAdminProduct(draft.id ?? "", draftToProduct(draft, categories))
        .then(() => {
          setLastSavedAt(new Date());
          initialRef.current = JSON.stringify(draft);
          setHasChanges(false);
        })
        .catch(() => {})
        .finally(() => setAutosaving(false));
    }, 2500);
    return () => clearTimeout(timer);
  }, [draft, hasChanges, mode, saving, categories]);

  React.useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);

  React.useEffect(() => {
    const revoke = () => {
      imagesRef.current.forEach((img) => {
        if (img.file) URL.revokeObjectURL(img.url);
      });
    };
    return revoke;
  }, []);

  const errors = React.useMemo(() => {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = "Product name is required";
    if (!draft.slug.trim()) next.slug = "URL slug is required";
    if (!draft.sku.trim()) next.sku = "SKU is required";
    if (draft.price <= 0) next.price = "Price must be greater than 0";
    if (draft.stock < 0) next.stock = "Stock cannot be negative";
    if (draft.images.length === 0) next.images = "Add at least one product image";
    if (draft.variants.some((v) => v.price <= 0)) next.variants = "All variant prices must be greater than 0";
    return next;
  }, [draft]);

  const isValid = Object.keys(errors).length === 0;

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function update<K extends keyof DraftProduct>(key: K, value: DraftProduct[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(value: string) {
    setDraft((prev) => {
      const next = { ...prev, name: value };
      if (!slugManual) next.slug = slugify(value);
      return next;
    });
  }

  function handleSlugChange(value: string) {
    setSlugManual(true);
    setDraft((prev) => ({ ...prev, slug: value }));
  }

  function addTag(raw: string) {
    const value = raw.trim().toLowerCase();
    if (!value) return;
    setDraft((prev) => ({ ...prev, tags: Array.from(new Set([...prev.tags, value])) }));
    setTagInput("");
  }

  function removeTag(value: string) {
    setDraft((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== value) }));
  }

  function toggleOccasion(id: string) {
    setDraft((prev) => ({
      ...prev,
      occasions: prev.occasions.includes(id)
        ? prev.occasions.filter((o) => o !== id)
        : [...prev.occasions, id],
    }));
  }

  function addVariant() {
    setDraft((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { id: `var-${Date.now()}`, name: "", sku: "", price: 0, stock: 0 },
      ],
    }));
  }

  function updateVariant(index: number, field: keyof ProductVariant, value: string | number) {
    setDraft((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => (i === index ? { ...v, [field]: value } : v)),
    }));
  }

  function removeVariant(index: number) {
    setDraft((prev) => ({ ...prev, variants: prev.variants.filter((_, i) => i !== index) }));
  }

  function handleFiles(files: FileList | null) {
    setImageError(null);
    if (!files) return;
    const incoming = Array.from(files);
    if (draft.images.length + incoming.length > 8) {
      setImageError("You can upload up to 8 images");
      return;
    }
    const valid: DraftImage[] = [];
    for (const file of incoming) {
      if (!file.type.startsWith("image/")) {
        setImageError("Only image files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setImageError("Each image must be under 5 MB");
        return;
      }
      const url = URL.createObjectURL(file);
      valid.push({ id: `img-${Date.now()}-${Math.random().toString(36).slice(2)}`, url, file, isPrimary: false });
    }
    setDraft((prev) => {
      const next = [...prev.images, ...valid];
      if (!next.some((img) => img.isPrimary) && next.length) next[0].isPrimary = true;
      return { ...prev, images: next };
    });
  }

  function removeImage(id: string) {
    setDraft((prev) => {
      const removed = prev.images.find((img) => img.id === id);
      if (removed?.file) URL.revokeObjectURL(removed.url);
      const next = prev.images.filter((img) => img.id !== id);
      if (!next.some((img) => img.isPrimary) && next.length) next[0].isPrimary = true;
      return { ...prev, images: next };
    });
  }

  function setPrimary(id: string) {
    setDraft((prev) => ({
      ...prev,
      images: prev.images.map((img) => ({ ...img, isPrimary: img.id === id })),
    }));
  }

  function validate() {
    setSubmitAttempted(true);
    setTouched({
      name: true,
      slug: true,
      sku: true,
      price: true,
      stock: true,
      images: true,
      variants: true,
    });
    return Object.keys(errors).length === 0;
  }

  async function save(publish: boolean) {
    setSubmitAttempted(true);
    if (!validate()) {
      toast.error("Please fix the highlighted fields before saving.");
      return;
    }
    setSaving(true);
    try {
      const input = { ...draftToProduct(draft, categories), isActive: publish };
      if (mode === "create") {
        const saved = await createAdminProduct(input);
        setDraft(productToDraft(saved));
        initialRef.current = JSON.stringify(productToDraft(saved));
        setHasChanges(false);
        toast.success(`${saved.name} created`);
        router.push(`/dashboard/products/${saved.id}/edit`);
        return;
      }
      const saved = await updateAdminProduct(draft.id ?? "", input);
      setDraft(productToDraft(saved));
      initialRef.current = JSON.stringify(productToDraft(saved));
      setLastSavedAt(new Date());
      setHasChanges(false);
      toast.success(`${saved.name} ${publish ? "published" : "saved as draft"}`);
    } catch {
      setError("We could not save this product. Please try again.");
      toast.error("Save failed. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function confirmArchive() {
    setSaving(true);
    try {
      await archiveAdminProduct(draft.id ?? "");
      toast.success(`${draft.name} archived`);
      router.push("/dashboard/products");
    } catch {
      toast.error("Archive failed. Please try again.");
      setSaving(false);
    } finally {
      setArchiveOpen(false);
    }
  }

  function goBack() {
    if (hasChanges && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    router.push("/dashboard/products");
  }

  function showFieldError(key: string) {
    return (submitAttempted || touched[key]) && errors[key] ? errors[key] : null;
  }

  if (error && !categories.length) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-5 text-center">
        <p className="text-error mb-6 text-lg font-medium">{error}</p>
        <Button onClick={() => window.location.reload()}>Try again</Button>
      </div>
    );
  }

  const status = draft.isActive ? "Published" : "Draft";
  const previewHref = `/products/${draft.slug}`;

  return (
    <div className="mx-auto max-w-[1440px] px-5 py-6 lg:px-16 lg:py-10">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <button
            onClick={goBack}
            className="mb-2 flex h-11 items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to products
          </button>
          <h1 className="font-serif text-3xl text-on-surface lg:text-4xl">
            {mode === "create" ? "New product" : draft.name || "Untitled product"}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
                draft.isActive ? "bg-secondary-container text-on-secondary-container" : "bg-surface-container text-on-surface"
              )}
            >
              {status}
            </span>
            {lastSavedAt && <span>Last saved {formatTimeAgo(lastSavedAt)}</span>}
            {autosaving && <span className="inline-flex items-center gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Saving…</span>}
          </div>
        </div>
        <div className="hidden flex-wrap items-center gap-3 lg:flex">
          <Button
            variant="outline"
            onClick={() => window.open(previewHref, "_blank")}
            disabled={!draft.slug}
            className="min-h-11"
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button
            variant="outline"
            onClick={() => save(false)}
            disabled={saving}
            className="min-h-11"
          >
            <Save className="h-4 w-4" /> Save Draft
          </Button>
          <Button
            onClick={() => save(true)}
            disabled={saving}
            className="min-h-11"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Publish
          </Button>
          {mode === "edit" && (
            <Button
              variant="destructive"
              onClick={() => setArchiveOpen(true)}
              disabled={saving}
              className="min-h-11"
            >
              <Archive className="h-4 w-4" /> Archive
            </Button>
          )}
        </div>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 space-y-6">
          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-serif text-xl text-on-surface mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product name</Label>
                <Input
                  id="name"
                  value={draft.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  onBlur={() => touch("name")}
                  aria-invalid={!!showFieldError("name")}
                  className="mt-2"
                  placeholder="e.g. Grand Sympathy Wreath"
                />
                {showFieldError("name") && <p className="mt-1 text-sm text-error">{showFieldError("name")}</p>}
              </div>
              <div>
                <Label htmlFor="slug">URL slug</Label>
                <div className="mt-2 flex items-stretch rounded-full border border-outline-variant bg-surface overflow-hidden focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary">
                  <span className="flex items-center bg-surface-container px-4 text-sm text-on-surface-variant">
                    /products/
                  </span>
                  <input
                    id="slug"
                    value={draft.slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    onBlur={() => touch("slug")}
                    aria-invalid={!!showFieldError("slug")}
                    className="min-h-11 flex-1 bg-transparent px-4 text-base outline-none"
                  />
                </div>
                {showFieldError("slug") && <p className="mt-1 text-sm text-error">{showFieldError("slug")}</p>}
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={draft.description}
                  onChange={(e) => update("description", e.target.value)}
                  className="mt-2 min-h-[120px] resize-y"
                  placeholder="Describe the arrangement..."
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-serif text-xl text-on-surface mb-4">Media</h2>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); }}
              onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
              className="mb-4 flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-6 transition-colors hover:bg-surface-container"
            >
              <ImagePlus className="mb-2 h-8 w-8 text-primary" />
              <span className="text-sm font-medium text-on-surface">Click to upload or drag images here</span>
              <span className="text-xs text-on-surface-variant">PNG, JPG, GIF up to 5 MB each</span>
            </button>
            {imageError && <p className="mb-3 text-sm text-error" role="alert">{imageError}</p>}
            {showFieldError("images") && <p className="mb-3 text-sm text-error" role="alert">{showFieldError("images")}</p>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {draft.images.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface"
                >
                  <Image
                    src={img.url}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                    unoptimized={!!img.file}
                  />
                  {img.isPrimary && (
                    <span className="absolute left-2 top-2 rounded-full bg-surface-container-lowest/90 px-2 py-1 text-[10px] font-medium text-on-surface">
                      Primary
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-2 bg-inverse-surface/60 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPrimary(img.id)}
                      className="h-11 w-11"
                      aria-label="Set as primary image"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeImage(img.id)}
                      className="h-11 w-11"
                      aria-label="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {draft.images.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-outline-variant/30 bg-surface-container-low py-8 text-on-surface-variant">
                  <FileImage className="mb-2 h-8 w-8" />
                  <span className="text-sm">No images yet</span>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-serif text-xl text-on-surface mb-4">Pricing &amp; Inventory</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="price">Price</Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.price}
                    onChange={(e) => update("price", Number(e.target.value))}
                    onBlur={() => touch("price")}
                    aria-invalid={!!showFieldError("price")}
                    className="pl-8"
                  />
                </div>
                {showFieldError("price") && <p className="mt-1 text-sm text-error">{showFieldError("price")}</p>}
              </div>
              <div>
                <Label htmlFor="salePrice">Compare-at price</Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
                  <Input
                    id="salePrice"
                    type="number"
                    min={0}
                    step="0.01"
                    value={draft.salePrice ?? ""}
                    onChange={(e) => update("salePrice", e.target.value ? Number(e.target.value) : null)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={draft.sku}
                  onChange={(e) => update("sku", e.target.value)}
                  onBlur={() => touch("sku")}
                  aria-invalid={!!showFieldError("sku")}
                  className="mt-2"
                />
                {showFieldError("sku") && <p className="mt-1 text-sm text-error">{showFieldError("sku")}</p>}
              </div>
              <div>
                <Label htmlFor="stock">Stock level</Label>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  value={draft.stock}
                  onChange={(e) => update("stock", Number(e.target.value))}
                  onBlur={() => touch("stock")}
                  aria-invalid={!!showFieldError("stock")}
                  className="mt-2"
                />
                {showFieldError("stock") && <p className="mt-1 text-sm text-error">{showFieldError("stock")}</p>}
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-on-surface">Low stock threshold</p>
                  <p className="text-xs text-on-surface-variant">Alert when inventory falls below this number</p>
                </div>
                <Input
                  type="number"
                  min={0}
                  value={draft.lowStockThreshold}
                  onChange={(e) => update("lowStockThreshold", Number(e.target.value))}
                  className="w-full sm:w-28"
                />
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
              <div>
                <p className="text-sm font-medium text-on-surface">Allow backorders</p>
                <p className="text-xs text-on-surface-variant">Sell when stock reaches zero</p>
              </div>
              <Toggle
                checked={draft.backorder}
                onChange={() => update("backorder", !draft.backorder)}
                label="Allow backorders"
              />
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-on-surface">Variants</h2>
              <Button type="button" variant="outline" onClick={addVariant} className="min-h-11">
                <Plus className="h-4 w-4" /> Add variant
              </Button>
            </div>
            <div className="space-y-3">
              {draft.variants.map((variant, i) => (
                <div
                  key={variant.id}
                  className="grid gap-3 rounded-xl border border-outline-variant/50 bg-surface-container-low p-3 sm:grid-cols-[1fr_1fr_120px_120px_auto]"
                >
                  <Input
                    placeholder="Name"
                    value={variant.name}
                    onChange={(e) => updateVariant(i, "name", e.target.value)}
                    aria-label={`Variant ${i + 1} name`}
                  />
                  <Input
                    placeholder="SKU"
                    value={variant.sku}
                    onChange={(e) => updateVariant(i, "sku", e.target.value)}
                    aria-label={`Variant ${i + 1} SKU`}
                  />
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    placeholder="Price"
                    value={variant.price}
                    onChange={(e) => updateVariant(i, "price", Number(e.target.value))}
                    aria-label={`Variant ${i + 1} price`}
                  />
                  <Input
                    type="number"
                    min={0}
                    placeholder="Stock"
                    value={variant.stock}
                    onChange={(e) => updateVariant(i, "stock", Number(e.target.value))}
                    aria-label={`Variant ${i + 1} stock`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeVariant(i)}
                    className="h-11 w-11 text-destructive"
                    aria-label={`Remove variant ${i + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {draft.variants.length === 0 && (
                <p className="text-center text-sm text-on-surface-variant">No variants yet. Add options like size or color.</p>
              )}
            </div>
            {showFieldError("variants") && <p className="mt-2 text-sm text-error">{showFieldError("variants")}</p>}
          </section>

          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-serif text-xl text-on-surface mb-4">Delivery &amp; Floral Specifics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
                <div>
                  <p className="text-sm font-medium text-on-surface">Same-day delivery eligibility</p>
                  <p className="text-xs text-on-surface-variant">Allow expedited fulfillment for local orders</p>
                </div>
                <Toggle
                  checked={draft.sameDayDelivery}
                  onChange={() => update("sameDayDelivery", !draft.sameDayDelivery)}
                  label="Same-day delivery"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-outline-variant p-4 transition-colors hover:bg-surface-container has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="checkbox"
                    checked={draft.funeralLocation}
                    onChange={(e) => update("funeralLocation", e.target.checked)}
                    className="mt-1 h-5 w-5 accent-primary"
                  />
                  <div>
                    <span className="block text-sm font-medium text-on-surface">Service location required</span>
                    <span className="block text-xs text-on-surface-variant">Funeral home or church address</span>
                  </div>
                </label>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-outline-variant p-4 transition-colors hover:bg-surface-container has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <input
                    type="checkbox"
                    checked={draft.funeralTime}
                    onChange={(e) => update("funeralTime", e.target.checked)}
                    className="mt-1 h-5 w-5 accent-primary"
                  />
                  <div>
                    <span className="block text-sm font-medium text-on-surface">Service time required</span>
                    <span className="block text-xs text-on-surface-variant">Coordinate timely delivery</span>
                  </div>
                </label>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
                <div>
                  <p className="text-sm font-medium text-on-surface">Ribbon customization</p>
                  <p className="text-xs text-on-surface-variant">Enable text input for memorial ribbon</p>
                </div>
                <Toggle
                  checked={draft.allowRibbon}
                  onChange={() => update("allowRibbon", !draft.allowRibbon)}
                  label="Ribbon customization"
                />
              </div>
              <div>
                <Label htmlFor="leadTime">Lead time (days)</Label>
                <Input
                  id="leadTime"
                  type="number"
                  min={0}
                    value={draft.leadTime}
                    onChange={(e) => update("leadTime", Number(e.target.value))}
                    className="mt-2 w-full sm:w-40"
                  />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-serif text-xl text-on-surface mb-4">SEO</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta title</Label>
                <Input
                  id="metaTitle"
                  value={draft.metaTitle}
                  onChange={(e) => update("metaTitle", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta description</Label>
                <Textarea
                  id="metaDescription"
                  value={draft.metaDescription}
                  onChange={(e) => update("metaDescription", e.target.value)}
                  className="mt-2 min-h-[80px] resize-y"
                />
              </div>
            </div>
          </section>
        </div>

        <aside className="shrink-0 space-y-6 lg:sticky lg:top-24 lg:w-80">
          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-serif text-xl text-on-surface mb-4">Classification</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  value={draft.categoryId}
                  onChange={(e) => update("categoryId", e.target.value)}
                  className="mt-2 min-h-11 w-full rounded-full border border-outline-variant bg-surface px-4 text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="occasions">Occasions</Label>
                <div className="mt-2 space-y-2">
                  {occasions.map((o) => (
                    <label key={o.id} className="flex min-h-11 cursor-pointer items-center gap-3">
                      <input
                        type="checkbox"
                        checked={draft.occasions.includes(o.id)}
                        onChange={() => toggleOccasion(o.id)}
                        className="h-5 w-5 accent-primary"
                      />
                      <span className="text-sm text-on-surface">{o.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                  }}
                  onBlur={() => {
                    if (tagInput.trim()) addTag(tagInput);
                  }}
                  placeholder="Add tag and press Enter"
                  className="mt-2"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {draft.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-xs font-medium text-on-secondary-container"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="inline-flex h-5 w-5 items-center justify-center rounded-full hover:bg-secondary/20"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-outline-variant/30 bg-surface-container-lowest p-6 shadow-sm">
            <h2 className="font-serif text-xl text-on-surface mb-4">Storefront Visibility</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
                <div>
                  <p className="text-sm font-medium text-on-surface">Featured product</p>
                  <p className="text-xs text-on-surface-variant">Display on homepage</p>
                </div>
                <Toggle
                  checked={draft.featured}
                  onChange={() => update("featured", !draft.featured)}
                  label="Featured product"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl border border-outline-variant/50 bg-surface-container-low p-4">
                <div>
                  <p className="text-sm font-medium text-on-surface">Bestseller badge</p>
                  <p className="text-xs text-on-surface-variant">Highlight in catalog</p>
                </div>
                <Toggle
                  checked={draft.isBestSeller}
                  onChange={() => update("isBestSeller", !draft.isBestSeller)}
                  label="Bestseller badge"
                />
              </div>
            </div>
          </section>
        </aside>
      </div>

      <div className="h-24 lg:hidden" />

      <div className="fixed bottom-16 left-0 right-0 z-50 border-t border-outline-variant/30 bg-surface/95 pb-safe backdrop-blur-xl lg:hidden">
        <div className="flex gap-3 p-4">
          <Button
            variant="outline"
            onClick={() => window.open(previewHref, "_blank")}
            disabled={!draft.slug}
            className="h-11 flex-1"
          >
            <Eye className="h-4 w-4" /> Preview
          </Button>
          <Button
            variant="outline"
            onClick={() => save(false)}
            disabled={saving}
            className="h-11 flex-1"
          >
            <Save className="h-4 w-4" /> Draft
          </Button>
          <Button
            onClick={() => save(true)}
            disabled={saving}
            className="h-11 flex-1"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Publish
          </Button>
        </div>
      </div>

      <Dialog open={archiveOpen} onOpenChange={setArchiveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl">Archive product?</DialogTitle>
            <DialogDescription>
              {draft.name || "This product"} will be hidden from customers. You can restore it later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={saving}
              onClick={confirmArchive}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Archive className="h-4 w-4" />}
              Archive
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors",
        checked ? "bg-primary" : "bg-surface-variant"
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
}
