import { prisma } from "@/src/lib/prisma";

export async function getProductsInStock(inventoryId: number) {
const batches = await prisma.batch.findMany({
    where: { inventoryId },
    include: { product: true },
});

const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
return { totalStock, batches };
}

export async function getOfferedProducts(inventoryId: number) {
const products = await prisma.product.findMany({
    where: { inventoryId },
});

return products;
}

export async function getTotalOfferedProducts(inventoryId: number) {
  return await prisma.product.count({
    where: { inventoryId },
  });
}

export async function getLowStockAlerts(storeId: number) {
const alerts = await prisma.alert.findMany({
    where: { storeId, resolved: false },
    include: { product: true },
});
return alerts;
}

export async function getPendingOrders(inventoryManagerId: number) {
const orders = await prisma.order.findMany({
    where: { inventoryManagerId, status: "pending" },
    include: { product: true },
});
return orders;
}

export async function getReceivedOrders(inventoryManagerId: number) {
const orders = await prisma.order.findMany({
    where: { inventoryManagerId, status: "received" },
    include: { product: true },
});
return orders;
}

export async function getProcessedOrders(inventoryManagerId: number) {
const orders = await prisma.order.findMany({
    where: { inventoryManagerId, status: "processed" },
    include: { product: true },
});
return orders;
}

export async function getCancelledOrders(inventoryManagerId: number) {
const orders = await prisma.order.findMany({
    where: { inventoryManagerId, status: "cancelled" },
    include: { product: true },
});
return orders;
}


export async function getTotalPendingOrders(inventoryManagerId: number) {
  return await prisma.order.count({
    where: {
      inventoryManagerId,
      status: "pending",
    },
  });
}

export async function getTotalReceivedOrders(inventoryManagerId: number) {
  return await prisma.order.count({
    where: {
      inventoryManagerId,
      status: "received",
    },
  });
}

export async function getTotalProcessedOrders(inventoryManagerId: number) {
  return await prisma.order.count({
    where: {
      inventoryManagerId,
      status: "processed",
    },
  });
}

export async function getOrderById(orderId: number) {
  return await prisma.order.findUnique({
    where: { id: orderId },
    include: { 
      product: true, 
      inventoryManager: {
        include: { store: true },
      },
    },
  });
}


