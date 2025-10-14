import { PrismaClient } from "@prisma/client";
import { auth } from "src/auth";

const prisma = new PrismaClient();

export async function authorizeSalespersonForInventory(inventoryId: number) {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, status: 401, message: "Unauthorized" };

  const userId = Number(session.user.id);
  const salesperson = await prisma.salesperson.findUnique({ where: { userId } });
  if (!salesperson) return { ok: false, status: 403, message: "Forbidden: not a salesperson" };

  const inventory = await prisma.inventory.findUnique({ where: { id: inventoryId } });
  if (!inventory || inventory.type !== "Distributor") {
    return { ok: false, status: 400, message: "Invalid inventory" };
  }

  return { ok: true, salesperson, inventory, userId };
}
