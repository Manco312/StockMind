import { NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { authorizeSalespersonForInventory } from "src/lib/authorizeDistributor";

type Params = { inventoryId: string };

// listar productos del inventario
export async function GET(_: Request, context: { params: Promise<Params> }) {
  const { inventoryId } = await context.params;
  const inventoryIdNum = Number(inventoryId);

  if (Number.isNaN(inventoryIdNum))
    return NextResponse.json({ error: "Invalid inventoryId" }, { status: 400 });

  const products = await prisma.product.findMany({
    where: { inventoryId: inventoryIdNum },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(products);
}

// crear nuevo producto
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
