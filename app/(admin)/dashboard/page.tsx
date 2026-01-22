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
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F6F3EF] text-[#36302A]">
      {/* header móvil */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#ECE4DA] border-b border-[#B9A590]">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="font-marcellus text-lg">Panel Admin</span>
        </div>

        <button
          onClick={() => setMenuOpen(true)}
          className="text-3xl"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {/* 📱 Sidebar móvil */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />

          {/* Menú */}
          <aside className="w-64 bg-[#ECE4DA] p-6 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-marcellus">Menú</h2>
                <button onClick={() => setMenuOpen(false)} className="text-2xl">
                  ✕
                </button>
              </div>

              <nav className="flex flex-col space-y-4 font-pt-serif">
                <NextLink href="/products" onClick={() => setMenuOpen(false)}>
                  📦 Productos
                </NextLink>
                <NextLink href="/orders" onClick={() => setMenuOpen(false)}>
                  🛒 Pedidos
                </NextLink>
                <NextLink href="/sales" onClick={() => setMenuOpen(false)}>
                  💰 Ventas
                </NextLink>
                <NextLink href="/reports" onClick={() => setMenuOpen(false)}>
                  📊 Reportes
                </NextLink>
                {/* <NextLink href="/clients" onClick={() => setMenuOpen(false)}>
                  👥 Clientes
                </NextLink> */}
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
        </div>
      )}

      {/* 🟫 Sidebar desktop */}
      <aside className="hidden md:flex w-64 bg-[#ECE4DA] p-6 flex-col justify-between border-r border-[#B9A590]">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <Image src="/logo.png" alt="Logo" width={92} height={92} />
            <h2 className="text-xl font-marcellus">Panel Admin</h2>
          </div>

          <nav className="flex flex-col space-y-4 font-pt-serif">
            <NextLink href="/products">📦 Productos</NextLink>
            <NextLink href="/orders">🛒 Pedidos</NextLink>
            <NextLink href="/sales">💰 Ventas</NextLink>
            <NextLink href="/reports">📊 Reportes</NextLink>
            {/* <NextLink href="/clients">👥 Clientes</NextLink> */}
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
      <main className="flex-1 p-4 sm:p-6 md:p-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-marcellus mb-6">
          Bienvenido, Administrador
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <NextLink href="/products">
            <div className="bg-white shadow rounded-xl p-6 text-center hover:scale-105 transition">
              📦 Productos
            </div>
          </NextLink>

          <NextLink href="/orders">
            <div className="bg-white shadow rounded-xl p-6 text-center hover:scale-105 transition">
              🛒 Pedidos
            </div>
          </NextLink>

          <NextLink href="/sales">
            <div className="bg-white shadow rounded-xl p-6 text-center hover:scale-105 transition">
              💰 Ventas
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
