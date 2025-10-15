"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Order } from "@/src/generated/prisma";

interface Props {
  order: Order;
}

export default function ProcessOrderForm({ order }: Props) {
  const router = useRouter();

  const [code] = useState(`BATCH-${Date.now()}`);
  const [quantity, setQuantity] = useState(order.quantity || 0);
  const [expirationDate, setExpirationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "warning" | "info" } | null>(null);

  const handleAccept = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${order.id}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, quantity, expirationDate }),
      });

      const data = await res.json();
      if (!res.ok)
        return setMessage({ text: data.message || "Error al aceptar el pedido", type: "warning" });

      setMessage({ text: "✅ Pedido aceptado correctamente", type: "success" });
      setTimeout(() => router.back(), 1500);
    } catch {
      setMessage({ text: "Error al aceptar el pedido", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("¿Seguro que deseas rechazar este pedido?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${order.id}/reject`, { method: "PATCH" });
      const data = await res.json();

      if (!res.ok)
        return setMessage({ text: data.message || "Error al rechazar el pedido", type: "warning" });

      setMessage({ text: "⚠️ Pedido rechazado correctamente", type: "success" });
      setTimeout(() => router.back(), 1500);
    } catch {
      setMessage({ text: "Error al rechazar el pedido", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">
        Procesar Pedido #{order.id}
      </h2>

      {message && (
        <div
          className={`mt-4 text-center text-lg font-semibold px-4 py-3 rounded-lg shadow-md
          ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : message.type === "error"
              ? "bg-red-100 text-red-800 border border-red-300"
              : message.type === "warning"
              ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
              : "bg-blue-100 text-blue-800 border border-blue-300"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 text-gray-700">
        <p><strong>Producto:</strong> {order.product?.title}</p>
        <p><strong>Cantidad:</strong> {order.quantity}</p>
        <p><strong>Total:</strong> ${order.price.toLocaleString()}</p>
        <p><strong>Fecha:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <div className="border-t pt-6 mt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Información del Lote
        </h3>

        <label className="block text-sm font-medium text-gray-800">Código</label>
        <input type="text" value={code} disabled className="w-full border p-2 rounded-md bg-gray-100 text-gray-600" />

        <label className="block text-sm font-medium text-gray-800 mt-4">Cantidad</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full border p-2 rounded-md text-gray-600" />

        <label className="block text-sm font-medium text-gray-800 mt-4">Fecha de expiración</label>
        <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="w-full border p-2 rounded-md text-gray-600" />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button variant="secondary" onClick={() => router.back()} disabled={loading}>Cancelar</Button>
        <Button variant="primary" onClick={handleReject} disabled={loading}>Rechazar</Button>
        <Button variant="primary" onClick={handleAccept} disabled={loading}>
          {loading ? "Procesando..." : "Aceptar orden"}
        </Button>
      </div>
    </div>
  );
}
