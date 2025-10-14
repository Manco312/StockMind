"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { Order } from "@/src/generated/prisma";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface ManageOrdersClientProps {
  userType: UserType;
  userName: string;
  orders: Order[];
}

export default function ManageOrdersClient({ 
  userType,
  userName,
  orders: initialOrders,
}: ManageOrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState(initialOrders);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleMarkReceived = async (id: number) => {
    setLoadingId(id);
    try {
      const response = await fetch(`/api/orders/${id}/mark-received`, {
        method: "PATCH",
      });
      if (!response.ok) throw new Error("Error al actualizar la orden");

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "received" } : o))
      );

      setMessage({ type: "success", text: "✅ Orden marcada como recibida" });
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      console.error(error);
      setMessage({ type: "error", text: "❌ Error al actualizar la orden" });
      setTimeout(() => setMessage(null), 2000);
    } finally {
      setLoadingId(null);
    }
  };

  const handleBack = () => router.back();

  // Separar órdenes por estado
  const processedOrders = orders.filter((o) => o.status === "processed");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const receivedOrders = orders.filter((o) => o.status === "received");
  const cancelledOrders = orders.filter((o) => o.status === "cancelled");

  // Reutilizable para cada grupo
  const renderOrdersSection = (title: string, ordersList: Order[]) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>

      {ordersList.length === 0 ? (
        <p className="text-gray-500 text-sm italic">No hay órdenes {title.toLowerCase()}.</p>
      ) : (
        <div className="space-y-4">
          {ordersList.map((order) => (
            <div
              key={order.id}
              className="border border-gray-300 rounded-xl p-5 shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold text-gray-900">{order.product?.title || "Producto sin nombre"}</h3>
                <p className="text-sm text-gray-600">
                  Cantidad: {order.quantity} | Total: ${order.price.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Última actualización: {new Date(order.createdAt).toLocaleString("es-CO")}
                </p>
                <p
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "processed"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "cancelled"
                      ? "bg-blue-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </p>
              </div>

              {order.status === "processed" && (
                <button
                  onClick={() => handleMarkReceived(order.id)}
                  disabled={loadingId === order.id}
                  className="ml-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loadingId === order.id ? "Actualizando..." : "Marcar como recibida"}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <AppLayout userType={userType} userName={userName} activeSection="orders">
      <section className="p-3">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
          <button
            onClick={handleBack}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver
          </button>
        </div>

        {/* Notificación flotante */}
        {message && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className={`px-6 py-3 rounded-lg shadow-lg text-white text-lg font-medium ${
                message.type === "success" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {message.text}
            </div>
          </div>
        )}

        {/* Secciones */}
        {renderOrdersSection("Procesadas", processedOrders)}
        {renderOrdersSection("Pendientes", pendingOrders)}
        {renderOrdersSection("Recibidas", receivedOrders)}
        {renderOrdersSection("Canceladas", cancelledOrders)}
      </section>
    </AppLayout>
  );
}
