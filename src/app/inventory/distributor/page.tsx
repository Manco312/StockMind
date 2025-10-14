"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import AddDistributorProductClient from "./AddDistributorProductClient";

interface Product {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  available: boolean;
}

export default function DistributorInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Cargar productos al montar la vista
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/inventory/1/distributor-products");
        if (!res.ok) throw new Error("Error cargando productos");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleProductUpdated = (updated: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingProduct(null);
  };

  const handleProductDeleted = async (id: number) => {
    try {
      const res = await fetch(`/api/inventory/1/distributor-products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error eliminando producto");
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppLayout
      userType="salesperson"
      userName="Distribuidor"
      activeSection="inventory"
      title="Inventario del Distribuidor"
    >
      <div className="space-y-6">
        {/* Formulario de creación o edición */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <AddDistributorProductClient
            onProductAdded={handleProductAdded}
            onProductUpdated={handleProductUpdated}
            editingProduct={editingProduct}
          />
        </div>

        {/* Lista de productos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Catálogo de Productos
          </h2>

          {loading ? (
            <p className="text-gray-600">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No hay productos registrados.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-700">
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Descripción</th>
                  <th className="p-2">Precio</th>
                  <th className="p-2">Disponible</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.title}</td>
                    <td className="p-2">{p.description}</td>
                    <td className="p-2">${p.price}</td>
                    <td className="p-2">
                      {p.available ? "Sí" : "No"}
                    </td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleProductDeleted(p.id)}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
