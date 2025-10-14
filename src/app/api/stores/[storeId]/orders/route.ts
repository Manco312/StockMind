import { NextResponse } from "next/server";
import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  // 1. Authenticate and authorize
  const session = await auth();
  const userEmail = session?.user?.email;
  if (!userEmail) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    include: { salesperson: true, inventoryManager: true },
  });

  // Only salespeople or distributors can access this
  if (!user || user.inventoryManager) {
    return NextResponse.json(
      { error: "Acceso denegado. Se requiere rol de preventista o distribuidor." },
      { status: 403 }
    );
  }

  // 2. Get storeId and query parameters
  const storeId = parseInt(params.storeId, 10);
  if (isNaN(storeId)) {
    return NextResponse.json({ error: "ID de tienda inválido" }, { status: 400 });
  }

  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("q");
  const dateFrom = searchParams.get("from");
  const dateTo = searchParams.get("to");

  // 3. Build Prisma query
  const whereClause: any = {
    inventoryManager: {
      storeId: storeId,
    },
  };

  if (searchQuery) {
    whereClause.product = {
      title: { contains: searchQuery, mode: "insensitive" }
    };
  }

  if (dateFrom) {
    const fromDate = new Date(dateFrom);
    whereClause.createdAt = { ...whereClause.createdAt, gte: fromDate };
  }

  if (dateTo) {
    const toDate = new Date(dateTo);
    toDate.setDate(toDate.getDate() + 1); // Include the entire end day
    whereClause.createdAt = { ...whereClause.createdAt, lte: toDate };
  }

  try {
    // 4. Fetch orders from DB
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        product: true, // Include product details
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    return NextResponse.json(
      { error: "Ocurrió un error en el servidor al buscar el historial." },
      { status: 500 }
    );
  }
}
