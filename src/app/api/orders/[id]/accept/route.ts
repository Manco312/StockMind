import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const body = await req.json();
    const { quantity, expirationDate, location } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        salesperson: { 
          include: { inventory: true } 
        },
        inventoryManager: {
          include: { store: { include: { inventory: true } }},
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    if (order.status === "rejected" ) {
      return NextResponse.json(
        { message: "El pedido ya fue rechazado previamente" },
        { status: 400 }
      );
    }

    if (order.status === "accepted") {
      return NextResponse.json(
        { message: "No se puede rechazar un pedido aceptado" },
        { status: 400 }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: "accepted", 
        createdAt: new Date(), 
      },
    });

    const inventoryId = order.inventoryManager.store?.inventory?.id;
    if (typeof inventoryId !== "number") {
      return NextResponse.json(
        { error: "No se encontró un inventario válido para el pedido." },
        { status: 400 }
      );
    }

    const newBatch = await prisma.batch.create({
      data: {
        code: `BATCH-${Date.now()}-${order.productId}`,
        quantity,
        expirationDate: new Date(expirationDate),
        productId: order.productId,
        location: "Por definir",
        inventoryId: order.salesperson.inventory?.id,
        orders: {
          connect: { id: order.id },
        },
      },
    });

    await prisma.notification.create({
      data: {
        recipientId: updatedOrder.inventoryManagerId, 
        title: "Pedido aceptado",
        message: `Tu pedido #${orderId} ha sido aceptado por el distribuidor.`,
        type: "order_accepted",
        orderId: updatedOrder.id,
      },
    });

    return NextResponse.json({
      message: "Orden aceptada y lote creado exitosamente",
      order: updatedOrder,
      batch: newBatch,
    });
  } catch (error) {
    console.error("Error al aceptar la orden:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
