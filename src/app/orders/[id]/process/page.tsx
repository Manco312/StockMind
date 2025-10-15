import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import ProcessOrderClient from "./ProcessOrderClient";
import { getOrderById } from "@/src/lib/services/inventoryManagerService";

type UserType = "distributor" | "salesperson" | "inventory_manager";

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

    if(!order) {
        throw new Error("Pedido no hayado");
    }

    return (
        <ProcessOrderClient 
        userType={userType}
        userName={user.name} 
        order={order} />

    );
}
