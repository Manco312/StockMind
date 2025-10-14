import { NextResponse } from "next/server";
import {prisma} from "src/lib/prisma";
import { authorizeSalespersonForInventory } from "src/lib/authorizeDistributor";

type Params = { inventoryId: string; productId: string };

export async function PUT(req: Request, { params }: { params: Params }) {
  const inventoryId = Number(params.inventoryId);
  const productId = Number(params.productId);
  if (Number.isNaN(inventoryId) || Number.isNaN(productId))
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });

  const authRes = await authorizeSalespersonForInventory(inventoryId);
  if (!authRes.ok) return NextResponse.json({ error: authRes.message }, { status: authRes.status });

  const body = await req.json();
  const updated = await prisma.product.update({
    where: { id: productId },
    data: {
      title: body.title,
      description: body.description,
      category: body.category,
      price: body.price !== undefined ? Number(body.price) : undefined,
      available: body.available !== undefined ? Boolean(body.available) : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const inventoryId = Number(params.inventoryId);
  const productId = Number(params.productId);
  if (Number.isNaN(inventoryId) || Number.isNaN(productId))
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });

  const authRes = await authorizeSalespersonForInventory(inventoryId);
  if (!authRes.ok) return NextResponse.json({ error: authRes.message }, { status: authRes.status });

  await prisma.product.delete({ where: { id: productId } });
  return NextResponse.json({ ok: true });
}
