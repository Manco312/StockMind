import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";

type UserType = "distributor" | "salesperson" | "inventory_manager";

export default async function OrdersPage() {
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

  return <OrdersClient userType={userType} userName={user.name} />;
}
