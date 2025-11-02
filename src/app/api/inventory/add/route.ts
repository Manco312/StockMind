import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Validar sesión
  const session = await auth();
  if (!session?.user?.email)
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json(
      { error: "Usuario no encontrado" },
      { status: 404 }
    );

  // Verificar rol Inventory Manager
  const manager = await prisma.inventoryManager.findUnique({
    where: { userId: user.id },
    include: { store: { include: { inventory: true } } },
  });
  if (!manager)
    return NextResponse.json(
      { error: "No eres un Inventory Manager" },
      { status: 403 }
    );

  const storeInventoryId = manager.store?.inventory?.id;
  if (!storeInventoryId)
    return NextResponse.json(
      { error: "Inventario de la tienda no encontrado" },
      { status: 404 }
    );

  // Obtener productos seleccionados del body
  const body = await req.json();
  const selectedIds = body.products as number[];
  if (!selectedIds?.length)
    return NextResponse.json(
      { error: "No se seleccionó ningún producto" },
      { status: 400 }
    );

  // Obtener los productos de la distribuidora
  const distributorProducts = await prisma.product.findMany({
    where: { id: { in: selectedIds } },
  });

  if (!distributorProducts.length)
    return NextResponse.json({ error: "No se encontraron productos de distribuidora" }, { status: 404 });

  // Crear nuevas instancias para el inventario de la tienda
  const newProducts = await prisma.$transaction(
    distributorProducts.map((product) =>
      prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          available: product.available,
          minimumStock: product.minimumStock,
          inventoryId: storeInventoryId,
          distributorProductId: product.id, // relación con el producto padre
        },
      })
    )
  );

  return NextResponse.json({ success: true });
}
