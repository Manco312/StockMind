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
    })
  
    if (!manager) {
      redirect("/accounting/login")
    }

  const productId = parseInt(params.id)

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      batches: true, // para mostrar en el dropdown
    },
  })

  if (!product) {
    return <div className="p-6 text-center text-red-600">Producto no encontrado</div>
  }

  return (
    <EditProductClient
      userType={userType}
      userName={user.name}
      storeName={manager.store?.name || "Mi Tienda"}
      product={{
        id: product.id,
        title: product.title,
        price: product.price,
        stock: product.stock,
        batches: product.batches.map((b) => ({
          id: b.id,
          code: b.code,
          quantity: b.quantity,
        })),
      }}
    />
  )
}
