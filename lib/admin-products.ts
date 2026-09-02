import { mockCategories, mockOccasions, mockProducts, mockTags } from "@/lib/mock-data";
import { Category, Occasion, Product, Tag } from "@/types";

export type ProductMutation = "update" | "duplicate" | "archive" | "availability";
export type ProductStatus = "draft" | "published" | "archived";

const defaultImages = [
  "/product-detail/bouquet-main.png",
  "/product-detail/lifestyle.png",
  "/product-detail/packaging.png",
  "/product-detail/peony-detail.png",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function enrichProduct(product: Product): Product {
  const category = product.category ?? mockCategories[0];
  const index = Math.max(0, product.id ? Number(product.id.replace(/\D/g, "")) % 4 : 0);
  const images = product.images?.map((image, imageIndex) => ({
    ...image,
    url: image.url.startsWith("blob:") ? defaultImages[imageIndex % defaultImages.length] : image.url,
  }));
  return {
    ...product,
    tags: product.tags?.length ? product.tags : ["White", "Elegant"],
    occasions: product.occasions?.length ? product.occasions : ["occ-3"],
    variants: product.variants ?? [],
    images: images?.length
      ? images
      : [{ id: "img-1", url: product.imageUrl ?? defaultImages[index], isPrimary: true }],
    backorder: product.backorder ?? false,
    featured: product.featured ?? false,
    metaTitle: product.metaTitle ?? product.name,
    metaDescription: product.metaDescription ?? product.description,
    slug: product.slug ?? slugify(product.name),
    funeralLocation: product.funeralLocation ?? false,
    funeralTime: product.funeralTime ?? false,
    allowRibbon: product.allowRibbon ?? false,
    leadTime: product.leadTime ?? 2,
    sameDayDelivery: product.sameDayDelivery ?? false,
    isBestSeller: product.isBestSeller ?? false,
    salePrice: product.salePrice ?? null,
    lowStockThreshold: product.lowStockThreshold ?? 5,
    category,
    categoryId: product.categoryId ?? category.id,
  };
}

export async function fetchAdminProducts(): Promise<Product[]> {
  return mockProducts.slice(0, 24);
}

export async function fetchAdminProductById(id: string): Promise<Product | null> {
  const product = mockProducts.find((p) => p.id === id);
  if (!product) return null;
  return enrichProduct(product);
}

export async function fetchAdminCategories(): Promise<Category[]> {
  return mockCategories;
}

export async function fetchAdminTags(): Promise<Tag[]> {
  return mockTags;
}

export async function fetchAdminOccasions(): Promise<Occasion[]> {
  return mockOccasions;
}

export async function mutateAdminProducts(_action: ProductMutation): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
}

export async function createAdminProduct(input: Product): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 450));
  const id = `prod-${mockProducts.length + 1}-${Date.now()}`;
  const now = new Date().toISOString();
  const product: Product = enrichProduct({
    ...input,
    id,
    createdAt: now,
    updatedAt: now,
  });
  mockProducts.unshift(product);
  return product;
}

export async function updateAdminProduct(id: string, input: Partial<Product>): Promise<Product> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const index = mockProducts.findIndex((p) => p.id === id);
  const existing = index >= 0 ? mockProducts[index] : mockProducts[0];
  const updated = enrichProduct({
    ...existing,
    ...input,
    id,
    updatedAt: new Date().toISOString(),
  });
  if (index >= 0) {
    mockProducts[index] = updated;
  } else {
    mockProducts.unshift(updated);
  }
  return updated;
}

export async function archiveAdminProduct(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 350));
  const index = mockProducts.findIndex((p) => p.id === id);
  if (index >= 0) {
    mockProducts.splice(index, 1);
  }
}

export { slugify };
