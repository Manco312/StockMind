import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import OrdersClient from "./OrdersClient";
import { getPendingOrders, getTotalReceivedOrders, getTotalAcceptedOrders, getTotalPendingOrders } 
  from "@/src/lib/services/inventoryManagerService";

type UserType = "distributor" | "salesperson" | "inventory_manager";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/accounting/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      inventoryManager: {
        include: {
          store: { include: { inventory: true } },
        },
      },
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

  // Inventory Manager Dashboard Functions
  async function getOrdersClientData() {
    if (!user) {
      redirect("/accounting/login");
    }
    
    const store = user.inventoryManager?.store;
    if (!store?.inventory?.id) return null;

    const pendingOrders = await getPendingOrders(user.id);
    const totalReceivedOrders = await getTotalReceivedOrders(user.id);
    const totalAcceptedOrders = await getTotalAcceptedOrders(user.id);
    const totalOrders = pendingOrders.length + totalReceivedOrders + totalAcceptedOrders;

    return {
      pendingOrders: pendingOrders,
      totalOrders: totalOrders,
      totalReceivedOrders: totalReceivedOrders,
      totalAcceptedOrders: totalAcceptedOrders,
      totalPendingOrders: pendingOrders.length,
    };
  }

  let ordersData = await getOrdersClientData();

  return <OrdersClient userType={userType} userName={user.name} ordersData={ordersData} />;
}
