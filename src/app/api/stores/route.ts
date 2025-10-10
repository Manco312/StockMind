import { prisma } from "@/src/lib/prisma"
import { auth } from "@/src/auth"
import { NextResponse } from "next/server"

// GET - Fetch all stores
export async function GET() {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      salesperson: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  // Check if user is salesperson or distributor (users without specific roles are distributors)
  const isSalespersonOrDistributor = user.salesperson

  if (!isSalespersonOrDistributor) {
    return NextResponse.json({ error: "No tienes permisos para ver tiendas" }, { status: 403 })
  }

  const stores = await prisma.store.findMany({
    orderBy: { id: "desc" },
    include: {
      inventory: true,
      inventoryManager: {
        include: {
          user: true,
        },
      },
    },
  })

  return NextResponse.json({ stores })
}

// POST - Create a new store
export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      salesperson: true,
      inventoryManager: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
  }

  // Only distributors (users without specific roles) can create stores
  // Salesperson can also create stores based on requirements
  const isDistributorOrSalesperson = !user.inventoryManager

  if (!isDistributorOrSalesperson) {
    return NextResponse.json({ error: "Solo los preventistas pueden registrar tiendas" }, { status: 403 })
  }

  const body = await req.json()
  const { name, address, neighborhood, capital } = body

  // Validate required fields
  if (!name || !address || !neighborhood || capital === undefined) {
    return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 })
  }

  const result = await prisma.$transaction(async (tx) => {
    // Create the store
    const store = await tx.store.create({
      data: {
        name,
        address,
        neighborhood,
        capital: Number.parseInt(capital),
      },
    })

    // Create inventory for the store
    const inventory = await tx.inventory.create({
      data: {
        type: "store",
        storeId: store.id,
      },
    })

    return { store, inventory }
  })

  return NextResponse.json({
    success: true,
    store: result.store,
    inventory: result.inventory,
  })
}
