import { NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { authorizeSalespersonForInventory } from "src/lib/authorizeDistributor";

type Params = { inventoryId: string };

// Listar productos del inventario con cantidad total (solo de ese inventario)
export async function GET(_: Request, context: { params: Promise<Params> }) {
  const { inventoryId } = await context.params;
  const inventoryIdNum = Number(inventoryId);

  if (Number.isNaN(inventoryIdNum))
    return NextResponse.json({ error: "Invalid inventoryId" }, { status: 400 });

  const products = await prisma.product.findMany({
    where: { inventoryId: inventoryIdNum },
    include: {
      batches: {
        where: { inventoryId: inventoryIdNum },
        select: { quantity: true, expired: true },
      },
    },
    orderBy: { id: "desc" },
  });

  const productsWithTotals = products.map((p) => ({
    ...p,
    totalQuantity: p.batches.reduce((acc, b) => acc + b.quantity, 0),
  }));

  return NextResponse.json(productsWithTotals);
}

// Crear nuevo producto
export async function POST(req: Request, context: { params: Promise<Params> }) {
  const { inventoryId } = await context.params;
  const inventoryIdNum = Number(inventoryId);

  if (Number.isNaN(inventoryIdNum))
    return NextResponse.json({ error: "Invalid inventoryId" }, { status: 400 });

  // Autorización
  const authRes = await authorizeSalespersonForInventory(inventoryIdNum);
  if (!authRes.ok)
    return NextResponse.json({ error: authRes.message }, { status: authRes.status });

  const body = await req.json();
  const { title, description = "", category = "", price = 0, available = true } = body ?? {};

  if (!title || typeof title !== "string")
    return NextResponse.json({ error: "title required" }, { status: 400 });

  const product = await prisma.product.create({
    data: {
      title,
      description,
      category,
      price: Number(price),
      available: Boolean(available),
      inventory: { connect: { id: inventoryIdNum } },
    },
  });

  return NextResponse.json(product, { status: 201 });
}
