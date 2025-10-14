import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import ManageOrdersClient from "./ManageOrdersClient";
import { getPendingOrders, getReceivedOrders, getProcessedOrders, getCancelledOrders } 
  from "@/src/lib/services/inventoryManagerService";

type UserType = "distributor" | "salesperson" | "inventory_manager";

export default async function ManageOrdersPage() {
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

  const pendingOrders = await getPendingOrders(user.id);
  const receivedOrders = await getReceivedOrders(user.id);
  const processedOrders = await getProcessedOrders(user.id);
  const cancelledOrders = await getCancelledOrders(user.id);
  const orders = [...pendingOrders, ...receivedOrders, ...processedOrders, ...cancelledOrders];

  return (
    <ManageOrdersClient 
        userType={userType}
        userName={user.name} 
        orders={orders} 
    />
  );
}
