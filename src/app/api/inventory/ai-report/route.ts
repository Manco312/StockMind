import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";

// Helper function to calculate date offsets
const getPastDate = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

export async function GET() {
  const session = await auth();

  // 1. Authorization Check
  if (!session?.user || session.user.role !== "INVENTORY_MANAGER") {
    return NextResponse.json(
      { error: "No autorizado. Se requiere rol de Encargado de Inventario." },
      { status: 403 }
    );
  }

  try {
    // 2. Data Fetching: Get the correct inventory for the logged-in manager
    const user = await prisma.user.findUnique({
      where: { email: session!.user!.email! },
      include: { inventoryManager: { include: { store: { include: { inventory: true } } } } },
    });

    const inventoryId = user?.inventoryManager?.store?.inventory?.id;

    if (!inventoryId) {
      return NextResponse.json(
        { error: "No se pudo encontrar el inventario para este usuario." },
        { status: 404 }
      );
    }

    const products = await prisma.product.findMany({
      where: { inventoryId: inventoryId },
      include: {
        orders: {
          where: {
            status: "received",
            createdAt: {
              gte: getPastDate(90),
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        batches: {
          where: {
            expired: false,
          },
        },
      },
    });

    const salesPeriodDays = 30;

    // 3. Data Processing and Analysis
    const productAnalysis = products.map((product) => {
      const stock = product.batches.reduce((sum, batch) => sum + batch.quantity, 0);

      const salesLast30Days = product.orders
        .filter((order) => order.createdAt >= getPastDate(salesPeriodDays))
        .reduce((sum, order) => sum + order.quantity, 0);

      // CAMBIO IMPORTANTE: Calcular promedio diario basado en 30 días, no 90
      const avgDailySales = salesLast30Days / salesPeriodDays;

      return {
        ...product,
        stock,
        salesLast30Days,
        avgDailySales,
      };
    });

    // 4. Separate products with sales from those with zero sales.
    const productsWithSales = productAnalysis.filter(p => p.salesLast30Days > 0);
    const productsWithNoSales = productAnalysis.filter(p => p.salesLast30Days === 0);

    // 5. Dynamically define low and regular turnover groups from products that have sales.
    const sortedProductsWithSales = [...productsWithSales].sort(
      (a, b) => a.salesLast30Days - b.salesLast30Days
    );
    
    const thresholdIndex = Math.floor(sortedProductsWithSales.length * 0.25);
    const lowTurnoverFromSales = sortedProductsWithSales.slice(0, thresholdIndex);
    const regularTurnoverProducts = sortedProductsWithSales.slice(thresholdIndex);

    // 6. Combine all low turnover products (zero sales + low sales)
    const lowTurnoverProducts = [...productsWithNoSales, ...lowTurnoverFromSales]
        .map(p => ({
            productId: p.id.toString(),
            name: p.title,
            salesLast30Days: p.salesLast30Days,
            currentStock: p.stock,
        }))
        .sort((a, b) => a.salesLast30Days - b.salesLast30Days);

    // 7. Analyze regular turnover products for shortages and demand patterns.
    const potentialShortages = regularTurnoverProducts
      .filter((p) => p.avgDailySales > 0 && p.stock / p.avgDailySales < 15) // Predict for next 15 days
      .map((p) => ({
        productId: p.id.toString(),
        name: p.title,
        daysUntilStockout: Math.floor(p.stock / p.avgDailySales),
        currentStock: p.stock,
        avgDailySales: parseFloat(p.avgDailySales.toFixed(2)),
      }))
      .sort((a, b) => a.daysUntilStockout - b.daysUntilStockout);

    const demandPatterns = regularTurnoverProducts
      .map((product) => {
        const recentSales = product.orders.filter(
          (s) => s.createdAt >= getPastDate(15)
        );
        const previousSales = product.orders.filter(
          (s) =>
            s.createdAt < getPastDate(15) && s.createdAt >= getPastDate(30)
        );

        const recentTotal = recentSales.reduce((sum, s) => sum + s.quantity, 0);
        const previousTotal = previousSales.reduce(
          (sum, s) => sum + s.quantity,
          0
        );

        let trend = "stable";
        let changePercentage = 0;

        if (previousTotal > 0) {
          changePercentage = ((recentTotal - previousTotal) / previousTotal) * 100;
          if (changePercentage > 20) trend = "increasing";
          if (changePercentage < -20) trend = "decreasing";
        } else if (recentTotal > 0) {
          trend = "new_demand";
          changePercentage = 100;
        }

        return {
          productId: product.id.toString(),
          name: product.title,
          trend,
          changePercentage: parseFloat(changePercentage.toFixed(1)),
        };
      })
      .filter((p) => p.trend !== "stable");

    // 8. Final JSON Response
    const analysisResult = {
      potentialShortages,
      lowTurnoverProducts,
      demandPatterns,
    };

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("Error generating AI report:", error);
    return NextResponse.json(
      { error: "Ocurrió un error al generar el reporte." },
      { status: 500 }
    );
  }
}
