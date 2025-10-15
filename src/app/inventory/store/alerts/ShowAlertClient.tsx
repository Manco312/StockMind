"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";

interface Product {
  id: number;
  title: string;
}

interface Store {
  id: number;
  name: string;
}

interface Alert {
  id: number;
  message: string;
  resolved: boolean;
  product: Product;
  store: Store;
  hasActiveOrder: boolean;
}

interface ShowAlertClientProps {
  userType: "distributor" | "salesperson" | "inventory_manager";
  userName: string;
  storeId: number;
}

export default function ShowAlertClient({
  userType,
  userName,
  storeId,
}: ShowAlertClientProps) {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | null }>({
    text: "",
    type: null,
  });

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch(`/api/inventory/alerts/fetch/${storeId}`);
        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch {
        setMessage({ text: "Error cargando alertas", type: "error" });
      } finally {
        setLoading(false);
      }
    }
    if (storeId) fetchAlerts();
  }, [storeId]);

  const handleDismiss = async (alertId: number) => {
    try {
      const response = await fetch(`/api/inventory/alerts/resolve/${alertId}`, { method: "POST" });
      const data = await response.json();

      if (data.success) {
        setAlerts(alerts.filter((a) => a.id !== alertId));
        setMessage({ text: data.message, type: "success" });
      } else {
        setMessage({ text: data.message, type: "error" });
      }
    } catch {
      setMessage({ text: "Error resolviendo la alerta", type: "error" });
    }

    setTimeout(() => setMessage({ text: "", type: null }), 4000);
  };

  const handleMakeOrder= async (productId: number) => {
    router.push(`/orders/create?productId=${productId}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <AppLayout userType={userType} userName={userName} activeSection="alertas">
      <section className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Alertas de Stock Bajo</h1>
          <button
            onClick={handleBack}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Volver 
          </button>
        </div>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Cargando alertas...</p>
        ) : alerts.length === 0 ? (
          <p className="text-gray-500">No hay alertas activas 🎉</p>
        ) : (
          <div className="grid gap-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`border rounded-lg p-4 shadow-sm flex justify-between items-center ${
                  alert.resolved
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div>
                  <p className="font-semibold text-gray-700">{alert.message}</p>

                  {alert.hasActiveOrder && (
                    <p className="text-sm text-yellow-700 mt-2 font-medium">
                      ⚠️ Hay un pedido en curso para este producto.
                    </p>
                  )}

                  {alert.resolved && (
                    <p className="text-sm text-green-700 mt-2 font-medium">
                      ✅ Alerta resuelta
                    </p>
                  )}
                </div>

                {!alert.resolved && !alert.hasActiveOrder && (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Marcar como resuelta
                    </button>
                    <button
                      onClick={() => handleMakeOrder(alert.product.id)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Hacer pedido
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
