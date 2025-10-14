import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";

export async function authorizeSalespersonForInventory(inventoryId: number) {
  try {
    const session = await auth();
    console.log("[AUTH] session.user:", session?.user ?? null);

    if (!session?.user?.id) {
      return { ok: false, message: "Unauthorized: no session", status: 401 };
    }

    const userId = Number(session.user.id);
    if (Number.isNaN(userId)) {
      console.log("[AUTH] session user id no convertible a number:", session.user.id);
      return { ok: false, message: "Unauthorized: invalid user id", status: 401 };
    }
    console.log("[AUTH] userId (number):", userId);

    const salesperson = await prisma.salesperson.findUnique({
      where: { userId },
    });
    console.log("[AUTH] salesperson row:", salesperson);

    if (!salesperson) {
      return { ok: false, message: "Salesperson not found", status: 403 };
    }

    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });
    console.log("[AUTH] inventory row:", inventory);

    if (!inventory) {
      return { ok: false, message: "Inventory not found", status: 404 };
    }

    // comparación case-insensitive del tipo
    const invType = (inventory.type ?? "").toString().trim().toLowerCase();
    if (invType !== "distributor" && invType !== "distribuidor") {
      console.log("[AUTH] invalid inventory type:", inventory.type);
      return { ok: false, message: "Invalid inventory", status: 403 };
    }

    // Permitir si salesperson.inventoryId es null (admin global) o coincide con inventoryId
    if (salesperson.inventoryId && salesperson.inventoryId !== inventoryId) {
      console.log(
        `[AUTH] salesperson.inventoryId (${salesperson.inventoryId}) !== inventoryId (${inventoryId})`
      );
      return { ok: false, message: "No permission for this inventory", status: 403 };
    }

    // todo ok
    return { ok: true, salesperson, inventory, userId };
  } catch (err) {
    console.error("[AUTH] error en authorizeSalespersonForInventory:", err);
    return { ok: false, message: "Internal auth error", status: 500 };
  }
}
