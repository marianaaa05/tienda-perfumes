"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
  };
}

interface ShippingAddress {
  id: number;
  department: string;
  city: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  phone1?: string;
  phone2?: string;
  notes?: string;
}

interface User {
  name: string;
  email: string;
}

interface Order {
  id: number;
  user?: User | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  note?: string | null;
  items: OrderItem[];
  shippingAddress?: ShippingAddress | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch("/api/ordersadmin");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Error cargando órdenes:", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // modificar el estado de un orden
  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/ordersadmin/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Error actualizando estado");

      // actualizar lista en UI sin recargar
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );

      // actualizar el modal abierto
      setSelectedOrder((prev) =>
        prev ? { ...prev, status: newStatus } : prev,
      );
    } catch (err) {
      console.error(err);
      alert("Error actualizando estado");
    }
  };

  if (loading) return <p className="p-4">Cargando órdenes...</p>;

  return (
  <div className="p-4 sm:p-6 min-h-screen bg-[#F6F3EC]">
    <h1 className="text-2xl sm:text-3xl text-[#36302A] font-marcellus mb-4">
      Órdenes
    </h1>

    {/* Contenedor con scroll horizontal */}
    <div className="bg-[#F6F3EC] shadow rounded-lg overflow-x-auto">
      <table className="min-w-[900px] w-full border-collapse">
        <thead className="bg-[#574C3F] text-[#F6F3EC] font-pt-serif text-base sm:text-xl">
          <tr>
            <th className="p-2 sm:p-3 border">ID</th>
            <th className="p-2 sm:p-3 border">Cliente</th>
            <th className="p-2 sm:p-3 border">Total</th>
            <th className="p-2 sm:p-3 border">Estado</th>
            <th className="p-2 sm:p-3 border">Nota</th>
            <th className="p-2 sm:p-3 border">Fecha</th>
          </tr>
        </thead>

        <tbody className="text-[#36302A] text-sm sm:text-xl font-pt-serif border-t">
          {orders.map((order) => (
            <tr
              key={order.id}
              className="cursor-pointer hover:bg-[#ECE4DA]"
              onClick={() => setSelectedOrder(order)}
            >
              <td className="p-2 sm:p-3 border text-center">
                {order.id}
              </td>

              <td className="p-2 sm:p-3 border">
                {order.user?.name ?? "Sin usuario"}
              </td>

              <td className="p-2 sm:p-3 border text-center whitespace-nowrap">
                ${order.totalAmount.toFixed(2)}
              </td>

              <td className="p-2 sm:p-3 border text-center">
                {order.status}
              </td>

              <td className="p-2 sm:p-3 border text-center max-w-[200px] truncate">
                {order.note ?? "N/A"}
              </td>

              <td className="p-2 sm:p-3 border text-center whitespace-nowrap">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>


      {/* MODAL */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateOrderStatus}
        />
      )}
    </div>
  );
}

