"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignOutButton } from "@clerk/nextjs";
import NextLink from "next/link";
import Image from "next/image";

type DashboardStats = {
  activeProducts: number;
  pendingOrders: number;
  totalClients: number;
  totalSales: number;
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    async function fetchDashboard() {
      const res = await fetch("/api/dashboard");
      const data = await res.json();
      setStats(data);
    }
    fetchDashboard();
  }, []);

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Cargando datos del administrador...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F6F3EF] text-[#36302A]">
      {/* 🟫 Sidebar */}
      <aside className="w-64 bg-[#ECE4DA] p-6 flex flex-col justify-between border-r border-[#B9A590]">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Image
              src="/logo.png"
              alt="Logo"
              width={92}
              height={92}
              className="object-cover"
            />
            <h2 className="text-xl font-marcellus">Panel Admin</h2>
          </div>

          <nav className="flex flex-col space-y-4 font-pt-serif">
            <NextLink
              href="/products"
              className="hover:text-[#B9A590] cursor-pointer"
            >
              📦 Productos
            </NextLink>

            <NextLink
              href="/orders"
              className="hover:text-[#B9A590] cursor-pointer"
            >
              🛒 Pedidos
            </NextLink>

            <NextLink
              href="/sales"
              className="hover:text-[#B9A590] cursor-pointer"
            >
              💰 Ventas
            </NextLink>

            <NextLink href="/reports" className="hover:text-[#B9A590] cursor-pointer">
              📊 Reportes
            </NextLink>

            <NextLink
              href="/clients"
              className="hover:text-[#B9A590] cursor-pointer"
            >
              👥 Clientes
            </NextLink>
          </nav>
        </div>

        <SignedIn>
          <SignOutButton>
            <button className="bg-[#574C3F] text-white py-2 rounded-md hover:bg-[#36302A] transition">
              Cerrar sesión
            </button>
          </SignOutButton>
        </SignedIn>
      </aside>

      {/* 🟦 Main Dashboard */}
      <main className="flex-1 p-10">
        <h1 className="text-4xl font-marcellus mb-8">
          Bienvenido, Administrador
        </h1>

        {/* Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* tarjeta link a productos */}
          <NextLink href="/products">
            <div className="bg-white shadow rounded-xl p-6 text-center transition-all hover:scale-105 cursor-pointer">
              <h3 className="text-2xl font-marcellus text-[#36302A] font-semibold">
                📦 Productos
              </h3>
            </div>
          </NextLink>

          <NextLink href="/orders">
            <div className="bg-white shadow rounded-xl p-6 text-center transition-all hover:scale-105 cursor-pointer">
              <h3 className="text-2xl font-marcellus text-[#36302A] font-semibold">
                🛒 Pedidos
              </h3>
            </div>
          </NextLink>

          <NextLink href="/sales">
            <div className="bg-white shadow rounded-xl p-6 text-center transition-all hover:scale-105 cursor-pointer">
              <h3 className="text-2xl font-marcellus text-[#36302A] font-semibold">
                💰 Ventas
              </h3>
            </div>
          </NextLink>

          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h2 className="text-2xl font-marcellus">{stats.activeProducts}</h2>
            <p className="font-pt-serif text-[#574C3F]">Productos activos</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h2 className="text-2xl font-marcellus">{stats.pendingOrders}</h2>
            <p className="font-pt-serif text-[#574C3F]">Pedidos pendientes</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 text-center">
            <h2 className="text-2xl font-marcellus">
              ${stats.totalSales.toLocaleString()}
            </h2>
            <p className="font-pt-serif text-[#574C3F]">Ventas totales</p>
          </div>
        </div>
      </main>
    </div>
  );
}
