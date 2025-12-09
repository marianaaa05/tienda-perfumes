// hooks/useCart.ts
"use client";

import { useEffect, useState } from "react";

export type CartItem = { id: number; cantidad: number };

export function useCart() {
  // Lazy initializer lee localStorage inmediatamente en el primer render cliente.
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) as CartItem[] : [];
    } catch {
      return [];
    }
  });

  // Escribe en localStorage cuando cambie cart
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
      // notificar a otros listeners en la misma pestaña (opcional)
      window.dispatchEvent(new Event("cart_updated"));
    } catch (e) {
      console.error("Error guardando carrito:", e);
    }
  }, [cart]);

  // Escucha cambios externos (storage entre pestañas y nuestro evento)
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "cart") {
        try {
          const newVal = e.newValue;
          setCart(newVal ? JSON.parse(newVal) : []);
        } catch { /* ignore */ }
      }
    };
    const onCustom = () => {
      const raw = localStorage.getItem("cart");
      try {
        setCart(raw ? JSON.parse(raw) : []);
      } catch { /* ignore */ }
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart_updated", onCustom);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart_updated", onCustom);
    };
  }, []);

  return { cart, setCart };
}
