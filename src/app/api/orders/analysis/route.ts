import { NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";

export async function GET() {
  try {
    const totalOrders = await prisma.order.count();

    const ordersByStatus = await prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    });

    const avgPrice = await prisma.order.aggregate({
      _avg: { price: true },
    });

    const topSalespeople = await prisma.order.groupBy({
      by: ["salespersonId"],
      _sum: { price: true },
      _count: { id: true },
      orderBy: { _sum: { price: "desc" } },
      take: 5,
    });

    const monthlyOrders: any[] = await prisma.$queryRawUnsafe(`
      SELECT TO_CHAR("createdAt", 'YYYY-MM') as month, COUNT(*) as total
      FROM orders
      GROUP BY 1
      ORDER BY 1;
    `);

    // 🔧 Convertir BigInt a Number o String
    const safeData = {
      totalOrders: Number(totalOrders),
      ordersByStatus: ordersByStatus.map(o => ({
        status: o.status,
        count: Number(o._count.status),
      })),
      avgPrice: Number(avgPrice._avg.price ?? 0),
      topSalespeople: topSalespeople.map(s => ({
        salespersonId: s.salespersonId,
        totalSales: Number(s._sum.price ?? 0),
        totalOrders: Number(s._count.id),
      })),
      monthlyOrders: monthlyOrders.map(m => ({
        month: m.month,
        total: Number(m.total),
      })),
    };

    return NextResponse.json(safeData);
  } catch (error) {
    console.error("Error in /api/orders/analysis:", error);
    return NextResponse.json({ error: "Error al obtener el análisis" }, { status: 500 });
  }
}
