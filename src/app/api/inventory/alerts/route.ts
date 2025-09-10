import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import { auth } from '@/src/auth';

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user)
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });

  const manager = await prisma.inventoryManager.findUnique({
    where: { userId: user.id },
    include: { store: { include: { inventory: true } } },
  });
  if (!manager)
    return NextResponse.json({ error: "No eres un Inventory Manager" }, { status: 403 });

  const storeInventoryId = manager.store?.inventory?.id;
  if (!storeInventoryId)
    return NextResponse.json({ error: "Inventario de la tienda no encontrado" }, { status: 404 });

  try {
    // 1️⃣ Obtener los lotes con cantidad menor a 10
    const lowStockBatches = await prisma.batch.findMany({
      where: {
        inventoryId: storeInventoryId,
        quantity: { lt: 31 },
      },
      include: {
        product: { select: { title: true } },
      },
    });

    // 2️⃣ Generar estructura de alertas (JSON en memoria)
    const alerts = lowStockBatches.map(batch => ({
      alertId: `alert-${batch.id}`,
      batchId: batch.id,
      productName: batch.product.title,
      quantity: batch.quantity,
      type: 'LOW_STOCK',
      message: `⚠️ Low stock for ${batch.product.title}. Only ${batch.quantity} left.`,
    }));

    // 3️⃣ Responder con JSON (no se guarda en BD, solo se construye aquí)
    return NextResponse.json({ alerts });
  } catch (error) {
    console.error('Error fetching low stock alerts:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching low stock alerts.' },
      { status: 500 }
    );
  }
}
