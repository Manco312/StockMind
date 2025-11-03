import ProductHistoryClient from "./ProductHistoryClient";
import { prisma } from "@/src/lib/prisma"
import { auth } from "@/src/auth"
import { redirect } from "next/navigation"

type UserType = "distributor" | "salesperson" | "inventory_manager"

export default async function ProductHistoryPage({
  params,
}: {
  params: { id: string };
}) {
    const { id } = await params;
    const productId = parseInt(id);

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
            inventory: true,
        },
        },
    },
    });
    
    if (!manager) {
        redirect("/accounting/login")
    }

  const updates = await prisma.productUpdate.findMany({
    where: { productId },
    orderBy: { date: "desc" },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId, inventoryId: manager.store.inventory?.id },
  })

  if (!product) {
    return <div className="p-6 text-center text-red-600">Producto no encontrado</div>
  }

  return (
    <ProductHistoryClient
      updates={updates}
      productTitle={product.title}
      userType={userType}
      userName={user.name}
    />
  );
}
