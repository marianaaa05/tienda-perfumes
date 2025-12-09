"use client";

import { useState, useEffect } from "react";
import type { ProductType } from "../products/page";

export default function ProductForm({
  product,
  onClose,
  onSave,
}: {
  product?: ProductType | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [form, setForm] = useState({
    id: 0,
    name: "",
    description: "",
    brand: "NATURA",
    price: 0,
    imageUrl: "",
    gender: "MUJER",
    stock: 0,
  });

  // ACTUALIZAR FORM CUANDO product CAMBIA
  useEffect(() => {
    Promise.resolve().then(() => {
      if (product) {
        setForm({
          id: product.id,
          name: product.name,
          description: product.description ?? "",
          brand: product.brand,
          price: product.price,
          imageUrl: product.imageUrl,
          gender: product.gender ?? "MUJER",
          stock: product.stock ?? 0,
        });
      } else {
        // nuevo producto
        setForm({
          id: 0,
          name: "",
          description: "",
          brand: "NATURA",
          price: 0,
          imageUrl: "",
          gender: "MUJER",
          stock: 0,
        });
      }
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { id, ...data } = form;

    // Si id === 0 → es producto nuevo → usar POST
    const url = id === 0 ? "/api/products" : `/api/products/${id}`;
    const method = id === 0 ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("Error guardando producto");
      return;
    }

    onSave(); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center">
      <div className="bg-[#F6F3EC] p-6 rounded-lg w-96">
        <h2 className="text-2xl font-marcellus text-[#36302A] text-center mb-4">
          {product ? "Editar producto" : "Agregar producto"}
        </h2>

        <form
          className="flex flex-col gap-3 text-[#36302A] font-pt-serif text-xl"
          onSubmit={handleSubmit}
        >
          <input
            className="rounded-b-sm shadow-md p-2"
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            className="rounded-b-sm shadow-md p-2"
            placeholder="Descripción"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <select
            className="rounded-b-sm shadow-md p-2"
            value={form.brand}
            onChange={(e) =>
              setForm({ ...form, brand: e.target.value as "NATURA" | "YANBAL" })
            }
          >
            <option value="NATURA">NATURA</option>
            <option value="YANBAL">YANBAL</option>
          </select>

          <input
            className="rounded-b-sm shadow-md p-2"
            type="number"
            placeholder="Precio"
            value={form.price}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          <input
            className="rounded-b-sm shadow-md p-2"
            placeholder="Imagen URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
          />

          <select
            className="rounded-b-sm shadow-md p-2"
            value={form.gender}
            onChange={(e) =>
              setForm({
                ...form,
                gender: e.target.value as "MUJER" | "HOMBRE" | "UNISEX",
              })
            }
          >
            <option value="MUJER">MUJER</option>
            <option value="HOMBRE">HOMBRE</option>
            <option value="UNISEX">UNISEX</option>
          </select>

          <input
            className="rounded-b-sm shadow-md p-2"
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />

          <button
            className="bg-green-400 text-white py-2 rounded hover:bg-green-500"
            type="submit"
          >
            {product ? "Guardar cambios" : "Guardar"}
          </button>
        </form>

        <button
          className="mt-3 text-gray-600 underline w-full text-center"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
