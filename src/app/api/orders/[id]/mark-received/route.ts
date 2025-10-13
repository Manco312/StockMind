import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "received" },
      include: { product: true },
    });

    const recipientUser = await prisma.salesperson.findFirst();
    if (!recipientUser) {
      return NextResponse.json(
        { error: "No se encontró un usuario vendedor para notificar" },
        { status: 404 }
      );
    }

    await prisma.notification.create({
      data: {
        recipientId: recipientUser.userId, // o el campo que uses para el id del usuario
        title: "Orden marcada como recibida",
        message: `La orden del producto "${updatedOrder.product?.title}" ha sido marcada como recibida.`,
        type: "order_received",
        read: false,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Orden actualizada y notificación enviada correctamente",
      order: updatedOrder,
    });

  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Error al actualizar la orden" },
      { status: 500 }
    );
  }
}
