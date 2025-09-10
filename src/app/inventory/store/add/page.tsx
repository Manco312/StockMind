import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import AddProductClient from "./AddProductClient";

type UserType = "distributor" | "salesperson" | "inventory_manager";

export default async function AddProductPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/accounting/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      inventoryManager: true,
      salesperson: true,
    },
  });

  if (!user) {
    redirect("/accounting/login");
  }

  let userType: UserType = "inventory_manager";
  if (user.inventoryManager) {
    userType = "inventory_manager";
  } else if (user.salesperson) {
    userType = "salesperson";
  } else {
    userType = "distributor";
  }

  const manager = await prisma.inventoryManager.findUnique({
    where: { userId: user.id },
    include: { store: { include: { inventory: true } } },
  });

  if (!manager) {
    redirect("/accounting/login");
  }

  const distributorProducts = await prisma.product.findMany({
    where: { inventory: { type: "Distributor" }, available: true },
    select: { id: true, title: true, price: true, description: true },
  });

  return (
    <AddProductClient
      userType={userType}
      userName={user.name}
      products={distributorProducts}
    />
  );
}
