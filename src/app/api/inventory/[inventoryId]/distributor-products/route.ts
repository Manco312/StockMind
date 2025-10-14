import { NextResponse } from "next/server";
import {prisma} from "src/lib/prisma";
import { authorizeSalespersonForInventory } from "src/lib/authorizeDistributor";

type Params = { inventoryId: string };

export async function GET(_: Request, { params }: { params: Params }) {
  const inventoryId = Number(params.inventoryId);
  if (Number.isNaN(inventoryId)) return NextResponse.json({ error: "Invalid inventoryId" }, { status: 400 });

  const products = await prisma.product.findMany({
    where: { inventoryId },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request, { params }: { params: Params }) {
  const inventoryId = Number(params.inventoryId);
  if (Number.isNaN(inventoryId)) return NextResponse.json({ error: "Invalid inventoryId" }, { status: 400 });

  // autorizacion: solo salespersons + inventory tipo Distributor
  const authRes = await authorizeSalespersonForInventory(inventoryId);
  if (!authRes.ok) return NextResponse.json({ error: authRes.message }, { status: authRes.status });

  const body = await req.json();
  const { title, description = "", category = "", price = 0, available = true } = body ?? {};

  if (!title || typeof title !== "string") return NextResponse.json({ error: "title required" }, { status: 400 });

  const product = await prisma.product.create({
    data: {
      title,
      description,
      category,
      price: Number(price),
      available: Boolean(available),
      inventory: { connect: { id: inventoryId } },
    },
  });

  return NextResponse.json(product, { status: 201 });
}
