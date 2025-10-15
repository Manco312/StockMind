import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = parseInt(params.id);
    const body = await req.json();
    const { location } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: true,
        sentBatch: true,
        inventoryManager: {
          include: { store: { include: { inventory: true } } },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    if (order.status !== "accepted") {
      return NextResponse.json(
        { error: "Solo los pedidos aceptados por el distribuidor pueden ser recibidos" },
        { status: 400 }
      );
    }

    const batch = order.sentBatch;
    if (!batch) {
      return NextResponse.json(
        { error: "No se encontró un lote asociado a la orden" },
        { status: 404 }
      );
    }

    const inventory = order.inventoryManager?.store?.inventory;
    if (!inventory) {
      return NextResponse.json(
        { error: "No se encontró inventario para la tienda actual" },
        { status: 404 }
      );
    }

    const updatedBatch = await prisma.batch.update({
      where: { id: batch.id },
      data: {
        inventoryId: inventory.id,
        location,
      },
    });

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: "received",
        createdAt: new Date(), 
      },
    });

    const recipientUser = await prisma.salesperson.findFirst();
    if (recipientUser) {
      await prisma.notification.create({
        data: {
          recipientId: recipientUser.userId,
          title: "Orden marcada como recibida",
          message: `La orden del producto "${order.product?.title}" fue recibida por "${order.inventoryManager?.store.name}".`,
          type: "order_received",
          read: false,
          createdAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Orden recibida y batch actualizado con el inventario del manager",
      order: updatedOrder,
      batch: updatedBatch,
    });
  } catch (error) {
    console.error("Error al recibir orden:", error);
    return NextResponse.json(
      { error: "Error al procesar la recepción de la orden" },
      { status: 500 }
    );
  }
}
