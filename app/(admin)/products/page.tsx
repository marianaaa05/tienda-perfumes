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
};

export default function ProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(
    null,
  );

  const loadProducts = async () => {
    const res = await fetch("/api/products");
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

  const deleteProduct = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este producto?")) return;

    await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    loadProducts();
  };

  // return (
  //   <div className="p-6 bg-[#F6F3EC] min-h-screen">
  //     <div className="flex justify-between mb-6">
  //       <h1 className="text-3xl text-[#36302A] font-marcellus">Productos</h1>

  //       <button
  //         onClick={() => {
  //           setEditingProduct(null);
  //           setShowForm(true);
  //         }}
  //         className="bg-green-400 text-white font-pt-serif px-4 py-2 rounded hover:bg-green-500"
  //       >
  //         Agregar producto
  //       </button>
  //     </div>

  //     {/* Tabla */}
  //     <table className="w-full rounded-xl shadow-md">
  //       <thead className="bg-[#574C3F] text-[#F6F3EC] font-pt-serif text-xl">
  //         <tr>
  //           <th className="p-2">Nombre</th>
  //           <th className="p-2">Descripción</th>
  //           <th className="p-2">Marca</th>
  //           <th className="p-2">Costo</th>
  //           <th className="p-2">Precio venta</th>
  //           <th className="p-2">Imagen</th>
  //           <th className="p-2">Género</th>
  //           <th className="p-2">Stock</th>
  //           <th className="p-2">Acciones</th>
  //         </tr>
  //       </thead>

  //       <tbody>
  //         {products.map((p) => (
  //           <tr key={p.id} className="border-t text-[#36302A] text-xl font-pt-serif">
  //             <td className="p-2 text-center">{p.name} Nombre</td>
  //             <td className="p-2 text-center">{p.description ?? "N/A"}</td>
  //             <td className="p-2 text-center">{p.brand}</td>
  //             <td className="p-2 text-center">${p.costPrice}</td>
  //             <td className="p-2 text-center">${p.price}</td>
  //             <td className="p-2 text-center"><Image src={p.imageUrl} alt={p.name} width={100} height={100} className="rounded-full" /></td>
  //             <td className="p-2 text-center">{p.gender ?? "N/A"}</td>
  //             <td className="p-2 text-center">{p.stock ?? "N/A"}</td>

  //             <td className="p-2 flex justify-center gap-2">
  //               <button
  //                 onClick={() => {
  //                   setEditingProduct({...p});
  //                   setShowForm(true);
  //                 }}
  //                 className="bg-blue-400 text-white px-2 py-1 text-sm rounded hover:bg-blue-500"
  //               >
  //                 Editar
  //               </button>

  //               <button
  //                 onClick={() => deleteProduct(p.id)}
  //                 className="bg-red-400 text-white px-2 py-1 text-sm rounded hover:bg-red-500"
  //               >
  //                 Eliminar
  //               </button>
  //             </td>
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>

  //     {showForm && (
  //       <ProductForm
  //         product={editingProduct}
  //         onClose={() => {
  //           setShowForm(false);
  //           setEditingProduct(null);
  //         }}
  //         onSave={() => {
  //           loadProducts();
  //           setShowForm(false);
  //           setEditingProduct(null);
  //         }}
  //       />
  //     )}
  //   </div>
  // );

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

                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500"
                  >
                    Eliminar
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

              <button
                onClick={() => deleteProduct(p.id)}
                className="flex-1 bg-red-400 text-white py-2 rounded hover:bg-red-500"
              >
                Eliminar
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
