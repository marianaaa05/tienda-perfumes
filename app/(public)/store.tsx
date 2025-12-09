"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";

interface Product {
  id: number;
  name: string;
  description?: string;
  brand: string;
  price: number;
  imageUrl: string;
  gender?: string;
  stock?: number;
}
interface CartItem { id: number; cantidad: number; }

export default function Store() {
  const { isLoaded, isSignedIn, user } = useUser();

  const [products, setProducts] = useState<Product[]>([]);
  // null = todavía cargando el carrito; [] = vacío
  const [cart, setCart] = useState<CartItem[] | null>(null);
  const [mounted, setMounted] = useState(false);

  // 1) fetch productos (normal)
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (e) {
        console.error("err productos", e);
      }
    };
    fetchProducts();
  }, []);

  // 2) cargar carrito: si existe sesión -> llamar API /api/cart, si no -> localStorage
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    // esperar a que Clerk esté listo (evita render prematuro)
    if (!mounted) return;

    const load = async () => {
      if (isLoaded && isSignedIn) {
        // pedir carrito desde servidor (Supabase) usando endpoint seguro
        try {
          const res = await fetch("/api/cart", { credentials: "include" });
          if (res.ok) {
            const json = await res.json();
            // json.items expected: CartItem[]
            setCart(json.items ?? []);
            // sincronizar también a localStorage
            localStorage.setItem("cart", JSON.stringify(json.items ?? []));
            return;
          }
        } catch (e) {
          console.warn("No se pudo cargar carrito desde API, fallback localStorage", e);
        }
      }

      // fallback: localStorage (usuario no logueado o API falló)
      try {
        const raw = localStorage.getItem("cart");
        setCart(raw ? JSON.parse(raw) : []);
      } catch {
        setCart([]);
      }
    };

    load();
  }, [mounted, isLoaded, isSignedIn, user?.id]);

  // 3) guardar: cada vez que cambie cart, persistir localStorage y (si está logueado) llamar API para guardar en Supabase
  useEffect(() => {
    if (cart === null) return;
    localStorage.setItem("cart", JSON.stringify(cart));

    const persist = async () => {
      if (isLoaded && isSignedIn) {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: cart }),
            credentials: "include",
          });
        } catch (e) {
          console.warn("No se pudo guardar carrito en servidor:", e);
        }
      }
    };
    persist();
  }, [cart, isLoaded, isSignedIn, user?.id]);


  const addToCart = (id: number) => {
  const item = products.find(p => p.id === id);
  if (!item) return;

  const enCarrito = getCantidad(id);

  if (item.stock !== undefined && enCarrito >= item.stock) {
    alert("No puedes agregar más, alcanzaste el stock disponible.");
    return;
  }

  setCart((prev) => {
    const base = prev ?? [];
    const found = base.find((p) => p.id === id);
    if (found) return base.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p));
    return [...base, { id, cantidad: 1 }];
  });
};


  const increaseQty = (id: number) => {
    setCart((prev) => (prev ?? []).map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p)));
  };

  const decreaseQty = (id: number) => {
    setCart((prev) =>
      (prev ?? [])
        .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
        .filter((p) => p.cantidad > 0)
    );
  };

  const getCantidad = (id: number) => {
    const arr = cart ?? [];
    const item = arr.find((p) => p.id === id);
    return item ? item.cantidad : 0;
  };

  const totalProductos = (cart ?? []).reduce((acc, p) => acc + p.cantidad, 0);

  // durante carga del carrito mostramos placeholders y no renderizamos número (evita hydration mismatch)
  if (!mounted || cart === null) {
    return (
      <div className="bg-[#ECE4DA] min-h-screen flex flex-col items-center mt-56">
        <h2 className="text-4xl font-marcellus mt-12 text-[#36302A]">Nuestros productos</h2>
        <div className="text-center mt-12">Cargando...</div>
      </div>
    );
  }

  // Filtrar productos sin stock
const filteredProducts = products.filter(item => (item.stock ?? 0) > 0);

const canAddMore = (item: Product) => {
  const enCarrito = getCantidad(item.id);
  return item.stock !== undefined && enCarrito < item.stock;
};


return (
  <div className="bg-[#ECE4DA] min-h-screen flex flex-col items-center mt-56">
    <h2 className="text-4xl font-marcellus mt-12 text-[#36302A]">Nuestros productos</h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 w-full max-w-6xl px-6">
      {filteredProducts.map((item) => (
        <div key={item.id} className="flex flex-col items-center gap-4 p-6 bg-[#ECE4DA] rounded-xl shadow-md border border-[#B9A590] transition-all hover:scale-105">
          
          <Image 
            src={item.imageUrl}
            alt={item.name}
            width={250}
            height={250}
            className="object-cover w-full h-72 rounded-full"
          />

          <div className="flex flex-col items-center text-center">
            <div className="text-2xl font-marcellus text-[#36302A] font-semibold">{item.name}</div>
            <div className="text-lg font-pt-serif text-[#B9A590]">{item.gender === "MUJER" ? "Mujer" : "Hombre"}</div>
            <div className="text-lg font-pt-serif text-[#574C3F]">{item.description}</div>
            <div className="font-pt-serif text-[#574C3F] font-semibold">{item.stock} disponibles</div>
            <div className="text-2xl font-pt-serif text-[#574C3F] font-semibold">${item.price.toLocaleString("es-CO")}</div>

            {/* BOTÓN AGREGAR DESACTIVADO SI NO PUEDE AGREGAR MÁS */}
            <button
              onClick={() => canAddMore(item) && addToCart(item.id)}
              disabled={!canAddMore(item)}
              className={`text-[#574C3F] border-2 px-4 py-2 rounded-full mt-2 transition
                ${canAddMore(item) 
                  ? "hover:text-white hover:bg-[#574C3F]" 
                  : "opacity-50 cursor-not-allowed"
                }`}
            >
              {canAddMore(item) ? "Agregar al carrito" : "Sin stock disponible"}
            </button>

            {getCantidad(item.id) > 0 && (
              <div className="flex items-center gap-4 mt-2">
                <button 
                  onClick={() => decreaseQty(item.id)} 
                  className="text-[#574C3F] border-2 px-4 py-2 rounded-full hover:bg-[#574C3F] hover:text-white"
                >
                  -
                </button>

                <span className="text-lg font-pt-serif text-[#36302A]">
                  {getCantidad(item.id)}
                </span>

                <button 
                  onClick={() => {
                    if (canAddMore(item)) increaseQty(item.id)
                    else alert("No puedes agregar más, stock insuficiente");
                  }} 
                  className={`text-[#574C3F] border-2 px-4 py-2 rounded-full
                    ${canAddMore(item) 
                      ? "hover:bg-[#574C3F] hover:text-white" 
                      : "opacity-50 cursor-not-allowed"
                    }`}
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>

    <Link href="/cart">
      <div className="fixed bottom-6 right-6 bg-[#574C3F] text-white px-6 py-3 rounded-full shadow-lg font-marcellus">
        🛒 {totalProductos} producto{totalProductos !== 1 ? "s" : ""}
      </div>
    </Link>
  </div>
);
}

 