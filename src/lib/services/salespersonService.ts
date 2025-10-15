import { prisma } from "@/src/lib/prisma";

export async function getRecentOrders(status: string) {
  const orders = await prisma.order.findMany({
    where: {
      status: status,
      inventoryManager: {
        store: {
          inventory: {
            type: {
              in: ["Store", "store"], 
            },
          },
        },
      },
    },
    include: {
      product: true,
      inventoryManager: {
        include: {
          store: true,
        },
      },
      salesperson: {
        include: {
          user: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
}

export async function getStores() {
  const stores = await prisma.store.findMany({
    where: {
      inventory: {
        type: {
          in: ["Store", "store"],
        },
      },
    },
    include: {
      inventory: true,
      inventoryManager: {
        include: {
          user: true,
        },
      },
    },
  });

  return stores;
}

export async function getTotalStores() {
    const count = await prisma.store.count({
    where: {
        inventory: {
        type: {
            in: ["store", "Store"],
        },
        },
    },
    });
    
    return count
}

export async function getAvailableProducts(distributorInventoryId: number) {

  const products = await prisma.product.findMany({
    where: { inventoryId: distributorInventoryId },
    orderBy: { id: "desc" },
  });

  return products;
}

export async function getMonthlyRevenueForDistributor() {
// TODO: Implementar
return 875000;
}