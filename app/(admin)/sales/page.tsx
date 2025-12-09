"use client";

import { useEffect, useState } from "react";

export default function SalesPage() {
  const [stats, setStats] = useState<SalesStats | null>(null);
  interface SalesStats {
    totalRevenue: number;
    totalOrders: number;
    todayOrders: number;
    monthOrders: number;
    completed: number;
    pending: number;
    canceled: number;
  }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch("/api/sales");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <p className="p-6">Cargando estadísticas...</p>;
  if (!stats) return <p className="p-6">No hay datos disponibles.</p>;

  return (
    <div className="p-8 space-y-16 bg-[#F6F3EC] min-h-screen">
      <h1 className="text-3xl text-[#36302A] font-marcellus">
        Panel de Ventas
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 font-pt-serif text-xl text-[#36302A]">
        <Card title="Ingresos Totales 💰" value={stats.totalRevenue} />
        <Card title="Total Órdenes 📦" value={stats.totalOrders} />
        <Card title="Órdenes Hoy 📅" value={stats.todayOrders} />
        <Card title="Órdenes Mes 🗓️" value={stats.monthOrders} />
      </div>

      <h1 className="text-3xl text-[#36302A] font-marcellus mt-12">
        Órdenes por estado
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-pt-serif text-xl text-[#36302A]">
        <Card title="Completadas ✅" value={stats.completed} />
        <Card title="Pendientes ⏳" value={stats.pending} />
        <Card title="Canceladas ❌" value={stats.canceled} />
      </div>
    </div>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 border">
      <h3 className="text-gray-600">{title}</h3>
      <p className="text-3xl font-semibold mt-2">{value}</p>
    </div>
  );
}
