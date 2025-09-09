"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import DashboardCard from "@/components/DashboardCard";

// Iconos SVG
const InventoryIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const OrdersIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
  </svg>
);

const StoreIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 114 0 2 2 0 01-4 0zm6 0a2 2 0 114 0 2 2 0 01-4 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ReportIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

type UserType = "distributor" | "salesperson" | "inventory_manager";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("inventory_manager");
  const [activeSection, setActiveSection] = useState("inicio");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/accounting/login");
      return;
    }

    // Determinar tipo de usuario basado en la sesión
    // En producción, esto vendría de la base de datos
    if (session?.user?.email) {
      // Lógica para determinar el tipo de usuario
      // Por ahora usamos un valor por defecto
      setUserType("inventory_manager");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  // Datos dinámicos según el tipo de usuario
  const getDashboardData = () => {
    switch (userType) {
      case "inventory_manager":
        return {
          cards: [
            {
              title: "Productos en Stock",
              value: 45,
              icon: <InventoryIcon />,
              color: "blue" as const,
            },
            {
              title: "Alertas de Escasez",
              value: 3,
              icon: <AlertIcon />,
              color: "red" as const,
            },
            {
              title: "Pedidos Pendientes",
              value: 2,
              icon: <OrdersIcon />,
              color: "yellow" as const,
            },
            {
              title: "Ventas del Mes",
              value: "$1,250,000",
              icon: <ReportIcon />,
              color: "green" as const,
            },
          ],
          recentActivity: [
            { title: "Stock", description: "Gestión de inventario" },
            { title: "Top Items", description: "Productos más vendidos" },
          ],
          orders: [
            {
              name: "Leche",
              quantity: 12,
              company: "Distribuidora ABC",
              location: "Bodega A",
              rating: 3,
            },
            {
              name: "Pan",
              quantity: 15,
              company: "Panadería XYZ",
              location: "Estante 1",
              rating: 5,
            },
            {
              name: "Huevos",
              quantity: 18,
              company: "Granja Local",
              location: "Refrigerador",
              rating: 5,
            },
            {
              name: "Vegetales",
              quantity: 19,
              company: "Verdulería 123",
              location: "Sección Fría",
              rating: 4,
            },
          ],
        };
      case "salesperson":
      case "distributor":
        return {
          cards: [
            {
              title: "Pedidos Pendientes",
              value: 8,
              icon: <OrdersIcon />,
              color: "yellow" as const,
            },
            {
              title: "Tiendas Aliadas",
              value: 15,
              icon: <StoreIcon />,
              color: "blue" as const,
            },
            {
              title: "Productos Disponibles",
              value: 120,
              icon: <InventoryIcon />,
              color: "green" as const,
            },
            {
              title: "Ingresos del Mes",
              value: "$2,500,000",
              icon: <ReportIcon />,
              color: "purple" as const,
            },
          ],
          recentActivity: [
            { title: "Stock", description: "Inventario distribuidora" },
            { title: "Top Items", description: "Productos más solicitados" },
          ],
          orders: [
            {
              name: "Tienda El Barrio",
              quantity: 50,
              company: "Leche",
              location: "Pendiente",
              rating: 3,
            },
            {
              name: "Super Central",
              quantity: 100,
              company: "Pan",
              location: "Aprobado",
              rating: 5,
            },
            {
              name: "Los Pinos",
              quantity: 30,
              company: "Huevos",
              location: "Enviado",
              rating: 5,
            },
            {
              name: "Mercado Plus",
              quantity: 25,
              company: "Vegetales",
              location: "Recibido",
              rating: 4,
            },
          ],
        };
      default:
        return {
          cards: [],
          recentActivity: [],
          orders: [],
        };
    }
  };

  const dashboardData = getDashboardData();

  const handleCardClick = (title: string) => {
    console.log(`Clicked on: ${title}`);
    // Implementar navegación según la tarjeta clickeada
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar userType={userType} activeSection={activeSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header userType={userType} userName={session?.user?.name} />

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Inventory Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Resumen de Inventario
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Actividad Reciente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dashboardData.recentActivity.map((activity, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600">{activity.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Updates */}
          <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {userType === "inventory_manager"
                ? "Actualizaciones Recientes de Inventario"
                : "Pedidos Recientes"}
            </h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          className="rounded"
                          title="Seleccionar todo"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {userType === "inventory_manager" ? "Nombre" : "Tienda"}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cantidad
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {userType === "inventory_manager"
                          ? "Compañía"
                          : "Producto"}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {userType === "inventory_manager"
                          ? "Ubicación"
                          : "Estado"}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            className="rounded"
                            defaultChecked={index === 1}
                            title={`Seleccionar ${order.name}`}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.company}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
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
