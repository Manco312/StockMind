import { NextResponse } from "next/server";
import { prisma } from "src/lib/prisma";
import { authorizeSalespersonForInventory } from "src/lib/authorizeDistributor";

type Params = { inventoryId: string; productId: string };

export async function PUT(
  req: Request,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;
  const inventoryIdNum = Number(resolvedParams.inventoryId);
  const productIdNum = Number(resolvedParams.productId);

  if (Number.isNaN(inventoryIdNum) || Number.isNaN(productIdNum)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  // Autorización
  const authRes = await authorizeSalespersonForInventory(inventoryIdNum);
  if (!authRes.ok) {
    return NextResponse.json(
      { error: authRes.message },
      { status: authRes.status }
    );
  }

  const body = await req.json();
  const {
    title,
    description = "",
    category = "",
    price = 0,
    available = true,
  } = body ?? {};

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  try {
    const updated = await prisma.product.update({
      where: { id: productIdNum },
      data: {
        title,
        description,
        category,
        price: Number(price),
        available: Boolean(available),
      },
    });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("PUT error:", err);
    return NextResponse.json(
      { error: "Producto no encontrado o error DB" },
      { status: 404 }
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<Params> }
) {
  const resolvedParams = await params;
  const inventoryIdNum = Number(resolvedParams.inventoryId);
  const productIdNum = Number(resolvedParams.productId);

  if (Number.isNaN(inventoryIdNum) || Number.isNaN(productIdNum)) {
    return NextResponse.json({ error: "Invalid params" }, { status: 400 });
  }

  const authRes = await authorizeSalespersonForInventory(inventoryIdNum);
  if (!authRes.ok) {
    return NextResponse.json(
      { error: authRes.message },
      { status: authRes.status }
    );
  }

  try {
    await prisma.product.delete({ where: { id: productIdNum } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("DELETE error:", err);
    return NextResponse.json(
      { error: "Producto no encontrado o error DB" },
      { status: 404 }
    );
  }
}
