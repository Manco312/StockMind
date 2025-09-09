import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import AddProductForm from "@/components/AddProductForm";

export default async function AddProductPage() {
  const session = await auth();
  if (!session?.user?.email) return <p className="p-4 text-red-500">No autorizado</p>;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return <p className="p-4 text-red-500">Usuario no encontrado</p>;

  const manager = await prisma.inventoryManager.findUnique({
    where: { userId: user.id },
    include: { store: { include: { inventory: true } } },
  });
  if (!manager) return <p className="p-4 text-red-500">No eres un Inventory Manager</p>;

  const distributorProducts = await prisma.product.findMany({
    where: { inventory: { type: "Distributor" }, available: true },
    select: { id: true, title: true, price: true },
  });

  return <AddProductForm products={distributorProducts} />;
}
