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

export default function DistributorInventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estado para modal de confirmación
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Cargar productos al montar la vista
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/inventory/8/distributor-products");
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
    setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProduct(null);
  };

  // abrir modal de confirmación (no borra aquí)
  const openDeleteConfirm = (product: Product) => {
    setDeletingProduct(product);
    setConfirmOpen(true);
  };

  // acción confirmada: borrar del servidor
  const performDelete = async () => {
    if (!deletingProduct) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/inventory/4/distributor-products/${deletingProduct.id}`, {
        method: "DELETE",
      });

      const text = await res.text();
      let body: any = null;
      try {
        body = text ? JSON.parse(text) : null;
      } catch {
        body = text;
      }

      if (!res.ok) {
        console.error("DELETE error:", res.status, body);
        const msg = body?.error ?? body ?? `Status ${res.status}`;
        alert("Error eliminando producto: " + msg);
        return;
      }

      // actualizar UI
      setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
      setConfirmOpen(false);
      setDeletingProduct(null);
    } catch (err) {
      console.error("Network error deleting:", err);
      alert("Error eliminando producto (network). Revisa la consola.");
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
            inventoryId={4}
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

      {/* Confirm modal */}
      <ConfirmModal
        open={confirmOpen}
        title="Eliminar producto"
        message={
          deletingProduct ? (
            <>
              ¿Estás seguro de eliminar <strong className="text-gray-900">{deletingProduct.title}</strong>?
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
