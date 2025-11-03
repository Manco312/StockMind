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
 
    const offeredProducts = await prisma.product.findMany({
      where: {
        inventory: {
          store: {
            inventoryManager: {
              user: { id: user.id },
            },
          },
        },
      },
      select: {
        id: true,
        inventoryId: true,
        available: true,
        title: true,
        distributorProduct: {
          select: {
            price: true,
          },
        },
      },
    });

    const formatted = offeredProducts.map((p) => ({
      id: p.id,
      inventoryId: p.inventoryId,
      available: p.available,
      title: p.title,
      price: p.distributorProduct?.price ?? 0,
    }));

    if (!user.inventoryManager) {
    redirect("/orders");
    }

  return (
    <CreateOrderClient
      userType={userType}
      userName={user.name} 
      offeredProducts={formatted}
      inventoryManager={user.inventoryManager}
    />
  );
}
