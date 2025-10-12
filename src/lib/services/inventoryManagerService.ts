import { prisma } from "@/src/lib/prisma";

export async function getProductsInStock(inventoryId: number) {
const batches = await prisma.batch.findMany({
    where: { inventoryId },
    include: { product: true },
});

const totalStock = batches.reduce((sum, b) => sum + b.quantity, 0);
return { totalStock, batches };
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

export async function getResolvedOrders(inventoryManagerId: number) {
const orders = await prisma.order.findMany({
    where: { inventoryManagerId, status: "received" },
    include: { product: true },
});
return orders;
}
