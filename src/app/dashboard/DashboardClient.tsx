"use client";

import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import DashboardCard from "@/components/DashboardCard";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface DashboardData {
  cards: Array<{
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: "blue" | "green" | "yellow" | "red" | "purple";
  }>;
  recentActivity: Array<{
    title: string;
    description: string;
  }>;
  orders: Array<{
    name: string;
    quantity: number;
    company: string;
    location: string;
    rating: number;
  }>;
}

interface DashboardClientProps {
  userType: UserType;
  userName: string;
  dashboardData: DashboardData;
  storeId?: any; // Nuevo prop opcional
}

export default function DashboardClient({
  userType,
  userName,
  dashboardData,
  storeId,
}: DashboardClientProps) {
  const [activeSection, setActiveSection] = useState("inicio");
  const router = useRouter();

  useEffect(() => {
    if (userType !== "inventory_manager" || !storeId) return;

    // Hacer check de alertas solo para inventory_manager
    const checkAlerts = async () => {
      try {
        const response = await fetch(`/api/inventory/alerts/check/${storeId}`);
        if (!response.ok) throw new Error("Error verificando alertas");
        console.log("✅ Alertas actualizadas");
      } catch (error) {
        console.error("Error:", error);
      }
    };

    checkAlerts();
  }, [userType, storeId]);


  const handleCardClick = (title: string) => {
    console.log(`Clicked on: ${title}`);
    // Implementar navegación según la tarjeta clickeada
    if (title === "Alertas Activas") {
      router.push("/inventory/store/alerts");
    }
  };

  return (
    <AppLayout
      userType={userType}
      userName={userName}
      activeSection={activeSection}
    >
      {/* Inventory Overview */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          Resumen de Inventario
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {dashboardData.cards.map((card, index) => (
            <DashboardCard
              key={index}
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              onClick={() => handleCardClick(card.title)}
            />
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          Actividad Reciente
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {dashboardData.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6"
            >
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                {activity.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {activity.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Updates */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          {userType === "inventory_manager"
            ? "Actualizaciones Recientes de Inventario"
            : "Pedidos Recientes"}
        </h2>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px] sm:min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      className="rounded"
                      title="Seleccionar todo"
                    />
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {userType === "inventory_manager" ? "Nombre" : "Tienda"}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {userType === "inventory_manager" ? "Compañía" : "Tienda"}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {userType === "inventory_manager" ? "Producto" : "Producto"}
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {userType === "inventory_manager"
                      ? "Fecha"
                      : "Fecha"}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.orders.map((order, index) => (
                  <tr key={index} className={index === 1 ? "bg-purple-50" : ""}>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked={index === 1}
                        title={`Seleccionar ${order.name}`}
                      />
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.name}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.quantity}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.store}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.product}
                    </td>
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
