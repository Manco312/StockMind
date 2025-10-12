import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    const alert = await prisma.alert.findUnique({
      where: { id },
      include: {
        product: {
          include: { batches: true },
        },
      },
    });

    if (!alert) {
      return NextResponse.json(
        { success: false, message: "Alerta no encontrada" },
        { status: 404 }
      );
    }

    // Calcular stock actual
    const totalStock = alert.product.batches.reduce(
      (sum, batch) => sum + batch.quantity,
      0
    );

    if (totalStock <= alert.product.minimumStock) {
      return NextResponse.json({
        success: false,
        message: `No puedes marcar esta alerta como resuelta: el stock (${totalStock}) sigue por debajo del mínimo (${alert.product.minimumStock}).`,
      });
    }

    // Si el stock ya se normalizó, marcar como resuelta
    await prisma.alert.update({
      where: { id },
      data: { resolved: true, message: "Stock normalizado ✅" },
    });

    return NextResponse.json({
      success: true,
      message: "Alerta marcada como resuelta correctamente",
    });
  } catch (error) {
    console.error("Error resolviendo alerta:", error);
    return NextResponse.json(
      { success: false, message: "Error interno al resolver la alerta" },
      { status: 500 }
    );
  }
}
