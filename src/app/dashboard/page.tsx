import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { getTotalOfferedProducts, getLowStockAlerts, getRecentReceivedOrders } 
  from "@/src/lib/services/inventoryManagerService";
import { getRecentOrders, getStores, getTotalStores, getAvailableProducts } 
  from "@/src/lib/services/salespersonService";
import DistributorInventoryPage from "../inventory/distributor/page";

// Icons
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

const AlertIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
      clipRule="evenodd"
    />
  </svg>
);

const ReportIcon = () => (
  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

// User Type
type UserType = "distributor" | "salesperson" | "inventory_manager";

// Main Dashboard
export default async function Dashboard() {
  const session = await auth();
  if (!session?.user?.email) redirect("/accounting/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      inventoryManager: {
        include: {
          store: { include: { inventory: true } },
        },
      },
      salesperson: {
        include: {
          inventory: { include: { store: true } },
        },
      },
    },
  });

  if (!user) redirect("/accounting/login");

  let storeId = null;

  // Solo los inventory_manager tienen tienda
  if (user?.inventoryManager?.store) {
    storeId = user.inventoryManager.storeId;
  }

  let userType: UserType = "distributor";
  if (user.inventoryManager) userType = "inventory_manager";
  else if (user.salesperson) userType = "salesperson";

  // Inventory Manager Dashboard Functions
  async function getInventoryManagerDashboard() {
    const store = user.inventoryManager?.store;
    if (!store?.inventory?.id) return null;

    const totalStock = await getTotalOfferedProducts(store.inventory.id);
    const alerts = await getLowStockAlerts(store.id);
    const orders = await getRecentReceivedOrders(user.id);

    return {
      cards: [
        {
          title: "Productos en Stock",
          value: totalStock,
          icon: <InventoryIcon />,
          color: "blue" as const,
        },
        {
          title: "Alertas Activas",
          value: alerts.length,
          icon: <AlertIcon />,
          color: "red" as const,
        },
        {
          title: "Pedidos Pendientes",
          value: orders.length,
          icon: <OrdersIcon />,
          color: "yellow" as const,
        },
        {
          title: "Ventas del Mes",
          value: "$832000",
          icon: <ReportIcon />,
          color: "green" as const,
        },
      ],
      recentActivity: [
        {
          title: "Gestión de Inventario",
          description: `${totalStock} productos disponibles`,
        },
        {
          title: "Alertas activas",
          description: `${alerts.length} alertas sin resolver`,
        },
      ],
      orders: orders.map((order) => ({
        name: `Pedido #${order.id}`,
        quantity: order.quantity || 0,
        store: "Distribuidora Central",
        product: order.product.title || "Desconocido",
        date: order.createdAt.toLocaleDateString(),
      })),
    };
  }

  // Distributor and Salesperson Dashboard Functions
  async function getSalesOrDistributorDashboard() {
    const pendingOrders = await getRecentOrders("pending");
    const totalStores = await getTotalStores();
    const availableProducts = await getAvailableProducts(8);
    const receivedOrders = await getRecentOrders("received");
    const cancelledOrders = await getRecentOrders("cancelled");

    return {
      cards: [
        {
          title: "Pedidos Pendientes",
          value: pendingOrders.length,
          icon: <OrdersIcon />,
          color: "yellow" as const,
        },
        {
          title: "Tiendas Aliadas",
          value: totalStores,
          icon: <ReportIcon />,
          color: "blue" as const,
        },
        {
          title: "Productos Disponibles",
          value: availableProducts.length,
          icon: <InventoryIcon />,
          color: "green" as const,
        },
        {
          title: "Ingresos del Mes",
          value: "$725000",  
          icon: <ReportIcon />,
          color: "purple" as const,
        },
      ],
      recentActivity: [
        {
          title: "Pedidos recibidos",
          description: `${receivedOrders.length} marcados como recibidos por tiendas`,
        },
        {
          title: "Pedidos canelados",
          description: `Cancelaste ${cancelledOrders.length} solicitudes de pedidos`,
        },
      ],
      orders: pendingOrders.map((order) => ({
        name: `Pedido #${order.id}`,
        quantity: order.quantity || 0,
        store: order.inventoryManager.store.name,
        product: order.product.title || "Desconocido",
        date: order.createdAt.toLocaleDateString(),
      })),
    };
  }

  // Select Dashboard Data based on User Role
  let dashboardData;

  if (userType === "inventory_manager") {
    dashboardData = await getInventoryManagerDashboard();
  } else {
    dashboardData = await getSalesOrDistributorDashboard();
  }

  if (!dashboardData) {
    dashboardData = {
      cards: [],
      recentActivity: [],
      orders: [],
    };
  }

  return (
    <DashboardClient
      userType={userType}
      userName={user.name}
      dashboardData={dashboardData}
      storeId={storeId}
    />
  );
}
