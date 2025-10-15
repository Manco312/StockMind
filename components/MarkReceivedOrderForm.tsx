"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/src/generated/prisma";

interface Props {
  order: Order;
}

interface Batch {
  id: number;
  code: string;
  quantity: number;
  expirationDate: string | null;
  product?: { title: string };
}

export default function MarkReceivedOrderForm({ order }: Props) {
  const router = useRouter();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Get batch info
  useEffect(() => {
    const fetchBatch = async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}/batch`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Error al obtener batch");
        setBatch(data);
      } catch (err) {
        console.error(err);
        setMessage({ text: "No se pudo cargar la información del lote", type: "error" });
      }
    };

    fetchBatch();
  }, [order.id]);

  // Handle receiving order
  const handleReceive = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${order.id}/mark-received`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al recibir orden");

      setMessage({ text: "✅ Orden recibida e inventario actualizado", type: "success" });
      setTimeout(() => router.push("/orders"), 1500);
    } catch {
      setMessage({ text: "❌ Error al recibir la orden", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">
        📦 Recepción de pedido
      </h3>

      {message && (
        <div
          className={`text-center text-lg font-semibold px-4 py-3 rounded-lg shadow-md
          ${message.type === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {message.text}
        </div>
      )}

      {/* Order info */}
      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p><strong>Producto:</strong> {order.product?.title}</p>
        <p><strong>Cantidad:</strong> {order.quantity}</p>
        <p><strong>Total:</strong> ${order.price.toLocaleString()}</p>
        <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      {/* Batch info */}
      <div className="border-t pt-6 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Información del Lote
        </h3>

        {batch ? (
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <p><strong>Código:</strong> {batch.code}</p>
            <p><strong>Cantidad:</strong> {batch.quantity}</p>
            <p><strong>Fecha de expiración:</strong> {batch.expirationDate ? new Date(batch.expirationDate).toLocaleDateString() : "—"}</p>
            <p><strong>Producto:</strong> {batch.product?.title}</p>
          </div>
        ) : (
          <p className="text-gray-500">Cargando información del lote...</p>
        )}
      </div>

      {/* Location form */}
      <div className="border-t pt-6 mt-4">
        <label className="block text-m font-medium text-gray-700 mb-4">
          Ingresa la ubicación del producto en tu tienda
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ej: Estante A3, Bodega 2..."
          className="w-full border p-2 rounded-md text-gray-600"
        />
      </div>

      <button
        onClick={handleReceive}
        disabled={loading}
        className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
      >
        {loading ? "Procesando..." : "Confirmar recepción"}
      </button>
    </div>
  );
}