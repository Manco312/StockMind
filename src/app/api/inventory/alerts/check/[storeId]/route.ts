import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const storeId = parseInt(params.storeId, 10);
    if (isNaN(storeId)) {
      return NextResponse.json({ error: "ID de tienda inválido" }, { status: 400 });
    }

    // Buscar productos de la tienda
    const products = await prisma.product.findMany({
      where: {
        inventory: {
          storeId: storeId,
        },
      },
      include: {
        batches: true,
        inventory: true,
      },
    });

    const alertsToCreate: any[] = [];
    const alertsToResolve: any[] = [];

    for (const product of products) {
      const totalStock = product.batches.reduce(
        (sum, batch) => sum + batch.quantity,
        0
      );

      const existingAlert = await prisma.alert.findFirst({
        where: { productId: product.id, storeId: storeId, resolved: false },
      });

      if (totalStock <= product.minimumStock) {
        if (!existingAlert) {
          alertsToCreate.push({
            productId: product.id,
            storeId,
            message: `Stock bajo para ${product.title}: ${totalStock} unidades restantes.`,
          });
        }
      } else if (existingAlert) {
        alertsToResolve.push(existingAlert.id);
      }
    }

    // Crear nuevas alertas
    if (alertsToCreate.length > 0) {
      await prisma.alert.createMany({ data: alertsToCreate });
    }

    // Marcar alertas resueltas
    if (alertsToResolve.length > 0) {
      await prisma.alert.updateMany({
        where: { id: { in: alertsToResolve } },
        data: { resolved: true, message: "Stock normalizado" },
      });
    }

    return NextResponse.json({
      message: "Revisión de alertas completada",
      created: alertsToCreate.length,
      resolved: alertsToResolve.length,
    });
  } catch (error) {
    console.error("❌ Error al verificar alertas:", error);
    return NextResponse.json(
      { error: "Error al verificar alertas de la tienda" },
      { status: 500 }
    );
  }
}
