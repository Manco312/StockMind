// src/components/OrdersAnalysisModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

type OrdersOverTimeItem = { date: string; count: number; totalValue: number };
type TopProduct = { productId: number; title: string; qty: number; totalValue: number };
type OrdersByStatus = { status: string; count: number };
type TopSalesperson = { userId?: number; name: string; qty: number; totalValue: number };

interface AnalysisData {
  totalOrders: number;
  totalValue: number;
  averageOrderValue: number;
  ordersOverTime: OrdersOverTimeItem[];
  topProducts: TopProduct[];
  ordersByStatus: OrdersByStatus[];
  topSalespeople: TopSalesperson[];
}

export default function OrdersAnalysisModal({
  open,
  onClose,
  from,
  to,
}: {
  open: boolean;
  onClose: () => void;
  from?: string;
  to?: string;
}) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    setData(null);

    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);

    fetch(`/api/orders/analysis?${query.toString()}`)
      .then((r) => r.json())
      .then((json) => {
        if (json?.error) throw new Error(json.error);

        const safe: AnalysisData = {
          totalOrders: Number(json.totalOrders ?? 0),
          totalValue: Number(json.topSalespeople?.[0]?.totalSales ?? 0),
          averageOrderValue: Number(json.avgPrice ?? 0),

          ordersOverTime: Array.isArray(json.monthlyOrders)
            ? json.monthlyOrders.map((m: any) => ({
                date: m.month ?? "",
                count: Number(m.total ?? 0),
                totalValue: Number(m.total ?? 0),
              }))
            : [],

          topProducts: Array.isArray(json.topProducts)
            ? json.topProducts.map((p: any) => ({
                productId: Number(p.productId ?? 0),
                title: p.title ?? "Sin nombre",
                qty: Number(p.qty ?? 0),
                totalValue: Number(p.totalValue ?? 0),
              }))
            : [],

          ordersByStatus: Array.isArray(json.ordersByStatus)
            ? json.ordersByStatus.map((s: any) => ({
                status: s.status ?? "Desconocido",
                count: Number(s.count ?? 0),
              }))
            : [],

          topSalespeople: Array.isArray(json.topSalespeople)
            ? json.topSalespeople.map((s: any) => ({
                userId: s.salespersonId ?? s.userId ?? undefined,
                name: s.name ?? `Vendedor #${s.salespersonId ?? 0}`,
                qty: Number(s.totalOrders ?? 0),
                totalValue: Number(s.totalSales ?? 0),
              }))
            : [],
        };

        setData(safe);
      })
      .catch((e) => {
        console.error("OrdersAnalysisModal fetch error:", e);
        setError(String(e?.message ?? e));
      })
      .finally(() => setLoading(false));
  }, [open, from, to]);

  const formatCurrency = (n: number) => {
    const safe = Number.isFinite(n) ? n : 0;
    return "$" + safe.toLocaleString("es-CO");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-6"
      aria-modal="true"
      role="dialog"
    >
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white rounded-xl shadow-2xl flex flex-col text-gray-900">
        {/* header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Análisis de Pedidos</h3>
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 rounded"
          >
            Cerrar
          </button>
        </div>

        {/* content */}
        <div className="p-6 overflow-auto">
          {loading ? (
            <div className="py-12 text-center text-gray-700">Cargando datos…</div>
          ) : error ? (
            <div className="py-6 text-center text-red-700">Error: {error}</div>
          ) : !data ? (
            <div className="py-12 text-center text-gray-700">Sin datos</div>
          ) : (
            <>
              {/* resumen */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Pedidos</div>
                  <div className="text-2xl font-bold">{data.totalOrders}</div>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Valor total</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(data.totalValue)}
                  </div>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg text-center">
                  <div className="text-sm text-gray-600">Pedido promedio</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(data.averageOrderValue)}
                  </div>
                </div>
              </div>

              {/* layout horizontal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* izquierda */}
                <div className="lg:col-span-2 bg-white rounded-lg p-4 border">
                  <h4 className="text-sm font-semibold mb-3 text-gray-800">
                    Pedidos en el tiempo
                  </h4>

                  {data.ordersOverTime.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-gray-700 border rounded">
                      No hay datos de la serie temporal
                    </div>
                  ) : (
                    <div style={{ height: 280 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.ordersOverTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#4F46E5"
                            strokeWidth={2}
                            dot={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {/* top productos */}
                    <div>
                      <h5 className="text-sm font-semibold mb-2 text-gray-800">
                        Top productos (cantidad)
                      </h5>
                      {data.topProducts.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-gray-700 border rounded">
                          Sin datos
                        </div>
                      ) : (
                        <div style={{ height: 160 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topProducts}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="title" hide />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="qty" fill="#06B6D4" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>

                    {/* estados */}
                    <div>
                      <h5 className="text-sm font-semibold mb-2 text-gray-800">
                        Pedidos por estado
                      </h5>
                      {data.ordersByStatus.length === 0 ? (
                        <div className="h-40 flex items-center justify-center text-gray-700 border rounded">
                          Sin datos
                        </div>
                      ) : (
                        <div style={{ height: 160 }}>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={data.ordersByStatus}
                                dataKey="count"
                                nameKey="status"
                                outerRadius={60}
                                innerRadius={30}
                                label
                              >
                                {data.ordersByStatus.map((entry, i) => (
                                  <Cell
                                    key={entry.status ?? i}
                                    fill={
                                      ["#6366F1", "#06B6D4", "#F97316", "#10B981", "#EF4444"][i % 5]
                                    }
                                  />
                                ))}
                              </Pie>
                              <Legend />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* derecha */}
                <div className="bg-white rounded-lg p-4 border">
                  <h4 className="text-sm font-semibold mb-3 text-gray-800">
                    Top preventistas
                  </h4>
                  {data.topSalespeople.length === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-700 border rounded">
                      Sin datos
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {data.topSalespeople.map((s, idx) => (
                        <div
                          key={s.userId ?? idx}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <div className="text-sm truncate">{s.name}</div>
                          <div className="text-sm font-medium text-gray-900">
                            {formatCurrency(s.totalValue)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4">
                    <h5 className="text-sm font-semibold mb-2 text-gray-800">
                      Exportar
                    </h5>
                    <div className="flex gap-2">
                      <button className="flex-1 px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200">
                        Exportar CSV
                      </button>
                      <button
                        className="px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        onClick={onClose}
                      >
                        Cerrar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
