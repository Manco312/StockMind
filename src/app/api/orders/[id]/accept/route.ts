import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const orderId = parseInt(id)
    const body = await req.json();
    const { quantity, expirationDate, location } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        product: {
          include: {distributorProduct: true}
        },
        salesperson: { 
          include: { inventory: { include: { batches: true } } } 
        },
        inventoryManager: {
          include: { store: { include: { inventory: true } } },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    if (order.status === "rejected") {
      return NextResponse.json(
        { message: "El pedido ya fue rechazado previamente" },
        { status: 400 }
      );
    }

    if (order.status === "accepted") {
      return NextResponse.json(
        { message: "El pedido ya fue aceptado previamente" },
        { status: 400 }
      );
    }

    const distributorInventory = order.salesperson?.inventory;
    if (!distributorInventory) {
      return NextResponse.json(
        { message: "El distribuidor no tiene un inventario asociado." },
        { status: 400 }
      );
    }

    const productBatches = await prisma.batch.findMany({
      where: {
        inventoryId: distributorInventory.id,
        productId: order.product?.distributorProduct?.id,
        expired: false,
        quantity: { gt: 0 },
      },
    });

    const totalStock = productBatches.reduce((acc, batch) => acc + batch.quantity, 0);

    if (totalStock < order.quantity) {
      return NextResponse.json(
        { message: `Stock insuficiente ➡️ Disponible: ${totalStock}, requerido: ${order.quantity}` },
        { status: 400 }
      );
    }

    let remaining = order.quantity;

    for (const batch of productBatches) {
      if (remaining <= 0) break;

      const deduction = Math.min(batch.quantity, remaining);
      remaining -= deduction;

      await prisma.batch.update({
        where: { id: batch.id },
        data: {
          quantity: batch.quantity - deduction,
        },
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: "accepted", 
        createdAt: new Date(), 
      },
    });

    const purchasePrice =
      order.quantity > 0 ? order.price / order.quantity : 0;

    const newBatch = await prisma.batch.create({
      data: {
        code: `BATCH-${Date.now()}-${order.productId}`,
        quantity,
        expirationDate: new Date(expirationDate),
        productId: order.productId,
        location: location || "Por definir",
        purchasePrice,
        inventoryId: order.salesperson.inventory?.id,
        orders: {
          connect: { id: order.id },
        },
      },
    });

    await prisma.productUpdate.create({
      data: {
        productId: order.productId,
        type: "sale", 
        message: `Venta de ${order.quantity} unidades a tienda ${order.inventoryManager.store?.name}`,
        date: new Date(),
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
