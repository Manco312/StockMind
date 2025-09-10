"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

type UserType = "distributor" | "salesperson" | "inventory_manager";

// 🔹 Interfaz de alerta basada en el backend
interface Alert {
  alertId: string;
  batchId: number;
  productName: string;
  quantity: number;
  expiryDate: string;
  type: string;
  message: string;
}

interface ShowAlertClientProps {
  userType: "distributor" | "salesperson" | "inventory_manager";
  userName: string;
}

export default function ShowAlertClient({
  userType,
  userName,
}: ShowAlertClientProps) {
  const router = useRouter();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch("/api/inventory/alerts");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch alerts");
        }
        const data = await response.json();
        setAlerts(data.alerts || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAlerts();
  }, []);

  const handleBack = () => {
    router.push("/inventory/store");
  };

  const handleDismiss = (alertId: string) => {
    setAlerts(alerts.filter((alert) => alert.alertId !== alertId));
  };

  return (
    <AppLayout
      userType={userType}
      userName={userName}
      activeSection="inventory"
      title="Alertas de Inventario"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al Inventario
          </button>
        </div>

        {/* Alert List */}
            {loading ? (
            <p className="text-gray-600 italic">🔄 Cargando alertas...</p>
            ) : error ? (
            <p className="text-red-600 font-medium">❌ Error: {error}</p>
            ) : alerts.length === 0 ? (
            <p className="text-green-700 font-semibold">
                ✅ No hay alertas activas. Todos los niveles de stock están saludables.
            </p>
            ) : (
            <div className="space-y-4">
                {alerts.map((alert) => (
                <Card key={alert.alertId}>
                    <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg text-gray-900">
                        📦 {alert.productName}
                        </h3>
                        <p className="text-base text-red-700 font-semibold">
                        Stock actual: <span className="font-bold">{alert.quantity}</span>
                        </p>
                        <p className="text-sm text-gray-700 mt-1">{alert.message}</p>
                    </div>
                    {/*
                    <Button onClick={() => handleDismiss(alert.alertId)}>
                        Descartar
                    </Button>
                     */}
                    </div>
                </Card>
                ))}
            </div>
            )}
      </div>
    </AppLayout>
  );
}
