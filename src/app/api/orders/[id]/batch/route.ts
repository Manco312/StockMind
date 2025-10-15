import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: { sentBatchId: true },
    });

    if (!order || !order.sentBatchId) {
      return NextResponse.json(
        { error: "No se encontró un lote asociado a esta orden" },
        { status: 404 }
      );
    }

    const batch = await prisma.batch.findUnique({
      where: { id: order.sentBatchId },
    });

    if (!batch) {
      return NextResponse.json(
        { error: "Lote no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(batch);
  } catch (error) {
    console.error("Error obteniendo el batch:", error);
    return NextResponse.json(
      { error: "Error al obtener la información del batch" },
      { status: 500 }
    );
  }
}
