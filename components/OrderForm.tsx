"use client";

import { useState } from "react";
import { InventoryManager } from "@/src/generated/prisma";

type Product = {
  id: number;
  title: string;
  price: number;
};

type OrderFormProps = {
  offeredProducts: Product[];
  inventoryManager: InventoryManager;
  onSuccessAction: () => void;
};

export default function OrderForm({
  offeredProducts,
  inventoryManager,
  onSuccessAction,
}: OrderFormProps) {
  const [productId, setProductId] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const selectedProduct = offeredProducts.find((p) => p.id == productId);
  const total = selectedProduct ? selectedProduct.price * quantity : 0; // cálculo en tiempo real

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(parseInt(e.target.value) || 1);
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProductId(parseInt(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId || !quantity) return;

    setLoading(true);

    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "pending",
          quantity,
          price: total,
          productId,
          productName: selectedProduct?.title,
          inventoryManagerId: inventoryManager.userId,
        }),
      });

      if (!response.ok) throw new Error("Error al crear pedido");
      onSuccessAction();
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al crear el pedido.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Producto */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Producto
        </label>
        <select
          required
          value={productId}
          onChange={handleProductChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        >
          <option value="">Seleccionar producto...</option>
          {offeredProducts.map((product) => (
            <option key={product.id} value={product.id}>
              {product.title} - ${product.price.toLocaleString()}
            </option>
          ))}
        </select>
      </div>

      {/* Cantidad */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Cantidad
        </label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          required
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
        />
      </div>

      {/* Total */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Total
        </label>
        <div className="w-full flex justify-between items-center border-t border-gray-300 pt-2">
          <span className="text-gray-700 font-semibold">Total a pagar:</span>
          <span className="text-xl font-bold text-gray-900">
            ${total.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Botón */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Creando pedido..." : "Crear Pedido"}
      </button>
    </form>
  );
}
