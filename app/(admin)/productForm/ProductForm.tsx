"use client";

import { useState, useEffect } from "react";
import type { ProductType } from "../products/page";
import { supabase } from "@/utils/supabase/client";

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
    costPrice: "",
    price: "",
    imageUrl: "",
    gender: "MUJER",
    stock: "",
    isActive: true,
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
          costPrice: product.costPrice?.toString() ?? "",
          price: product.price?.toString() ?? "",
          imageUrl: product.imageUrl,
          gender: product.gender ?? "MUJER",
          stock: product.stock?.toString() ?? "",
          isActive: product.isActive ?? true,
        });
      } else {
        // nuevo producto
        setForm({
          id: 0,
          name: "",
          description: "",
          brand: "NATURA",
          costPrice: "",
          price: "",
          imageUrl: "",
          gender: "MUJER",
          stock: "",
          isActive: true,
        });
      }
    });
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //
    if (
      form.name === "" ||
      form.costPrice === "" ||
      form.price === "" ||
      form.stock === ""
    ) {
      alert("Nombre, costo, precio y stock son campos obligatorios");
      return;
    }

    if (!form.imageUrl) {
      alert(
        "Debes subir una imagen del producto para que tus clientes la vean",
      );
      return;
    }

    const payload = {
      name: form.name,
      description: form.description || null,
      brand: form.brand,
      costPrice: Number(form.costPrice),
      price: Number(form.price),
      imageUrl: form.imageUrl || null,
      gender: form.gender,
      stock: Number(form.stock),
      isActive: form.isActive,
    };

    if (Number.isNaN(payload.price) || Number.isNaN(payload.stock)) {
      alert("Precio y stock deben ser números válidos");
      return;
    }
    //

    const url = form.id === 0 ? "/api/products" : `/api/products/${form.id}`;
    const method = form.id === 0 ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Error guardando producto:", error);
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

          {/* costo del producto */}
          <input
            className="rounded-b-sm shadow-md p-2"
            type="number"
            placeholder="Costo"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
          />

          {/* valor de venta */}
          <input
            className="rounded-b-sm shadow-md p-2"
            type="number"
            placeholder="Precio"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input
            type="file"
            accept="image/*"
            className="rounded-b-sm shadow-md p-2"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const fileExt = file.name.split(".").pop();
              // const fileName = `${crypto.randomUUID()}.${fileExt}`;
              const fileName = `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 10)}.${fileExt}`;
              const filePath = `product/${fileName}`;

              const { error } = await supabase.storage
                .from("product")
                .upload(filePath, file, {
                  cacheControl: "3600",
                  upsert: false,
                });

              if (error) {
                console.error("Error subiendo imagen:", error.message);
                return;
              }

              const { data } = supabase.storage
                .from("product")
                .getPublicUrl(filePath);

              setForm({ ...form, imageUrl: data.publicUrl });
            }}
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
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <select
            className="rounded-b-sm shadow-md p-2"
            value={form.isActive ? "true" : "false"}
            onChange={(e) =>
              setForm({
                ...form,
                isActive: e.target.value === "true",
              })
            }
          >
            <option value="true">Activo (visible en tienda)</option>
            <option value="false">Inactivo (oculto)</option>
          </select>

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
