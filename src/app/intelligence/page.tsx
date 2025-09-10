import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import IntelligenceClient from "./IntelligenceClient";

type UserType = "distributor" | "salesperson" | "inventory_manager";

// Función para consolidar datos de análisis
async function getAnalyticsData(userId: number, userType: UserType) {
  if (userType === "inventory_manager") {
    // Datos para Inventory Manager
    const inventoryManager = await prisma.inventoryManager.findUnique({
      where: { userId },
      include: {
        store: {
          include: {
            inventory: {
              include: {
                offeredProducts: true,
              },
            },
          },
        },
        orders: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!inventoryManager) return null;

    // Análisis básico de ventas
    const receivedOrders = inventoryManager.orders.filter(
      (order) => order.status === "received"
    );
    const totalSales = receivedOrders.reduce(
      (sum, order) => sum + order.price,
      0
    );
    const totalOrders = receivedOrders.length;

    // Análisis de productos agotados
    const outOfStockProducts =
      inventoryManager.store?.inventory?.offeredProducts.filter(
        (product) => !product.available
      ) || [];

    // Valor del inventario
    const inventoryValue =
      inventoryManager.store?.inventory?.offeredProducts.reduce(
        (sum, product) => sum + product.price,
        0
      ) || 0;

    return {
      store: inventoryManager.store,
      totalSales,
      totalOrders,
      outOfStockProducts,
      inventoryValue,
      salesTrend: 0, // Simplificado por ahora
    };
  } else if (userType === "salesperson") {
    // Datos para Salesperson
    const salesperson = await prisma.salesperson.findUnique({
      where: { userId },
      include: {
        orders: {
          include: {
            product: true,
            inventoryManager: {
              include: {
                store: true,
              },
            },
          },
        },
      },
    });

    if (!salesperson) return null;

    // Análisis básico de ventas
    const receivedOrders = salesperson.orders.filter(
      (order) => order.status === "received"
    );
    const totalSales = receivedOrders.reduce(
      (sum, order) => sum + order.price,
      0
    );
    const totalOrders = receivedOrders.length;

    // Análisis por tienda
    const salesByStore: Record<number, any> = {};
    receivedOrders.forEach((order) => {
      const storeId = order.inventoryManager.storeId;
      if (!salesByStore[storeId]) {
        salesByStore[storeId] = {
          store: order.inventoryManager.store,
          totalValue: 0,
          totalOrders: 0,
          uniqueProducts: new Set(),
        };
      }
      salesByStore[storeId].totalValue += order.price;
      salesByStore[storeId].totalOrders += 1;
      salesByStore[storeId].uniqueProducts.add(order.productId);
    });

    // Convertir Set a número
    Object.values(salesByStore).forEach((store) => {
      store.uniqueProducts = store.uniqueProducts.size;
    });

    return {
      salesByStore,
      totalSales,
      totalOrders,
      activeStores: Object.keys(salesByStore).length,
    };
  }

  return null;
}

export default async function IntelligencePage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/accounting/login");
  }

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

  let userType: UserType = "inventory_manager";
  if (user.inventoryManager) {
    userType = "inventory_manager";
  } else if (user.salesperson) {
    userType = "salesperson";
  } else {
    userType = "distributor";
  }

  // Obtener datos de análisis
  const analyticsData = await getAnalyticsData(user.id, userType);

  return (
    <IntelligenceClient
      userType={userType}
      userName={user.name}
      analyticsData={analyticsData}
    />
  );
}
