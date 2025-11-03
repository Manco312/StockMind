"use client";

import { useState } from "react";
import { useRouter, redirect } from "next/navigation";
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
    router.push(`/orders/${id}/process`)
  };

  const handleBack = () => router.back();

  // Separar órdenes por estado
  const acceptedOrders = orders.filter((o) => o.status === "accepted");
  const pendingOrders = orders.filter((o) => o.status === "pending");
  const receivedOrders = orders.filter((o) => o.status === "received");
  const rejectedOrders = orders.filter((o) => o.status === "rejected");

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
                      : order.status === "accepted"
                      ? "bg-blue-100 text-blue-700"
                      : order.status === "rejected"
                      ? "bg-blue-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {order.status}
                </p>
              </div>

              {order.status === "accepted" && (
                <button
                  onClick={() => handleMarkReceived(order.id)}
                  disabled={loadingId === order.id}
                  className="ml-auto bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loadingId === order.id ? "Cargando..." : "Marcar como recibido"}
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
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
          <button
            onClick={handleBack}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver
          </button>
        </div>
        <h3 className="text-m text-gray-800 mb-6">
          A continuación se muestra el estado de los pedidos conforme a la respuesta de la distribuidora
        </h3>

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
        {renderOrdersSection("Aceptados", acceptedOrders)}
        {renderOrdersSection("Pendientes", pendingOrders)}
        {renderOrdersSection("Rechazados", rejectedOrders)}
        {renderOrdersSection("Recibidos", receivedOrders)}
      
      </section>
    </AppLayout>
  );
}
