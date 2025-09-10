"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
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
}

export default function DashboardClient({
  userType,
  userName,
  dashboardData,
}: DashboardClientProps) {
  const [activeSection, setActiveSection] = useState("inicio");

  const handleCardClick = (title: string) => {
    console.log(`Clicked on: ${title}`);
    // Implementar navegación según la tarjeta clickeada
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar userType={userType} activeSection={activeSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <Header userType={userType} userName={userName} />

        {/* Dashboard Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto pt-14 lg:pt-6">
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
                        {userType === "inventory_manager"
                          ? "Compañía"
                          : "Producto"}
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {userType === "inventory_manager"
                          ? "Ubicación"
                          : "Estado"}
                      </th>
                      <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {userType === "inventory_manager"
                          ? "Reabastecer"
                          : "Prioridad"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.orders.map((order, index) => (
                      <tr
                        key={index}
                        className={index === 1 ? "bg-purple-50" : ""}
                      >
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
                          {order.company}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.location}
                        </td>
                        <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < order.rating
                                    ? "text-purple-500"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
