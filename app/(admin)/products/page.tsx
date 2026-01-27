"use client";

import { useEffect, useState } from "react";
import ProductForm from "../productForm/ProductForm";
import Image from "next/image";

export type ProductType = {
  id: number;
  name: string;
  description?: string | null;
  brand: "NATURA" | "YANBAL";
  costPrice?: number | null;
  price: number;
  imageUrl: string;
  gender?: "HOMBRE" | "MUJER" | "UNISEX" | null;
  stock?: number | null;
  isActive: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null,
  );

  const loadProducts = async () => {
    const res = await fetch("/api/products/productsAdmin");
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await loadProducts();
      } catch (error) {
        console.error("Error cargando productos", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4 sm:p-6 bg-[#F6F3EC] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl sm:text-3xl text-[#36302A] font-marcellus">
          Productos
        </h1>

        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(true);
          }}
          className="bg-green-400 text-white font-pt-serif px-4 py-2 rounded-full hover:bg-green-500 w-full sm:w-auto"
        >
          ➕ Agregar producto
        </button>
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full rounded-xl shadow-md bg-white">
          <thead className="bg-[#574C3F] text-[#F6F3EC] font-pt-serif text-lg">
            <tr>
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Marca</th>
              <th className="p-2">Costo</th>
              <th className="p-2">Precio</th>
              <th className="p-2">Imagen</th>
              <th className="p-2">Género</th>
              <th className="p-2">Stock</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t text-[#36302A] font-pt-serif">
                <td className="p-2 text-center">{p.name}</td>
                <td className="p-2 text-center">{p.description ?? "N/A"}</td>
                <td className="p-2 text-center">{p.brand}</td>
                <td className="p-2 text-center">${p.costPrice}</td>
                <td className="p-2 text-center">${p.price}</td>
                <td className="p-2 flex justify-center">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                </td>
                <td className="p-2 text-center">{p.gender ?? "N/A"}</td>
                <td className="p-2 text-center">{p.stock ?? "N/A"}</td>
                {/* <td className="p-2 text-center">{p.isActive ? "Activo" : "Inactivo"}</td>  */}
                <td className="p-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-pt-serif 
                       ${p.isActive ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"}`}
                  >
                    {p.isActive ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td className="p-2 flex justify-center gap-2">
                  <button
                    onClick={() => {
                      setEditingProduct({ ...p });
                      setShowForm(true);
                    }}
                    className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white text-[#36302A] rounded-xl shadow p-4 space-y-2 font-pt-serif"
          >
            <div className="flex items-center gap-4">
              <Image
                src={p.imageUrl}
                alt={p.name}
                width={70}
                height={70}
                className="rounded-full"
              />
              <div>
                <h3 className="font-marcellus text-lg">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.brand}</p>
              </div>
            </div>

            <p>
              <strong>Precio:</strong> ${p.price}
            </p>
            <p>
              <strong>Stock:</strong> {p.stock ?? "N/A"}
            </p>
            <p>
              <strong>Género:</strong> {p.gender ?? "N/A"}
            </p>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setEditingProduct({ ...p });
                  setShowForm(true);
                }}
                className="flex-1 bg-blue-400 text-white py-2 rounded hover:bg-blue-500"
              >
                Editar
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={() => {
            loadProducts();
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}
