"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

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

interface CartItem {
  id: number;
  cantidad: number;
}

export default function CartPage() {
  const { isLoaded, isSignedIn } = useUser();

  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[] | null>(null); // null = loading
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);

  // estados para mostrar formulario de pago
  const [department, setDepartment] = useState("");
  const [city, setCity] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [postalCode, setPostalCode] = useState("");
  // const [documentUser, setDocumentUser] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [note, setNote] = useState("");

  // revisa si el usuario está logueado para mostrar el carrito
  useEffect(() => {
    if (!isLoaded) return;

    const load = async () => {
      if (isSignedIn) {
        try {
          const res = await fetch("/api/cart", { credentials: "include" });
          if (res.ok) {
            const json = await res.json();
            setCart(json.items ?? []);
            // also sync products/localStorage if needed
          } else {
            // fallback localStorage
            const raw = localStorage.getItem("cart");
            setCart(raw ? JSON.parse(raw) : []);
          }
        } catch {
          const raw = localStorage.getItem("cart");
          setCart(raw ? JSON.parse(raw) : []);
        }
      } else {
        const raw = localStorage.getItem("cart");
        setCart(raw ? JSON.parse(raw) : []);
      }
    };

    load();
  }, [isLoaded, isSignedIn]);

  // fetch products for display
  useEffect(() => {
    const f = async () => {
      const res = await fetch("/api/products");
      setProducts(await res.json());
    };
    f();
  }, []);

  // save to server/local when cart changes
  useEffect(() => {
    if (cart === null) return;
    localStorage.setItem("cart", JSON.stringify(cart));
    if (isLoaded && isSignedIn) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
        credentials: "include",
      }).catch((e) => console.warn("guardar carrito server failed", e));
    }
  }, [cart, isLoaded, isSignedIn]);

  if (!isLoaded || cart === null) {
    return (
      <div className="text-center mt-40 text-lg text-[#574C3F]">
        Cargando carrito...
      </div>
    );
  }

  if (isLoaded && !isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#ECE4DA] px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-marcellus text-[#36302A] mb-4">
          Debes iniciar sesión para ver tu carrito 🛍️
        </h2>
        <SignInButton mode="modal">
          <button className="bg-[#B9A590] text-white rounded-full px-6 py-2 text-sm sm:text-base">
            Iniciar sesión
          </button>
        </SignInButton>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#ECE4DA] px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-marcellus text-[#36302A] mb-4">
          Tu carrito está vacío 🛍️
        </h2>
        <Link
          href="/"
          className="bg-[#574C3F] text-white px-6 py-3 rounded-full"
        >
          Ir a la tienda
        </Link>
      </div>
    );
  }

  const increaseQty = (id: number) =>
    setCart((prev) =>
      prev!.map((p) => (p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p)),
    );
  const decreaseQty = (id: number) =>
    setCart((prev) =>
      prev!
        .map((p) => (p.id === id ? { ...p, cantidad: p.cantidad - 1 } : p))
        .filter((p) => p.cantidad > 0),
    );
  const removeFromCart = (id: number) =>
    setCart((prev) => prev!.filter((p) => p.id !== id));

  const total = cart.reduce((acc, item) => {
    const product = products.find((p) => p.id === item.id);
    return acc + (product ? product.price * item.cantidad : 0);
  }, 0);

  // llamar a la API para crear la orden
  const createOrder = async () => {
    try {
      if (!cart || cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      const payload = {
        cartItems: cart,
        department,
        city,
        addressLine1,
        addressLine2,
        postalCode,
        phone1,
        phone2,
        paymentMethod,
        note,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error al crear orden:", data);
        alert(data.error || "Error al crear la orden.");
        return;
      }

      alert("Orden creada con éxito ✔️");

      // Vaciar carrito al registrar la orden
      setCart([]);
      localStorage.removeItem("cart");
    } catch (error) {
      console.error("❌ Error al enviar orden:", error);
      alert("Error inesperado. Intenta nuevamente.");
    }
  };

  // si el stock es 0 → no permite incrementar
  const canAddMore = (item: Product) => {
    const enCarrito = cart.find((c) => c.id === item.id)?.cantidad || 0;
    return item.stock !== undefined && enCarrito < item.stock;
  };

  // validaciones del formulario, los campos con * son obligatorios
  const validateCheckoutForm = () => {
    const newErrors: Record<string, string> = {};

    if (!department.trim())
      newErrors.department = "El departamento es obligatorio";
    if (!city.trim()) newErrors.city = "La ciudad es obligatoria";
    if (!addressLine1.trim())
      newErrors.addressLine1 = "La dirección es obligatoria";

    if (!phone1.trim()) {
      newErrors.phone1 = "El teléfono es obligatorio";
    } else if (!/^[0-9+\s-]{7,15}$/.test(phone1)) {
      newErrors.phone1 = "Número de teléfono inválido";
    }

    if (!paymentMethod) {
      newErrors.paymentMethod = "Selecciona un método de pago";
    }

    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className="bg-[#ECE4DA] min-h-screen flex flex-col items-center py-14 sm:py-20 px-2 sm:px-6">
      <h2 className="text-3xl sm:text-4xl font-marcellus text-[#36302A] mb-8 text-center">
        Tu carrito 🛒
      </h2>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-md p-4 sm:p-6 space-y-6">
        {cart.map((item) => {
          const product = products.find((p) => p.id === item.id);
          if (!product) return null;
          return (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-4 sm:pb-6"
            >
              <div className="flex items-center gap-4">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="rounded-lg object-cover"
                />
                <div>
                  <h3 className="text-xl sm:text-2xl font-marcellus text-[#36302A]">
                    {product.name}
                  </h3>
                  <p className="text-[#574C3F] text-lg sm:text-base">
                    ${product.price.toLocaleString("es-CO")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => decreaseQty(product.id)}
                  className="border px-3 py-1 rounded-full bg-[#B9A590] hover:bg-[#574C3F] hover:text-white"
                >
                  -
                </button>
                <span className="font-pt-serif text-[#574C3F]">
                  {item.cantidad}
                </span>
                {/* si el stock es 0 → no permite incrementar */}
                {canAddMore(product) && (
                  <button
                    onClick={() => increaseQty(product.id)}
                    className="border px-3 py-1 rounded-full bg-[#B9A590] hover:bg-[#574C3F] hover:text-white"
                  >
                    +
                  </button>
                )}
                <button
                  onClick={() => removeFromCart(product.id)}
                  className="ml-4 text-sm font-pt-serif text-red-500 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-[#574C3F] text-white font-pt-serif px-8 py-4 rounded-full shadow-md text-xl">
        Total: ${total.toLocaleString("es-CO")}
      </div>
      <Link href="/">
        <button className="mt-6 bg-[#36302A] text-white font-pt-serif px-8 py-3 rounded-full hover:bg-[#4a4035] transition">
          Volver a la tienda
        </button>
      </Link>

      {cart.length > 0 && (
        <button
          className="mt-6 bg-green-400 text-white font-pt-serif px-8 py-3 rounded-full hover:bg-green-500"
          onClick={() => setShowCheckoutForm(true)}
        >
          Finalizar compra
        </button>
      )}

     <div className="mt-6 w-full max-w-2xl bg-white rounded-2xl p-5 shadow shadow-orange-400 border border-[#ECE4DA]">
  <h2 className="text-lg sm:text-xl font-marcellus text-orange-500 text-center">
    Tener en cuenta❗
  </h2>

  <p className="mt-3 text-sm sm:text-base text-center font-pt-serif text-[#574C3F]">
    El pago se realiza contra entrega e incluye el domicilio.  
    Los productos serán entregados en un plazo de 3 a 5 días hábiles.
  </p>
</div>






      {showCheckoutForm && (
        <div className="mt-10 w-full max-w-2xl bg-white text-[#574C3F] p-4 sm:p-6 rounded-xl shadow-md">
          <h3 className="text-2xl sm:text-3xl text-center font-marcellus text-[#36302A] mb-6">
            Datos de envío y pago
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-pt-serif text-base sm:text-lg">
            <input
              type="text"
              placeholder="Departamento *"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590]"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              type="text"
              placeholder="Ciudad *"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <input
              type="text"
              placeholder="Dirección *"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590]"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
            />

            <input
              type="text"
              placeholder="Dirección adicional (opcional)"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590]"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
            />

            <input
              type="text"
              placeholder="Código Postal"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590]"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />

            <input
              type="text"
              placeholder="Teléfono principal *"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590]"
              value={phone1}
              onChange={(e) => setPhone1(e.target.value)}
            />

            <input
              type="text"
              placeholder="Teléfono adicional (opcional)"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590]"
              value={phone2}
              onChange={(e) => setPhone2(e.target.value)}
            />

            <select
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590]"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="">Método de pago *</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="PSE">PSE</option>
              <option value="CUOTAS">Cuotas</option>
            </select>

            <input
              type="text"
              placeholder="Nota (opcional)"
              className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-[#B9A590] md:col-span-2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <button
            onClick={createOrder}
            className="mt-6 w-full bg-green-500 text-white text-lg sm:text-xl font-pt-serif px-8 py-3 rounded-full hover:bg-green-600 transition"
          >
            Confirmar pedido
          </button>

          <button
            onClick={() => setShowCheckoutForm(false)}
            className="mt-4 w-full text-red-500 text-base sm:text-lg font-pt-serif hover:underline"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}
