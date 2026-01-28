"use client";

import { useEffect, useState } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";

interface Order {
  id: number;
  status: string;
  createdAt?: string;
  items: {
    id: number;
    quantity: number;
    price: number;
    product: {
      id: number;
      name: string;
    };
  }[];
}

export default function MisPedidos() {
  const { isLoaded, isSignedIn } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  const loadOrders = async () => {
    const res = await fetch("/api/ordersUser");
    const data = await res.json();

    setOrders(data.filter((o: Order) => o.status !== "CANCELED"));
    setLoading(false);
  };

  useEffect(() => {
    if (isSignedIn) loadOrders();
  }, [isSignedIn]);

  if (!isLoaded) {
    return <p className="text-center mt-20">Cargando...</p>;
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-marcellus">Debes iniciar sesión</h2>

        <SignInButton mode="modal">
          <button className="bg-[#B9A590] text-white px-6 py-2 rounded-full">
            Iniciar sesión
          </button>
        </SignInButton>
      </div>
    );
  }

  const cancelOrder = async (id: number) => {
    if (
      !confirm(
        "¿Seguro deseas cancelar este pedido?, este paso no se puede deshacer.",
      )
    )
      return;

    try {
      setCancelingId(id);

      const res = await fetch(`/api/ordersUser/${id}`, {
        method: "PATCH",
      });

      if (!res.ok) throw new Error();

      await loadOrders();
    } catch {
      alert("No se pudo cancelar el pedido");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Cargando pedidos...</p>;
  }

  // diccionario de estados
  const statusDic = {
    PENDING: "Pendiente",
    PAID: "Pagado",
    SHIPPED: "Enviado",
    DELIVERED: "Entregado",
    CANCELED: "Cancelado",
  };

  return (
    <div className="min-h-screen bg-[#ECE4DA] p-6">
      <h2 className="text-3xl font-marcellus text-center mb-8 text-[#36302A]">
        Mis pedidos
      </h2>

      {orders.length === 0 && (
        <p className="text-center text-[#574C3F]">No tienes pedidos activos.</p>
      )}

      <div className="max-w-2xl mx-auto space-y-4 text-[#36302A] font-pt-serif">
        <div className="mt-6 bg-white rounded-2xl p-5 shadow shadow-orange-400 border border-[#ECE4DA]">
          <h2 className="text-lg sm:text-xl font-marcellus text-orange-500 text-center">
            Tener en cuenta❗
          </h2>

          <p className="mt-3 text-sm sm:text-base text-center font-pt-serif text-[#574C3F]">
            Los pedidos en estado PENDIENTE pueden ser cancelados por el
            usuario.
            <br />
            Una vez que un pedido cambia a PAGADO o ENVIADO, ya no podrá ser
            cancelado.
            <br />
            Una vez que cancele un pedido, este cambiará a estado CANCELADO y no
            podrá ser restaurado.
          </p>
        </div>

        {orders.map((order) => {
          const normalizedStatus = order.status?.toUpperCase().trim();

          return (
            <div
              key={order.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-pt-serif text-[#574C3F]">
                  Pedido #{order.id}
                </p>
                <p className="text-[#574C3F] font-pt-serif">
                  Fecha de creación:
                </p>
                <p className="text-sm font-pt-serif">
                  {order.createdAt &&
                    new Date(order.createdAt).toLocaleDateString()}
                </p>

                <div className="mt-2">
                  <p className="font-pt-serif">Items:</p>
                  <ul className="list-disc list-inside font-pt-serif">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity} x {item.product.name} - ${item.price}{" "}
                        (precio unitario)
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-2">
                  <p className="font-pt-serif">Total:</p>
                  <p className="text-2xl font-pt-serif">
                    ${order.items.reduce((acc, item) => acc + item.price, 0)}
                  </p>
                </div>
                <span
                  className={`text-sm px-2 py-1 rounded mt-2 inline-block
                  ${
                    normalizedStatus === "PENDING"
                      ? "bg-yellow-200 text-yellow-800"
                      : normalizedStatus === "PAID"
                        ? "bg-blue-200 text-blue-800"
                        : normalizedStatus === "CANCELED"
                          ? "bg-red-200 text-red-800"
                          : "bg-green-200 text-green-800"
                  }`}
                >
                  {statusDic[normalizedStatus as keyof typeof statusDic] ??
                    normalizedStatus}
                </span>
              </div>

              {normalizedStatus === "PENDING" && (
                <button
                  disabled={cancelingId === order.id}
                  onClick={() => cancelOrder(order.id)}
                  className="text-red-500 hover:underline font-pt-serif disabled:opacity-50"
                >
                  {cancelingId === order.id
                    ? "Cancelando..."
                    : "Cancelar pedido"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
