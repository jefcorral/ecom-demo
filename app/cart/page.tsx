"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/providers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchProduct } from "@/lib/products";
import { Product, CartItem } from "@/types";
import { LowStockBadge } from "@/components/low-stock-badge";
import { QuantityStepper } from "@/components/quantity-stepper";
import { showSuccessToast, showErrorToast } from "@/lib/toast-helper";

export default function CartPage() {
  const { cart, loading: cartLoading, updateItem, removeItem, clear } = useCart();
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [productsLoading, setProductsLoading] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    if (cart.items.length > 0) {
      Promise.all(
        cart.items.map((item) => fetchProduct(item.productId).catch(() => null))
      )
        .then((resolved) => {
          if (isCancelled) return;
          const productsMap: Record<string, Product> = {};
          resolved.forEach((prod) => {
            if (prod) {
              productsMap[prod.id] = prod;
            }
          });
          setProducts((prev) => ({ ...prev, ...productsMap }));
        })
        .catch((err) => {
          console.error("Failed to load products for cart", err);
        })
        .finally(() => {
          if (!isCancelled) {
            setProductsLoading(false);
          }
        });
    }

    return () => {
      isCancelled = true;
    };
  }, [cart.items]);

  const handleQuantityChange = async (item: CartItem, newQty: number, stock: number) => {
    if (!item.id) return;
    setIsRecalculating(true);
    try {
      await updateItem(item.id, newQty);
      showSuccessToast("Cart updated");
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Failed to update item";
      showErrorToast(errMsg, {
        actionLabel: "Reset to Max",
        onAction: () => updateItem(item.id!, stock),
      });
    } finally {
      setTimeout(() => setIsRecalculating(false), 300);
    }
  };

  const handleRemove = (item: CartItem) => {
    if (!item.id) return;
    removeItem(item.id)
      .then(() => showSuccessToast("Removed item"))
      .catch(() => showErrorToast("Could not remove item"));
  };

  const handleClear = () => {
    clear()
      .then(() => showSuccessToast("Cleared cart"))
      .catch(() => showErrorToast("Could not clear cart"));
  };

  if (cartLoading || (cart.items.length > 0 && productsLoading && Object.keys(products).length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="mb-6 text-3xl font-bold text-[#2C3E2A] dark:text-foreground">Your Cart</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-border rounded-lg"
            >
              <Skeleton className="h-16 w-16 rounded-md shrink-0 bg-muted" />
              <div className="flex-1 space-y-2 w-full">
                <Skeleton className="h-5 w-1/3 bg-muted" />
                <Skeleton className="h-4 w-1/4 bg-muted" />
              </div>
              <Skeleton className="h-10 w-24 bg-muted" />
              <Skeleton className="h-10 w-20 bg-muted shrink-0" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) => sum + (item.price ?? 0) * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">Your Cart</h1>
      {cart.items.length === 0 ? (
        <p className="text-center text-muted-foreground">
          Your cart is empty. <Link href="/products" className="underline">Continue shopping</Link>
        </p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Items</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Cart Table Layout for desktop (1024px+) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <th className="pb-4">Product</th>
                    <th className="pb-4 text-center">Quantity</th>
                    <th className="pb-4 text-right">Price</th>
                    <th className="pb-4 text-right">Total</th>
                    <th className="pb-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {cart.items.map((item) => {
                    const product = products[item.productId];
                    const stock = product ? product.stock : 999;
                    const imageUrl = product?.imageUrl;
                    const lowStockThreshold = product?.lowStockThreshold ?? 5;
                    const price = product ? product.price : (item.price ?? 0);
                    const itemTotal = price * item.quantity;

                    return (
                      <tr key={item.id ?? item.productId} className="align-middle">
                        <td className="py-6 flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted shrink-0 flex items-center justify-center border border-border">
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={item.name ?? "Product"}
                                fill
                                sizes="64px"
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#2C3E2A] dark:text-foreground text-base truncate">
                              {item.name ?? "Unknown product"}
                            </p>
                            {product && (
                              <div className="mt-1">
                                <LowStockBadge
                                  stock={stock}
                                  lowStockThreshold={lowStockThreshold}
                                />
                                {stock > 0 && stock <= lowStockThreshold && (
                                  <p className="text-[13px] text-[#D4A373] font-sans mt-0.5">
                                    only {stock} left
                                  </p>
                                )}
                              </div>
                            )}
                            {item.note && (
                              <p className="text-xs text-muted-foreground mt-1 italic max-w-sm truncate">
                                Note: {item.note}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-6 text-center">
                          <div className="inline-flex justify-center">
                            <QuantityStepper
                              value={item.quantity}
                              max={stock}
                              onChange={(val) => handleQuantityChange(item, val, stock)}
                            />
                          </div>
                        </td>
                        <td className="py-6 text-right font-medium font-sans text-sm">
                          ${Number(price).toFixed(2)}
                        </td>
                        <td className="py-6 text-right font-semibold font-sans text-sm text-[#2C3E2A] dark:text-foreground transition-all duration-300">
                          ${itemTotal.toFixed(2)}
                        </td>
                        <td className="py-6 text-right">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleRemove(item)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {/* Cart Cards Layout for Tablet (768–1023px) */}
            <div className="hidden md:max-lg:block space-y-4">
              {cart.items.map((item) => {
                const product = products[item.productId];
                const stock = product ? product.stock : 999;
                const imageUrl = product?.imageUrl;
                const lowStockThreshold = product?.lowStockThreshold ?? 5;
                const price = product ? product.price : (item.price ?? 0);
                const itemTotal = price * item.quantity;

                return (
                  <div
                    key={item.id ?? item.productId}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg bg-card shadow-sm"
                  >
                    <div className="relative h-20 w-20 overflow-hidden rounded-md bg-muted shrink-0 flex items-center justify-center border border-border">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={item.name ?? "Product"}
                          fill
                          sizes="80px"
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="font-semibold text-base text-[#2C3E2A] dark:text-foreground truncate">
                        {item.name ?? "Unknown product"}
                      </p>
                      <p className="text-sm text-muted-foreground font-sans">
                        ${Number(price).toFixed(2)} each
                      </p>
                      {product && (
                        <div className="pt-1">
                          <LowStockBadge
                            stock={stock}
                            lowStockThreshold={lowStockThreshold}
                          />
                          {stock > 0 && stock <= lowStockThreshold && (
                            <p className="text-[13px] text-[#D4A373] font-sans mt-0.5">
                              only {stock} left
                            </p>
                          )}
                        </div>
                      )}
                      {item.note && (
                        <p className="text-xs text-muted-foreground italic mt-1 max-w-md truncate">
                          Note: {item.note}
                        </p>
                      )}

                      <div className="pt-3 flex items-center gap-4 justify-between">
                        <QuantityStepper
                          value={item.quantity}
                          max={stock}
                          onChange={(val) => handleQuantityChange(item, val, stock)}
                        />
                        <span className="font-semibold font-sans text-sm transition-all duration-300">
                          ${itemTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(item)}
                      className="shrink-0"
                    >
                      Remove
                    </Button>
                  </div>
                );
              })}
            </div>
            {/* Cart Cards Layout for Mobile (Below 768px) */}
            <div className="block md:hidden space-y-4 pb-4">
              {cart.items.map((item) => {
                const product = products[item.productId];
                const stock = product ? product.stock : 999;
                const imageUrl = product?.imageUrl;
                const lowStockThreshold = product?.lowStockThreshold ?? 5;
                const price = product ? product.price : (item.price ?? 0);
                const itemTotal = price * item.quantity;

                return (
                  <div
                    key={item.id ?? item.productId}
                    className="flex flex-col gap-3 p-4 border border-border rounded-lg bg-card shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted shrink-0 flex items-center justify-center border border-border">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={item.name ?? "Product"}
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-[#2C3E2A] dark:text-foreground truncate">
                          {item.name ?? "Unknown product"}
                        </p>
                        <p className="text-xs text-muted-foreground font-sans">
                          ${Number(price).toFixed(2)} each
                        </p>
                        {product && (
                          <div className="mt-1">
                            <LowStockBadge
                              stock={stock}
                              lowStockThreshold={lowStockThreshold}
                              className="scale-90 origin-left"
                            />
                            {stock > 0 && stock <= lowStockThreshold && (
                              <p className="text-[13px] text-[#D4A373] font-sans mt-0.5">
                                only {stock} left
                              </p>
                            )}
                          </div>
                        )}
                        {item.note && (
                          <p className="text-xs text-muted-foreground italic truncate mt-0.5">
                            Note: {item.note}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemove(item)}
                        className="shrink-0 h-8 w-8 text-xs font-bold"
                        aria-label={`Remove ${item.name}`}
                      >
                        ×
                      </Button>
                    </div>
                    <div className="flex items-center justify-between border-t border-border pt-2.5 mt-1">
                      <QuantityStepper
                        value={item.quantity}
                        max={stock}
                        onChange={(val) => handleQuantityChange(item, val, stock)}
                      />
                      <span className="font-semibold font-sans text-sm transition-all duration-300">
                        ${itemTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Desktop/Tablet Summary Section */}
            <div className="hidden md:block">
              <Separator className="my-6" />
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="font-sans text-sm"
                >
                  Clear cart
                </Button>
                <div className="flex items-center gap-6">
                  <p
                    className={`text-lg font-semibold text-[#2C3E2A] dark:text-foreground transition-all duration-300 ${
                      isRecalculating ? "opacity-50 scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    Total: ${total.toFixed(2)}
                  </p>
                  <Link href="/checkout">
                    <Button size="lg" className="font-sans font-bold">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sticky Summary Bar for Mobile (Below 768px) */}
      {cart.items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background p-4 shadow-lg md:hidden z-40 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-sans">Total Summary</p>
            <p
              className={`text-lg font-bold font-sans text-[#2C3E2A] dark:text-foreground transition-all duration-300 ${
                isRecalculating ? "opacity-50 scale-95" : "opacity-100 scale-100"
              }`}
            >
              ${total.toFixed(2)}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="font-sans text-xs"
            >
              Clear
            </Button>
            <Link href="/checkout">
              <Button size="sm" className="font-sans font-bold text-xs">
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
