import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    // Verificar si el usuario es un encargado de inventario
    const userId = Number(session.user.id);
    const inventoryManager = await prisma.inventoryManager.findUnique({
      where: { userId },
    });

    if (!inventoryManager) {
      return NextResponse.json(
        { error: "No autorizado para realizar esta acción" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { productId, newPrice } = body;

    // Validacion de datos de entrada
    if (!productId || typeof newPrice !== "number") {
      return NextResponse.json(
        { error: "Datos de entrada inválidos" },
        { status: 400 }
      );
    }

    if (newPrice <= 0) {
      return NextResponse.json(
        { error: "El precio debe ser un número positivo mayor que cero" },
        { status: 400 }
      );
    }

    // Actualizar el producto en la base de datos
    const updatedProduct = await prisma.product.update({
      where: { id: Number(productId) },
      data: { price: newPrice },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar el precio:", error);
    return NextResponse.json(
      { error: "Ocurrió un error en el servidor" },
      { status: 500 }
    );
  }
}
