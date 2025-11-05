import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import DistributorInventoryPageClient from "./DistributorInventoryPageClient";

export default async function DistributorInventoryPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  // Buscar el usuario y su relación con salesperson
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { salesperson: true },
  });

  if (!user?.salesperson) {
    console.error("Acceso denegado: el usuario no es un preventista.");
    redirect("/unauthorized");
  }

  const inventoryId = user.salesperson.inventoryId;

  if (!inventoryId) {
    console.error("El preventista no tiene inventario asignado:", user.email);
    redirect("/error");
  }

  return <DistributorInventoryPageClient inventoryId={inventoryId} />;
}
