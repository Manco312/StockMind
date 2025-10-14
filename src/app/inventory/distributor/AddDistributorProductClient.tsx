"use client";

import { useState, useEffect } from "react";

interface ProductFormProps {
  onProductAdded: (product: any) => void;
  onProductUpdated: (product: any) => void;
  editingProduct?: any | null;
  inventoryId?: number | null;
}

export default function AddDistributorProductClient({
  onProductAdded,
  onProductUpdated,
  editingProduct,
  inventoryId,
}: ProductFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [available, setAvailable] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // fallback: si no recibimos inventoryId como prop usamos editingProduct.inventoryId o 4
  const effectiveInventoryId: number | null =
    inventoryId ?? editingProduct?.inventoryId ?? 4;

  useEffect(() => {
    if (editingProduct) {
      setIsEditing(true);
      setTitle(editingProduct.title);
      setDescription(editingProduct.description || "");
      setPrice(editingProduct.price?.toString() ?? "");
      setAvailable(Boolean(editingProduct.available));
    } else {
      setIsEditing(false);
      setTitle("");
      setDescription("");
      setPrice("");
      setAvailable(true);
    }
  }, [editingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!effectiveInventoryId) {
      alert("Inventario no disponible. Recarga la página.");
      return;
    }

    const productData = {
      title,
      description,
      price: parseFloat(price || "0"),
      available,
    };

    setLoading(true);
    try {
      const url = isEditing
        ? `/api/inventory/${effectiveInventoryId}/distributor-products/${editingProduct.id}`
        : `/api/inventory/${effectiveInventoryId}/distributor-products`;
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      const text = await res.text();
      let body: any = null;
      try { body = text ? JSON.parse(text) : null; } catch { body = text; }

      if (!res.ok) {
        console.error("SERVER ERROR:", res.status, body);
        const msg = body?.error ?? body ?? `Status ${res.status}`;
        alert("Error guardando producto: " + msg);
        return;
      }

      const data = body;
      if (isEditing) onProductUpdated(data);
      else onProductAdded(data);

      // reset
      setTitle("");
      setDescription("");
      setPrice("");
      setAvailable(true);
      setIsEditing(false);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Error guardando producto (network). Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        {isEditing ? "Editar producto" : "Agregar nuevo producto"}
      </h3>

      <input
        type="text"
        placeholder="Nombre del producto"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border rounded-md p-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
        required
      />

      <textarea
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border rounded-md p-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        min="0"
        step="0.01"
        required
        className="w-full border rounded-md p-2 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-blue-400"
      />

      <label className="flex items-center gap-2 text-gray-700">
        <input
          type="checkbox"
          checked={available}
          onChange={(e) => setAvailable(e.target.checked)}
        />
        Disponible
      </label>

      <button
        type="submit"
        disabled={loading || !effectiveInventoryId}
        className={`${
          loading || !effectiveInventoryId ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        } text-white px-4 py-2 rounded-md transition`}
      >
        {loading ? "Guardando..." : isEditing ? "Actualizar" : "Agregar"}
      </button>
    </form>
  );
}
