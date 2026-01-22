// reporte de ganancias

"use client";

import { useEffect, useState, useRef } from "react";

interface OrderProfit {
  orderId: number;
  revenue: number;
  cost: number;
  profit: number;
  createdAt: string;
  paidAt: string;
  items: OrderItem[];
}

interface ProfitReport {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  orders: OrderProfit[];
}

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export default function ProfitReportPage() {
  // exportar a pdf
  const pdfRef = useRef<HTMLDivElement>(null);
  const exportPDF = async () => {
    if (!pdfRef.current) return;

    const html2pdf = (await import("html2pdf.js")).default;

    html2pdf()
      .from(pdfRef.current)
      .set({
        margin: 10,
        filename: "reporte-ganancias.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .save();
  };

  const [data, setData] = useState<ProfitReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const toggleOrder = (orderId: number) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  useEffect(() => {
    const loadReport = async () => {
      try {
        const res = await fetch("/api/reports");

        if (!res.ok) {
          throw new Error("Error cargando reporte");
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el reporte de ganancias");
      } finally {
        setLoading(false);
      }
    };

    loadReport();
  }, []);

  if (loading) {
    return <p className="p-6">Cargando reporte...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  if (!data) return null;

  return (
    <div ref={pdfRef}>
      <div className="p-6 min-h-screen bg-[#F6F3EC]">
        <h1 className="text-3xl font-marcellus text-[#36302A] mb-6">
          Reporte de Ganancias
        </h1>

        {/* RESUMEN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card title="Ingresos Totales" value={data.totalRevenue} />
          <Card title="Costo Total" value={data.totalCost} />
          <Card title="Ganancia Total" value={data.totalProfit} highlight />
        </div>

        {/* TABLA */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#574C3F] text-[#F6F3EC] text-lg font-pt-serif">
              <tr>
                <th className="p-3 border">Orden</th>
                <th className="p-3 border">Fecha de Orden</th>
                <th className="p-3 border">Fecha de Pago</th>
                <th className="p-3 border">Ingresos</th>
                <th className="p-3 border">Costo</th>
                <th className="p-3 border">Ganancia</th>
              </tr>
            </thead>
            <tbody className="text-[#36302A] font-pt-serif text-lg">
              {data.orders.map((order) => (
                <>
                  {/* FILA PRINCIPAL */}
                  <tr
                    key={order.orderId}
                    className="hover:bg-[#ECE4DA] cursor-pointer"
                    onClick={() => toggleOrder(order.orderId)}
                  >
                    <td className="p-3 border text-center">#{order.orderId}</td>

                    <td className="p-3 border text-center">
                      {new Date(order.createdAt).toLocaleDateString("es-CO")}
                    </td>

                    <td className="p-3 border text-center">
                      {order.paidAt
                        ? new Date(order.paidAt).toLocaleDateString("es-CO")
                        : "—"}
                    </td>

                    <td className="p-3 border text-right">
                      ${order.revenue.toLocaleString("es-CO")}
                    </td>

                    <td className="p-3 border text-right">
                      ${order.cost.toLocaleString("es-CO")}
                    </td>

                    <td
                      className={`p-3 border text-right font-semibold ${
                        order.profit >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ${order.profit.toLocaleString("es-CO")}
                    </td>
                  </tr>

                  {/* FILA EXPANDIDA */}
                  {expandedOrder === order.orderId && (
                    <tr className="bg-[#F9F7F3]">
                      <td colSpan={6} className="p-4 border">
                        <div className="text-sm">
                          <p className="font-semibold mb-2">
                            Productos de la orden:
                          </p>

                          <table className="w-full border text-sm">
                            <thead className="bg-[#DED6CC]">
                              <tr>
                                <th className="p-2 border text-left">
                                  Producto
                                </th>
                                <th className="p-2 border text-center">
                                  Cantidad
                                </th>
                                <th className="p-2 border text-right">
                                  Precio Unit.
                                </th>
                                <th className="p-2 border text-right">
                                  Subtotal
                                </th>
                              </tr>
                            </thead>

                            <tbody>
                              {order.items.map((item, index) => (
                                <tr key={index}>
                                  <td className="p-2 border">{item.name}</td>
                                  <td className="p-2 border text-center">
                                    {item.quantity}
                                  </td>
                                  <td className="p-2 border text-right">
                                    ${item.price.toLocaleString("es-CO")}
                                  </td>
                                  <td className="p-2 border text-right">
                                    $
                                    {(
                                      item.price * item.quantity
                                    ).toLocaleString("es-CO")}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => window.print()}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded print:hidden"
        >
          Exportar PDF
        </button>
      </div>
    </div>
  );
}

/* 🔹 COMPONENTE CARD */
function Card({
  title,
  value,
  highlight,
}: {
  title: string;
  value: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-5 shadow text-center ${
        highlight ? "bg-green-100" : "bg-white"
      }`}
    >
      <h3 className="text-lg font-pt-serif text-[#574C3F] mb-2">{title}</h3>
      <p
        className={`text-2xl font-bold ${
          highlight ? "text-green-700" : "text-[#36302A]"
        }`}
      >
        ${value.toLocaleString("es-CO")}
      </p>
    </div>
  );
}
