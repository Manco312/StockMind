import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { redirect } from "next/navigation";
import CreateOrderClient from "./CreateOrderClient";

type UserType = "distributor" | "salesperson" | "inventory_manager";

export default async function CreateOrderPage() {
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
 
    // Obtener los productos ofrecidos en el inventario del encargado
    const offeredProducts = await prisma.product.findMany({
    where: {
        inventory: {
        store: {
            inventoryManager: {
            user: {
                id: user.id,
            },
            },
        },
        },
    },
    select: {
        id: true,
        title: true,
        inventoryId: true,
        description: true,
        category: true,
        price: true,
        available: true,
        minimumStock: true,
    },
    });

    if (!user.inventoryManager) {
    redirect("/orders");
    }

  return (
    <CreateOrderClient
      userType={userType}
      userName={user.name} 
      offeredProducts={offeredProducts}
      inventoryManager={user.inventoryManager}
    />
  );
}
