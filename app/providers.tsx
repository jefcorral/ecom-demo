"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { fetchMe, login, logout, register } from "@/lib/auth";
import { isAuthenticated } from "@/lib/api";
import { addToCart, clearCart, fetchCart, removeCartItem, updateCartItem } from "@/lib/cart";
import { Cart, User } from "@/types";

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

function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(() => isAuthenticated());

  useEffect(() => {
    if (isAuthenticated()) {
      fetchMe()
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <CartProvider>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
