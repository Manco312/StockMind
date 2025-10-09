import { auth } from "@/src/auth"
import { prisma } from "@/src/lib/prisma"
import { redirect } from "next/navigation"
import AppLayout from "@/components/AppLayout"
import AddStoreForm from "./AddStoreForm"

export default async function AddStorePage() {
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

  // Only distributor and salesperson can access this page
  if (userType === "inventory_manager") {
    redirect("/dashboard")
  }

  return (
    <AppLayout userType={userType} userName={user.name} activeSection="tiendas" title="Registrar Nueva Tienda">
      <AddStoreForm />
    </AppLayout>
  )
}
