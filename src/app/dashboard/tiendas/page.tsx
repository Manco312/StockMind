import { auth } from "@/src/auth"
import { prisma } from "@/src/lib/prisma"
import { redirect } from "next/navigation"
import AppLayout from "@/components/AppLayout"
import TiendasClient from "./TiendasClient"

export default async function TiendasPage() {
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

  // Determine user type
  let userType: "distributor" | "salesperson" | "inventory_manager" = "distributor"
  if (user.inventoryManager) {
    userType = "inventory_manager"
  } else if (user.salesperson) {
    userType = "salesperson"
  }

  // Only salesperson and distributor can access this page
  if (userType === "inventory_manager") {
    redirect("/dashboard")
  }

  // Fetch all stores
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

  return (
    <AppLayout userType={userType} userName={user.name} activeSection="tiendas" title="Tiendas Aliadas">
      <TiendasClient stores={stores} />
    </AppLayout>
  )
}
