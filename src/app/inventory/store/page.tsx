import { prisma } from "@/src/lib/prisma"
import { auth } from "@/src/auth"
import { redirect } from "next/navigation"
import InventoryStoreClient from "./InventoryStoreClient"

type UserType = "distributor" | "salesperson" | "inventory_manager"

export default async function InventoryStorePage() {
  const session = await auth()
  if (!session?.user?.email) {
    redirect("/accounting/login")
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      inventoryManager: true,
      salesperson: true,
    },
  })

  if (!user) {
    redirect("/accounting/login")
  }

  let userType: UserType = "inventory_manager"
  if (user.inventoryManager) {
    userType = "inventory_manager"
  } else if (user.salesperson) {
    userType = "salesperson"
  } else {
    userType = "distributor"
  }

  const manager = await prisma.inventoryManager.findUnique({
    where: { userId: user.id },
    include: {
      store: {
        include: {
          inventory: {
            include: {
              offeredProducts: {
                include: {
                  batches: {
                    where: {
                      expired: false, // Only include non-expired batches
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })

  if (!manager) {
    redirect("/accounting/login")
  }

  const productsWithStock = (manager.store?.inventory?.offeredProducts || []).map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    available: product.available,
    stock: product.batches.reduce((total, batch) => total + batch.quantity, 0),
    minStock: product.minimumStock,
  }))

  return (
    <InventoryStoreClient
      userType={userType}
      userName={user.name}
      storeName={manager.store?.name || "Mi Tienda"}
      products={productsWithStock}
    />
  )
}
