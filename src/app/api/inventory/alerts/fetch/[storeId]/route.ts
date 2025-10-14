import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const { storeId } = params;

  try {
    const alerts = await prisma.alert.findMany({
      where: {
        storeId: Number(storeId),
        resolved: false,
      },
      include: {
        store: {
          select: { id: true, name: true },
        },
        product: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const inventoryManager = await prisma.inventoryManager.findUnique({
      where: { storeId: Number(storeId) },
      select: { userId: true },
    });

    const inventoryManagerId = inventoryManager?.userId;

    const alertsWithOrders = await Promise.all(
      alerts.map(async (alert) => {
        const existingOrder = await prisma.order.findFirst({
          where: {
            inventoryManagerId: Number(inventoryManagerId),
            productId: alert.productId,
            status: { in: ["pending", "in_progress"] }, // ajusta según tus estados
          },
        });

        return {
          ...alert,
          hasActiveOrder: !!existingOrder,
        };
      })
    );

    return NextResponse.json({ alerts: alertsWithOrders}, { status: 200 });
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    return NextResponse.json(
      { error: "Error al obtener alertas de la tienda" },
      { status: 500 }
    );
  }
}
