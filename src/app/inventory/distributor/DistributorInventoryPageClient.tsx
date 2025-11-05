"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/AppLayout";
import AddDistributorProductClient from "./AddDistributorProductClient";
import ConfirmModal from "@/components/ConfirmModal";

interface Product {
  id: number;
  title: string;
  description?: string;
  category?: string;
  price: number;
  available: boolean;
}

export default function DistributorInventoryPageClient({
  inventoryId,
}: {
  inventoryId: number;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 🔄 Cargar productos según el inventario recibido
  useEffect(() => {
    if (!inventoryId) return;
    const fetchProducts = async () => {
      try {
        const res = await fetch(`/api/inventory/${inventoryId}/distributor-products`);
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
  }, [inventoryId]);

  const handleProductAdded = (newProduct: Product) => {
    setProducts((prev) => [...prev, newProduct]);
  };

  const handleProductUpdated = (updated: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProduct(null);
  };

  const openDeleteConfirm = (product: Product) => {
    setDeletingProduct(product);
    setConfirmOpen(true);
  };

  const performDelete = async () => {
    if (!deletingProduct) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/inventory/${inventoryId}/distributor-products/${deletingProduct.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        alert(`Error: ${text}`);
        return;
      }

      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setConfirmOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      console.error(err);
      alert("Error eliminando producto (network).");
    } finally {
      setDeleteLoading(false);
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
            inventoryId={inventoryId}
          />
        </div>

        {/* Lista de productos */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Catálogo de Productos</h2>

          {loading ? (
            <p className="text-gray-600">Cargando productos...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No hay productos registrados.</p>
          ) : (
            <table className="w-full text-left border-collapse text-gray-800">
              <thead>
                <tr className="border-b text-gray-700">
                  <th className="p-2">Nombre</th>
                  <th className="p-2">Descripción</th>
                  <th className="p-2">Precio</th>
                  <th className="p-2">Disponible</th>
                  <th className="p-2">Cantidad total</th>
                  <th className="p-2 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{p.title}</td>
                    <td className="p-2">{p.description}</td>
                    <td className="p-2">${p.price}</td>
                    <td className="p-2">{p.available ? "Sí" : "No"}</td>
                    <td className="p-2">{p.totalQuantity ?? 0}</td>
                    <td className="p-2 text-center space-x-2">
                      <button
                        onClick={() => setEditingProduct(p)}
                        className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(p)}
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

      <ConfirmModal
        open={confirmOpen}
        title="Eliminar producto"
        message={
          deletingProduct ? (
            <>
              ¿Estás seguro de eliminar <strong>{deletingProduct.title}</strong>?
            </>
          ) : (
            "¿Estás seguro?"
          )
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        loading={deleteLoading}
        onConfirm={performDelete}
        onCancel={() => {
          if (deleteLoading) return;
          setConfirmOpen(false);
          setDeletingProduct(null);
        }}
      />
    </AppLayout>
  );
}