function OrderModal({
  order,
  onClose,
  onUpdateStatus,
}: {
  order: Order;
  onClose: () => void;
  onUpdateStatus: (id: number, status: string) => void;
}) {
  const [newStatus, setNewStatus] = useState(order.status);

  const [newNote, setNewNote] = useState(order.note ?? "");

  const updateNote = async () => {
    await fetch(`/api/ordersadmin/${order.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: newNote }),
    });

    onUpdateStatus(order.id, newStatus);
  };

  return (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
    <div className="bg-[#F6F3EC] w-full max-w-2xl p-4 sm:p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
      <h2 className="text-xl sm:text-2xl font-marcellus text-[#36302A] text-center mb-4">
        Orden #{order.id}
      </h2>

      {/* Cliente */}
      <div className="mb-4">
        <h3 className="font-pt-serif font-semibold text-[#36302A] text-sm sm:text-base">
          Cliente:
        </h3>
        <p className="text-[#36302A] text-sm sm:text-base font-pt-serif">
          {order.user?.name ?? "Sin usuario"}
        </p>
      </div>

      {/* Dirección */}
      {order.shippingAddress && (
        <div className="mb-4">
          <h3 className="font-pt-serif font-semibold text-[#36302A] text-sm sm:text-base">
            Dirección de envío:
          </h3>

          <div className="text-[#36302A] text-sm sm:text-base font-pt-serif space-y-1">
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.department}
            </p>
            <p>Código postal: {order.shippingAddress.postalCode}</p>

            <div className="mt-3">
              <h4 className="font-semibold">Contacto:</h4>
              <p>Teléfono principal: {order.shippingAddress.phone1 ?? "N/A"}</p>
              <p>Teléfono secundario: {order.shippingAddress.phone2 ?? "N/A"}</p>
            </div>
          </div>
        </div>
      )}

      {/* Correo */}
      <div className="mb-4">
        <h3 className="font-pt-serif font-semibold text-[#36302A] text-sm sm:text-base">
          Correo:
        </h3>
        <p className="text-[#36302A] text-sm sm:text-base font-pt-serif">
          {order.user?.email ?? "N/A"}
        </p>
      </div>

      {/* Nota cliente */}
      <div className="mb-4">
        <h3 className="font-pt-serif font-semibold text-[#36302A] text-sm sm:text-base">
          Nota cliente:
        </h3>
        <p className="text-[#36302A] text-sm sm:text-base font-pt-serif">
          {order.shippingAddress?.notes ?? "N/A"}
        </p>
      </div>

      {/* Productos */}
      <div className="mb-4">
        <h3 className="font-pt-serif font-semibold text-[#36302A] text-sm sm:text-base mb-2">
          Productos:
        </h3>

        {order.items.map((item) => (
          <div
            key={item.id}
            className="border-b py-2 flex flex-col sm:flex-row sm:justify-between gap-1 text-sm sm:text-base font-pt-serif text-[#36302A]"
          >
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-gray-600">
                Cantidad: {item.quantity}
              </p>
            </div>
            <p className="font-semibold">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="mb-4">
        <h3 className="font-pt-serif font-semibold text-[#36302A] text-sm sm:text-base">
          Total:
        </h3>
        <p className="text-[#36302A] text-lg sm:text-xl font-pt-serif">
          ${order.totalAmount}
        </p>
      </div>

      {/* Información adicional */}
      <div className="mb-4 font-pt-serif text-[#36302A] text-sm sm:text-base space-y-1">
        <h3 className="font-semibold">Información adicional:</h3>
        <p>
          <strong>Método de pago:</strong> {order.paymentMethod}
        </p>
        <p>
          <strong>Estado:</strong> {order.status}
        </p>
        {order.note && (
          <p>
            <strong>Nota:</strong> {order.note}
          </p>
        )}
      </div>

      {/* Cambiar estado */}
      <div className="mb-4 font-pt-serif text-[#36302A] text-sm sm:text-base">
        <h3 className="font-semibold mb-2">Modificar estado:</h3>

        <select
          className="p-2 border rounded w-full"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
        >
          <option value="PENDING">Pendiente</option>
          <option value="PAID">Pagado</option>
          <option value="SHIPPED">Enviado</option>
          <option value="DELIVERED">Entregado</option>
          <option value="CANCELED">Cancelado</option>
        </select>

        <button
          className="w-full sm:w-auto mt-3 px-4 py-2 bg-[#574C3F] text-white rounded hover:bg-[#B9A590]"
          onClick={() => onUpdateStatus(order.id, newStatus)}
        >
          Actualizar estado
        </button>
      </div>

      {/* Nota admin */}
      <div className="mb-4 font-pt-serif text-[#36302A] text-sm sm:text-base">
        <h3 className="font-semibold mb-2">Nota interna:</h3>
        <textarea
          className="p-2 border rounded w-full"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />

        <button
          className="w-full sm:w-auto mt-3 px-4 py-2 bg-[#574C3F] text-white rounded hover:bg-[#B9A590]"
          onClick={updateNote}
        >
          Actualizar nota
        </button>
      </div>

      <div className="text-right">
        <button
          className="px-4 py-2 bg-[#574C3F] text-white rounded hover:bg-[#B9A590]"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
);

}
