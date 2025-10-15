import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";


/**
 * GET /api/alerts/fetch?storeId=123
 * Devuelve todas las alertas de una tienda específica.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const storeIdParam = searchParams.get("storeId");

    // Validar parámetro
    if (!storeIdParam) {
      return NextResponse.json(
        { error: "Parámetro 'storeId' es obligatorio." },
        { status: 400 }
      );
    }

    const storeId = parseInt(storeIdParam, 10);
    if (isNaN(storeId)) {
      return NextResponse.json(
        { error: "El parámetro 'storeId' debe ser un número válido." },
        { status: 400 }
      );
    }

    // Consultar alertas en la BD
    const alerts = await prisma.alert.findMany({
      where: {
        storeId,
      },
      include: {
        product: true, // opcional, por si quieres mostrar info del producto
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ alerts }, { status: 200 });
  } catch (error: any) {
    console.error("Error al obtener alertas:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
