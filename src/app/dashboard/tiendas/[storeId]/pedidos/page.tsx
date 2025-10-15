import { auth } from "@/src/auth";
import { prisma } from "@/src/lib/prisma";
import { redirect } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import StoreOrdersClient from "./StoreOrdersClient";
import type { Order, Product } from "@/src/generated/prisma";

type UserType = "distributor" | "salesperson" | "inventory_manager";

// We define a more specific type for an order that includes the related product
export type OrderWithProduct = Order & {
  product: Product;
};

async function getStoreDetails(storeId: number) {
  return prisma.store.findUnique({
    where: { id: storeId },
  });
}

async function getInitialOrders(storeId: number): Promise<OrderWithProduct[]> {
  const orders = await prisma.order.findMany({
    where: {
      inventoryManager: {
        storeId: storeId,
      },
    },
    include: {
      product: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 20, // Fetch the first 20 orders for the initial load
  });
  // We need to cast because Prisma's generated types don't automatically include relations
  return orders as OrderWithProduct[];
}

export default async function StoreOrderHistoryPage({
  params,
}: {
  params: Promise<{ storeId: string }>;
}) {
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

  // Determine user type
  let userType: UserType = "distributor";
  if (user.inventoryManager) {
    userType = "inventory_manager";
  } else if (user.salesperson) {
    userType = "salesperson";
  }

  // Only salesperson and distributor can access this page
  if (userType === "inventory_manager") {
    redirect("/dashboard");
  }

  const resolvedParams = await params;
  const storeId = parseInt(resolvedParams.storeId, 10);
  if (isNaN(storeId)) {
    redirect("/dashboard/tiendas");
  }

  const [store, initialOrders] = await Promise.all([
    getStoreDetails(storeId),
    getInitialOrders(storeId),
  ]);

  if (!store) {
    redirect("/dashboard/tiendas");
  }

  return (
    <AppLayout
      userType={userType}
      userName={user.name}
      activeSection="tiendas"
      title={`Historial de Pedidos: ${store.name}`}
    >
      <StoreOrdersClient initialOrders={initialOrders} storeId={storeId} />
    </AppLayout>
  );
}
