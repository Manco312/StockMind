'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

// 🔹 Nuevo tipo de alerta basado en el backend actualizado
interface Alert {
  alertId: string;
  batchId: number;
  productName: string;
  quantity: number;
  expiryDate: string;
  type: string;
  message: string;
}

export default function AlertsDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const response = await fetch('/api/inventory/alerts');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch alerts');
        }
        const data = await response.json();
        // ⚠️ Ahora la API devuelve { alerts: [...] }
        setAlerts(data.alerts || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchAlerts();
  }, []);

  const handleDismiss = (alertId: string) => {
    // Solo eliminar de la vista (ya que no se guardan en BD)
    setAlerts(alerts.filter((alert) => alert.alertId !== alertId));
  };

  if (loading) {
    return <p>Loading alerts...</p>;
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  return (
    <div>
      {alerts.length === 0 ? (
        <p>No active alerts. All stock levels are healthy.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.alertId}>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg">{alert.productName}</h3>
                  <p className="text-sm text-red-600">
                    Current stock: <strong>{alert.quantity}</strong>
                  </p>
                  <p className="text-sm">{alert.message}</p>
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
  );
}
