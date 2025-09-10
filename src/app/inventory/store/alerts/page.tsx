import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import ShowAlertClient from "./ShowAlertClient";

type UserType = "distributor" | "salesperson" | "inventory_manager";

export default async function AlertsPage() {
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

  return (
    <ShowAlertClient 
      userType={userType}
      userName={user.name}
      />
  );
}
