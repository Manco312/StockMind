import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const stores = await prisma.store.findMany({
      include: {
        inventory: {
          include: {
            offeredProducts: {
                include: { batches: true
                }
            }
          },
        },
      },
    });

    const alertsCreated: string[] = [];

    for (const store of stores) {
      for (const product of store.inventory.offeredProducts) {
        const totalStock = product.batches.reduce(
          (sum, batch) => sum + batch.quantity,
          0
        );

        if (totalStock < product.minimumStock) {
          // Evitar alertas duplicadas activas
          const existingAlert = await prisma.alert.findFirst({
            where: {
              productId: product.id,
              storeId: store.id,
              resolved: false,
            },
          });

          if (!existingAlert) {
            await prisma.alert.create({
              data: {
                type: "LOW_STOCK",
                message: `Stock bajo para ${product.title}: ${totalStock} unidades restantes.`,
                productId: product.id,
                storeId: store.id,
              },
            });
            alertsCreated.push(product.title);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Verificación completada",
      created: alertsCreated,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error al verificar alertas" },
      { status: 500 }
    );
  }
}
