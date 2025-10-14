import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import ProcessOrderClient from "./ProcessOrderClient";
import { Order } from "@/src/generated/prisma";
import { getOrderById } from "@/src/lib/services/inventoryManagerService";

type UserType = "distributor" | "salesperson" | "inventory_manager";

async function getOrder(orderId: number): Promise<Order | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderId}`, {
      cache: "no-store", // para obtener los datos más recientes
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}

export default async function ProcessOrderPage({ params }: { params: { id: string } }) {
    const session = await auth();
    const orderId = parseInt(params.id);
        
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
    const order = await getOrderById(orderId);

    return (
        <ProcessOrderClient 
        userType={userType}
        userName={user.name} 
        order={order} />
        
    );
}
