import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import IntelligenceClient from "./IntelligenceClient";

type UserType = "distributor" | "salesperson" | "inventory_manager";


// 1. Definición de la Interfaz Insight (para tipado)
interface Insight {
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
}

// 2. Definición de la Función generateDistributorInsights
function generateDistributorInsights(
  highRotation: any[],
  lowRotation: any[],
  numStores: number
): Insight[] {
  const insights: Insight[] = [];

  // Sugerencia para Alta Rotación
  if (highRotation.length > 0) {
    const topProduct = highRotation[0];
    insights.push({
      type: "success",
      title: `Priorizar el stock de ${topProduct.product.title}`,
      message: `El producto con mayor rotación a nivel global es **${
        topProduct.product.title
      }** con ${topProduct.totalQuantity} unidades vendidas. Asegura un stock preventivo en todas tus ${numStores} tiendas para evitar faltantes.`,
    });
  }

  // Sugerencia para Baja Rotación
  if (lowRotation.length > 0) {
    const lowestProduct = lowRotation[0];
    insights.push({
      type: "warning",
      title: `Evaluar la continuidad de ${lowestProduct.product.title}`,
      message: `**${lowestProduct.product.title}** tiene la rotación más baja (${lowestProduct.totalQuantity} unidades). Considera una promoción o liquidación cruzada para liberar inventario, o su descontinuación.`,
    });
  }
  
  // Sugerencia de Consolidación
  if (numStores > 1 && lowRotation.length > 0) {
      insights.push({
          type: "info",
          title: "Consolidación de productos de baja rotación",
          message: "Para reducir costos de almacenamiento, considera mover el stock restante de los productos de baja rotación a una sola tienda para facilitar su venta o liquidación final.",
      });
  }


  return insights;
}


// Función para consolidar datos de análisis
async function getAnalyticsData(userId: number, userType: UserType) {
  // Usamos ID como proxy de tiempo (IDs más altos = más recientes)

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

    // Análisis de ventas por período usando ID como proxy de tiempo
    const allReceivedOrders = inventoryManager.orders.filter(
      (order) => order.status === "received"
    );

    // Ordenar por ID descendente (IDs más altos = más recientes)
    const sortedOrders = allReceivedOrders.sort((a, b) => b.id - a.id);

    // Dividir en períodos: 60% más recientes vs 40% más antiguos
    const recentOrdersCount = Math.ceil(sortedOrders.length * 0.6);
    const recentOrders = sortedOrders.slice(0, recentOrdersCount);
    const previousOrders = sortedOrders.slice(recentOrdersCount);

    const recentSales = recentOrders.reduce(
      (sum, order) => sum + order.price,
      0
    );
    const previousSales = previousOrders.reduce(
      (sum, order) => sum + order.price,
      0
    );

    // Calcular tendencia de ventas
    const salesTrend =
      previousSales > 0
        ? ((recentSales - previousSales) / previousSales) * 100
        : 0;

    // Análisis de productos por rotación
    const salesByProduct: Record<number, any> = {};
    recentOrders.forEach((order) => {
      const productId = order.productId;
      if (!salesByProduct[productId]) {
        salesByProduct[productId] = {
          product: order.product,
          totalQuantity: 0,
          totalValue: 0,
          orders: 0,
        };
      }
      salesByProduct[productId].totalQuantity += order.quantity;
      salesByProduct[productId].totalValue += order.price;
      salesByProduct[productId].orders += 1;
    });

    // Productos con alta rotación (top 5)
    const highRotationProducts = Object.values(salesByProduct)
      .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
      .slice(0, 5);

    // Productos con baja rotación (bottom 5)
    const lowRotationProducts = Object.values(salesByProduct)
      .sort((a: any, b: any) => a.totalQuantity - b.totalQuantity)
      .slice(0, 5);

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
      totalSales: recentSales,
      totalOrders: recentOrders.length,
      outOfStockProducts,
      inventoryValue,
      salesTrend,
      highRotationProducts,
      lowRotationProducts,
      salesByProduct,
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

    // Análisis de ventas por período usando ID como proxy de tiempo
    const allReceivedOrders = salesperson.orders.filter(
      (order) => order.status === "received"
    );

    // Ordenar por ID descendente y tomar los 60% más recientes
    const sortedOrders = allReceivedOrders.sort((a, b) => b.id - a.id);
    const recentOrdersCount = Math.ceil(sortedOrders.length * 0.6);
    const recentOrders = sortedOrders.slice(0, recentOrdersCount);

    const totalSales = recentOrders.reduce(
      (sum, order) => sum + order.price,
      0
    );
    const totalOrders = recentOrders.length;

    // Análisis por tienda
    const salesByStore: Record<number, any> = {};
    recentOrders.forEach((order) => {
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

    // --- NUEVO ANÁLISIS GLOBAL DE ROTACIÓN PARA EL DISTRIBUIDOR ---
    
    // 1. Análisis de rotación de productos AGREGADO (igual que el Inventory Manager,
    // pero usando TODOS los recentOrders del Distribuidor, que son de todas las tiendas)
    const salesByProductGlobal: Record<number, any> = {};
    recentOrders.forEach((order) => {
        const productId = order.productId;
        if (!salesByProductGlobal[productId]) {
            salesByProductGlobal[productId] = {
                product: order.product,
                totalQuantity: 0,
                totalValue: 0,
                orders: 0,
            };
        }
        salesByProductGlobal[productId].totalQuantity += order.quantity;
        salesByProductGlobal[productId].totalValue += order.price;
        salesByProductGlobal[productId].orders += 1;
    });

    // 2. Productos con alta rotación global (Top 5)
    const highRotationProductsGlobal = Object.values(salesByProductGlobal)
        .sort((a: any, b: any) => b.totalQuantity - a.totalQuantity)
        .slice(0, 5);

    // 3. Productos con baja rotación global (Bottom 5)
    const lowRotationProductsGlobal = Object.values(salesByProductGlobal)
        .sort((a: any, b: any) => a.totalQuantity - b.totalQuantity)
        .slice(0, 5);

    // 4. Generación de Sugerencias (Insights)
    const insights = generateDistributorInsights(
        highRotationProductsGlobal, 
        lowRotationProductsGlobal, 
        Object.keys(salesByStore).length // Número de tiendas
    );

    return {
      salesByStore,
      totalSales,
      totalOrders,
      activeStores: Object.keys(salesByStore).length,
      highRotationProductsGlobal,
      lowRotationProductsGlobal,
      insights,
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
