"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { fetchMe, login, logout, register } from "@/lib/auth";
import { isAuthenticated } from "@/lib/api";
import { addToCart, clearCart, fetchCart, removeCartItem, updateCartItem } from "@/lib/cart";
import {
  addGuestWishlistItem,
  addWishlistItemApi,
  fetchWishlistApi,
  getGuestWishlist,
  mergeGuestWishlist,
  removeGuestWishlistItem,
  removeWishlistItemApi,
} from "@/lib/wishlist";
import { Cart, Product, User, WishlistItem } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshUser: () => Promise<User | null>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

interface CartContextValue {
  cart: Cart;
  loading: boolean;
  refresh: () => Promise<void>;
  addItem: (productId: string, quantity: number, note?: string) => Promise<void>;
  updateItem: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clear: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

interface WishlistContextValue {
  wishlist: WishlistItem[];
  loading: boolean;
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<boolean>;
  addToWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Note: Initializing loading via isAuthenticated() (reading localStorage) causes hydration
  // mismatch on full refresh / direct URL navigation because SSR evaluates window === undefined
  // (loading=false, user=null), while client hydrates with loading=true.
  const [loading, setLoading] = useState(() => isAuthenticated());

  useEffect(() => {
    if (isAuthenticated()) {
      fetchMe()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      return null;
    }
    try {
      const me = await fetchMe();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isLoggedIn: !!user,
        login: async (email, password) => {
          await login({ email, password });
          const me = await fetchMe();
          setUser(me);
        },
        register: async (input) => {
          await register(input);
          const me = await fetchMe();
          setUser(me);
        },
        logout: async () => {
          await logout();
          setUser(null);
        },
        updateUser: (updatedUser: User) => {
          setUser(updatedUser);
        },
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart()
      .then(setCart)
      .catch(() => setCart({ items: [] }))
      .finally(() => setLoading(false));
  }, []);

  const addItem = async (productId: string, quantity: number, note?: string) => {
    await addToCart({ productId, quantity, note });
    await refresh();
  };

  const updateItem = async (id: string, quantity: number) => {
    await updateCartItem(id, { quantity });
    await refresh();
  };

  const removeItem = async (id: string) => {
    await removeCartItem(id);
    await refresh();
  };

  const clear = async () => {
    await clearCart();
    await refresh();
  };

  return (
    <CartContext.Provider value={{ cart, loading, refresh, addItem, updateItem, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  );
}

function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshWishlist = useCallback(async () => {
    setLoading(true);
    try {
      if (isLoggedIn) {
        await mergeGuestWishlist();
        const items = await fetchWishlistApi();
        setWishlist(items);
      } else {
        setWishlist(getGuestWishlist());
      }
    } catch {
      setWishlist(getGuestWishlist());
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (authLoading) return;
    let isMounted = true;
    const load = async () => {
      try {
        if (isLoggedIn) {
          await mergeGuestWishlist();
          const items = await fetchWishlistApi();
          if (isMounted) setWishlist(items);
        } else {
          if (isMounted) setWishlist(getGuestWishlist());
        }
      } catch {
        if (isMounted) setWishlist(getGuestWishlist());
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, [isLoggedIn, authLoading]);

  const isInWishlist = useCallback(
    (productId: string) => {
      return wishlist.some((item) => item.productId === productId);
    },
    [wishlist]
  );

  const addToWishlist = async (product: Product) => {
    if (isLoggedIn) {
      try {
        const item = await addWishlistItemApi(product.id);
        setWishlist((prev) => [item, ...prev.filter((i) => i.productId !== product.id)]);
      } catch (err) {
        const updated = addGuestWishlistItem(product);
        setWishlist(updated);
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("already in your wishlist")) {
          throw err;
        }
      }
    } else {
      const updated = addGuestWishlistItem(product);
      setWishlist(updated);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (isLoggedIn) {
      try {
        await removeWishlistItemApi(productId);
        setWishlist((prev) => prev.filter((item) => item.productId !== productId));
      } catch {
        const updated = removeGuestWishlistItem(productId);
        setWishlist(updated);
      }
    } else {
      const updated = removeGuestWishlistItem(productId);
      setWishlist(updated);
    }
  };

  const toggleWishlist = async (product: Product): Promise<boolean> => {
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
      return false;
    } else {
      await addToWishlist(product);
      return true;
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            {children}
            <Toaster position="bottom-right" />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
