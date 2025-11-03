import EditProductClient from "./EditProductClient"
import { prisma } from "@/src/lib/prisma"
import { auth } from "@/src/auth"
import { redirect } from "next/navigation"

interface PageProps {
  params: { id: string }
}

type UserType = "distributor" | "salesperson" | "inventory_manager"

export default async function EditProductPage({ params }: PageProps) {
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

  const productId = parseInt(params.id)

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
        batches: true,
        inventory: {
        include: {
            store: {
            include: { inventory: true },
            },
        },
        },
    },
    })

    if (!product) {
    throw new Error("Producto no encontrado")
    }

    // Calcular el stock total sumando las cantidades de los lotes
    const productWithStock = {
    ...product,
    stock: product.batches.reduce((total, batch) => total + batch.quantity, 0),
    minStock: product.minimumStock,
    }

  return (
    <EditProductClient
      userType={userType}
      userName={user.name}
      storeName={manager.store?.name || "Mi Tienda"}
      product={{
        id: productWithStock.id,
        title: productWithStock.title,
        price: productWithStock.price,
        stock: productWithStock.stock,
        minimumStock: productWithStock.minStock,
        batches: productWithStock.batches.map((b) => ({
          id: b.id,
          code: b.code,
          quantity: b.quantity,
        })),
      }}
    />
  )
}
