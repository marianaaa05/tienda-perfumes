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
  addressLine1: string;
  city: string;
  department: string;
  phone?: string;
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
    setOrders(prev =>
      prev.map(o =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    // actualizar el modal abierto
    setSelectedOrder(prev =>
      prev ? { ...prev, status: newStatus } : prev
    );
  } catch (err) {
    console.error(err);
    alert("Error actualizando estado");
  }
};


  if (loading) return <p className="p-4">Cargando órdenes...</p>;

  return (
    <div className="p-6 min-h-screen bg-[#F6F3EC]">
        <h1 className="text-3xl text-[#36302A] font-marcellus">Órdenes</h1>

      <div className="bg-[#F6F3EC] shadow rounded-lg overflow-hidden">
        <table className="w-full border-collapse">
        <thead className="bg-[#574C3F] text-[#F6F3EC] font-pt-serif text-xl">
            <tr>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Cliente</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Estado</th>
              <th className="p-3 border">Fecha</th>
            </tr>
          </thead>

          <tbody className="text-[#36302A] text-xl font-pt-serif border-t">
            {orders.map((order) => (
              <tr
                key={order.id}
                className="cursor-pointer hover:bg-[#ECE4DA]"
                onClick={() => setSelectedOrder(order)}
              >
                <td className="p-3 border text-center">{order.id}</td>
                <td className="p-3 border">{order.user?.name ?? "Sin usuario"}</td>
                <td className="p-3 border text-center">
                  ${order.totalAmount.toFixed(2)}
                </td>
                <td className="p-3 border text-center">{order.status}</td>
                <td className="p-3 border text-center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} 
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

  return (
    <div className="bg-[#F6F3EC] flex items-center justify-center z-50">
      <div className="bg-[#F6F3EC] w-full max-w-lg p-6 rounded-lg shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-marcellus text-[#36302A] text-center mb-4">
          Orden #{order.id}
        </h2>

        {/* Cliente */}
        <div className="mb-4">
          <h3 className="font-pt-serif font-semibold text-[#36302A] text-xl">Cliente:</h3>
          <p className="text-[#36302A] text-xl font-pt-serif">{order.user?.name}</p>
        </div>

        {/* Dirección */}
        {order.shippingAddress && (
          <div className="mb-4">
            <h3 className="font-pt-serif font-semibold text-[#36302A] text-xl">Dirección de envío:</h3>
            <p className="text-[#36302A] text-xl font-pt-serif">
              {order.shippingAddress.addressLine1},{" "}
              {order.shippingAddress.city},{" "}
              {order.shippingAddress.department}
            </p>
          </div>
        )}

        {/* Contacto */}
        <div className="mb-4">
          <h3 className="font-pt-serif font-semibold text-[#36302A] text-xl">Contacto:</h3>
          <p className="text-[#36302A] text-xl font-pt-serif">
            {order.shippingAddress?.phone}
            <br />
            {order.user?.email}
          </p>
        </div>

        {/* Productos */}
        <div className="mb-4">
          <h3 className="font-pt-serif font-semibold text-[#36302A] text-xl mb-2">Productos:</h3>

          {order.items.map((item) => (
            <div key={item.id} className="border-b py-2 flex justify-between font-pt-serif text-[#36302A] text-xl">
              <div>
                <p className="font-semibold">{item.product.name}</p>
                <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
              </div>
              <p>${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mb-4">
          <h3 className="font-pt-serif font-semibold text-[#36302A] text-xl">Total:</h3>
          <p className="text-[#36302A] text-2xl font-pt-serif">
            $ {order.totalAmount}
          </p>
        </div>

        {/* Información extra */}
        <div className="mb-4 font-pt-serif text-[#36302A] text-xl">
          <h3 className="font-semibold">Información adicional:</h3>
          <p><strong>Método de pago:</strong> {order.paymentMethod}</p>
          <p><strong>Estado:</strong> {order.status}</p>
          {order.note && <p><strong>Nota:</strong> {order.note}</p>}
        </div>

        {/* CAMBIAR ESTADO */}
        <div className="mb-4 font-pt-serif text-[#36302A] text-xl">
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
            className="mt-3 px-4 py-2 bg-[#574C3F] text-white rounded hover:bg-[#B9A590]"
            onClick={() => onUpdateStatus(order.id, newStatus)}
          >
            Actualizar estado
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
