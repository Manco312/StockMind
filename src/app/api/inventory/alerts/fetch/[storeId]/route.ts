import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const { storeId } = params;

  try {
    // Traer solo alertas activas de esa tienda
    const alerts = await prisma.alert.findMany({
      where: {
        storeId: Number(storeId),
        resolved: false,
      },
      include: {
        store: {
          select: { id: true, name: true },
        },
        product: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ alerts }, { status: 200 });
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    return NextResponse.json(
      { error: "Error al obtener alertas de la tienda" },
      { status: 500 }
    );
  }
}
