import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    const existingOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { inventoryManager: true, product: true },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }

    if (existingOrder.status === "rejected" ) {
      return NextResponse.json(
        { message: "El pedido ya fue rechazado previamente" },
        { status: 400 }
      );
    }

    if (existingOrder.status === "accepted") {
      return NextResponse.json(
        { message: "No se puede rechazar un pedido aceptado" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "rejected",
      },
    });

    await prisma.notification.create({
      data: {
        recipientId: existingOrder.inventoryManagerId, 
        title: "Pedido rechazado",
        message: `Tu pedido #${orderId} ha sido rechazado por el distribuidor.`,
        type: "order_rejected",
        orderId: existingOrder.id,
      },
    });

    return NextResponse.json(
      { message: "Pedido rechazado correctamente", order: updatedOrder },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error al rechazar el pedido:", error);
    return NextResponse.json(
      { error: "Error al rechazar el pedido" },
      { status: 500 }
    );
  }
}
