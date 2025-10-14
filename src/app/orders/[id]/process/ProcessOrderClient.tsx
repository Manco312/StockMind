"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { Order } from "@/src/generated/prisma";
import { Button } from "@/components/Button";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface ProcessOrderClientProps {
  userType: UserType;
  userName: string;
  order: Order;
}

export default function ProcessOrderClient({
  userType,
  userName,
  order,
}: ProcessOrderClientProps) {
  const router = useRouter();

  const [code] = useState(`BATCH-${Date.now()}`); // solo vista previa
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
        body: JSON.stringify({
          code,
          quantity,
          expirationDate,
          location,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({
          text: data.message || data.error || "Error al aceptar el pedido",
          type: "warning",
        });
        return;
      }

      setMessage({
        text: data.message || "✅ Pedido aceptado correctamente",
        type: "success",
      });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      setMessage({
        text: "Error al aceptar el pedido",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm("¿Seguro que deseas rechazar este pedido?")) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/orders/${order.id}/reject`, {
        method: "PATCH",
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage({
          text: data.message || data.error || "Error al rechazar el pedido",
          type: "warning",
        });
        return;
      }

      setMessage({
        text: data.message || "⚠️ Pedido rechazado correctamente",
        type: "success",
      });
      setTimeout(() => router.back(), 1500);
    } catch (error) {
      setMessage({
        text: "Error al rechazar el pedido",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <AppLayout
      userType={userType}
      userName={userName}
      activeSection="orders"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Procesar Pedido #{order.id}
        </h2>

        {message && (
          <div
            className={`
              mt-4 text-center text-lg font-semibold px-4 py-3 rounded-lg shadow-md transition-all duration-300
              ${
                message.type === "success"
                  ? "bg-green-100 text-green-800 border border-green-300"
                  : message.type === "error"
                  ? "bg-red-100 text-red-800 border border-red-300"
                  : message.type === "warning"
                  ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                  : "bg-blue-100 text-blue-800 border border-blue-300"
              }
            `}
          >
            {message.text}
          </div>
        )}


        {/* General order information */}
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p>
            <strong>Tienda:</strong> {order.inventoryManager?.store?.name}
          </p>
          <p>
            <strong>Producto:</strong> {order.product?.title}
          </p>
          <p>
            <strong>Cantidad solicitada:</strong> {order.quantity}
          </p>
          <p>
            <strong>Total:</strong> ${order.price.toLocaleString()}
          </p>
          <p>
            <strong>Fecha de creación:</strong>{" "}
            {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Order batch information */}
        <div className="border-t pt-6 mt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Información del Lote
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-800">Código</label>
              <input
                type="text"
                value={code}
                disabled
                className="w-full border p-2 rounded-md bg-gray-100 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">Cantidad</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full border p-2 rounded-md text-gray-600" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-800">
                Fecha de expiración del lote
              </label>
              <input
                type="date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
                className="w-full border p-2 rounded-md text-gray-600"
              />
            </div>

          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={handleReject}
            disabled={loading}
          >
            Rechazar
          </Button>

          <Button
            variant="primary"
            onClick={handleAccept}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Aceptar orden"}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
