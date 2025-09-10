import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

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

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/accounting/login");
  }

  // Obtener información del usuario desde la base de datos
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      inventoryManager: true,
      salesperson: true,
    },
  });

  if (!user) {
    redirect("/accounting/login");
  }

  // Determinar tipo de usuario
  let userType: UserType = "inventory_manager";
  if (user.inventoryManager) {
    userType = "inventory_manager";
  } else if (user.salesperson) {
    userType = "salesperson";
  } else {
    // Si no tiene rol específico, usar distributor como fallback
    userType = "distributor";
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
            { title: "Ventas", description: "Gestión de ventas" },
            { title: "Clientes", description: "Relación con clientes" },
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

  return (
    <DashboardClient
      userType={userType}
      userName={user.name}
      dashboardData={dashboardData}
    />
  );
}
