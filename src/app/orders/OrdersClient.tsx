"use client";

import AppLayout from "@/components/AppLayout";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface OrdersClientProps {
  userType: UserType;
  userName: string;
}

export default function OrdersClient({
  userType,
  userName,
}: OrdersClientProps) {
  // Mock data for orders
  const orders = [
    {
      id: 1,
      customer: "Tienda Central",
      product: "Laptop HP Pavilion",
      quantity: 5,
      status: "En Proceso",
      date: "2024-01-15",
      total: 2500000,
    },
    {
      id: 2,
      customer: "Supermercado Norte",
      product: "Mouse Inalámbrico",
      quantity: 20,
      status: "Completado",
      date: "2024-01-14",
      total: 400000,
    },
    {
      id: 3,
      customer: "Farmacia del Sur",
      product: "Teclado Mecánico",
      quantity: 10,
      status: "Pendiente",
      date: "2024-01-13",
      total: 800000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completado":
        return "bg-green-100 text-green-800";
      case "En Proceso":
        return "bg-yellow-100 text-yellow-800";
      case "Pendiente":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <AppLayout
      userType={userType}
      userName={userName}
      activeSection="orders"
      title="Gestión de Pedidos"
    >
      <div className="space-y-6">
        {/* Orders Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Pedidos 
            </h3>
            <p className="text-2xl font-bold text-gray-900">24</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Completados
            </h3>
            <p className="text-2xl font-bold text-green-600">18</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              En Proceso
            </h3>
            <p className="text-2xl font-bold text-yellow-600">4</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Pendientes
            </h3>
            <p className="text-2xl font-bold text-red-600">2</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Pedidos Recientes
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.product}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.quantity}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.total.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📦</div>
                <p className="text-sm font-medium text-gray-700">
                  Nuevo Pedido
                </p>
              </div>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">📊</div>
                <p className="text-sm font-medium text-gray-700">
                  Ver Reportes
                </p>
              </div>
            </button>

            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors">
              <div className="text-center">
                <div className="text-2xl mb-2">⚙️</div>
                <p className="text-sm font-medium text-gray-700">Configurar</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
