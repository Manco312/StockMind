import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Validación básica
    if (!data.productId || !data.quantity || !data.inventoryManagerId) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios" },
        { status: 400 }
      );
    }

    // Find only 'salesperson' or 'distributor' user
    const recipientUser = await prisma.salesperson.findFirst();
    if (!recipientUser) {
      return NextResponse.json(
        { error: "No se encontró un usuario distribuidor o vendedor" },
        { status: 404 }
      );
    }

    // Create order with notification
    const order = await prisma.order.create({
      data: {
        status: "pending",
        quantity: data.quantity,
        price: data.price,
        product: {
          connect: { id: data.productId },
        },
        inventoryManager: {
          connect: { userId: data.inventoryManagerId },
        },
        salesperson: {
          connect: { userId: recipientUser.userId },
        },
        notifications: {
          create: {
            title: "Nuevo Pedido",
            message:
              "Producto: " + data.productName + " - Cantidad: " + data.quantity,
            type: "order_created",
            recipient: {
              connect: { id: recipientUser.userId },
            },
          },
        },
      },
      include: { notifications: true },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("Error al crear el pedido:", error);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}
