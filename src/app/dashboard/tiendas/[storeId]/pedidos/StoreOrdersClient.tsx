"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { type OrderWithProduct } from "./page"; // Import the type from the page
import { Button } from "@/components/Button";

interface StoreOrdersClientProps {
  initialOrders: OrderWithProduct[];
  storeId: number;
}

export default function StoreOrdersClient({
  initialOrders,
  storeId,
}: StoreOrdersClientProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderWithProduct[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchOrders = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (searchQuery) params.append("q", searchQuery);
    if (dateFrom) params.append("from", dateFrom);
    if (dateTo) params.append("to", dateTo);

    try {
      const res = await fetch(`/api/stores/${storeId}/orders?${params.toString()}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch orders");
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error(error);
      // You could set an error state here to show a message to the user
      setOrders([]); // Clear orders on error
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to trigger search when filters change, with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchOrders();
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, dateFrom, dateTo]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "received":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter and Search Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <input
            type="text"
            placeholder="Buscar por producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <span>-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button onClick={() => router.push("/dashboard/tiendas")} variant="outline">Volver a Tiendas</Button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pedido ID</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500 italic">Cargando pedidos...</td>
                </tr>
              )}
              {!isLoading && orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-500">No se encontraron pedidos con los filtros actuales.</td>
                </tr>
              )}
              {!isLoading && orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">#{order.id}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{order.product.title}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">{order.quantity}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">${order.price.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
