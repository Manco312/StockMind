import { PrismaClient } from "../src/generated/prisma/index.js";

import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed con stock mínimo y relaciones correctas...");

  // Limpiar datos existentes
  await prisma.notification.deleteMany();
  await prisma.alert.deleteMany();
  await prisma.productUpdate.deleteMany();
  await prisma.order.deleteMany();
  await prisma.batch.deleteMany();
  await prisma.product.deleteMany();
  await prisma.inventoryManager.deleteMany();
  await prisma.salesperson.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.store.deleteMany();
  await prisma.user.deleteMany();


  // 1. Crear usuarios
  const hashedPassword = await bcrypt.hash("123456", 10);

  const inventoryManagerUser = await prisma.user.create({
    data: {
      name: "Carlos Manager",
      phone: "3001112233",
      email: "manager@esperanza.com",
      password: hashedPassword,
      inventoryManager: {
        create: {
          store: {
            create: {
              name: "Tienda Esperanza",
              address: "Calle 123 #45-67",
              neighborhood: "Centro",
              capital: 2500000,
            },
          },
        },
      },
    },
    include: { inventoryManager: { include: { store: true } } },
  });

  const storeInventory = await prisma.inventory.create({
    data: {
      type: "Store",
      storeId: inventoryManagerUser.inventoryManager!.store.id,
    },
  });

  const salespersonUser = await prisma.user.create({
    data: {
      name: "Ana Sales",
      phone: "3002223344",
      email: "ana@sales.com",
      password: hashedPassword,
      salesperson: {
        create: {},
      },
    },
    include: { salesperson: true },
  });

  // 2. Crear inventario de distribuidora
  const distributorInventory = await prisma.inventory.create({
    data: {
      type: "Distributor",
    },
  });

  // 3. Asociar salesperson al inventario de distribuidora
  await prisma.salesperson.update({
    where: { userId: salespersonUser.id },
    data: { inventoryId: distributorInventory.id },
  });

  // 4. Crear productos base
  const realProducts = [
    { title: "Arroz Diana 1kg", description: "Arroz blanco de alta calidad", category: "Alimentos", price: 5000 },
    { title: "Aceite Girasol 1L", description: "Aceite vegetal puro para cocinar", category: "Alimentos", price: 8000 },
    { title: "Azúcar Blanca 1kg", description: "Azúcar refinada para repostería", category: "Alimentos", price: 3500 },
    { title: "Huevos XL Docena", description: "Huevos frescos tamaño XL", category: "Alimentos", price: 12000 },
    { title: "Papa Pastusa 2kg", description: "Papa fresca para cocinar", category: "Alimentos", price: 6000 },
    { title: "Leche Entera La Campiña 1L", description: "Leche pasteurizada fresca", category: "Lácteos", price: 4000 },
    { title: "Queso Paipa 200g", description: "Queso fresco típico colombiano", category: "Lácteos", price: 9000 },
    { title: "Yogurt Griego 150g", description: "Yogurt natural sin azúcar", category: "Lácteos", price: 3500 },
    { title: "Mantequilla 250g", description: "Mantequilla sin sal", category: "Lácteos", price: 5500 },
    { title: "Café Sello Rojo 250g", description: "Café molido tradicional", category: "Bebidas", price: 7000 },
    { title: "Jugo Hit 1L", description: "Jugo de frutas natural", category: "Bebidas", price: 5000 },
    { title: "Agua Cristal 600ml", description: "Agua natural", category: "Bebidas", price: 2000 },
    { title: "Gaseosa Coca Cola 2L", description: "Bebida gaseosa", category: "Bebidas", price: 8000 },
    { title: "Pan Bimbo 500g", description: "Pan de molde integral", category: "Panadería", price: 6000 },
    { title: "Galletas Festival 200g", description: "Galletas dulces surtidas", category: "Panadería", price: 4500 },
    { title: "Tostadas 200g", description: "Tostadas de pan integral", category: "Panadería", price: 4000 },
    { title: "Detergente Ariel 1kg", description: "Detergente en polvo", category: "Limpieza", price: 12000 },
    { title: "Jabón Dove 90g", description: "Jabón de tocador", category: "Limpieza", price: 3500 },
    { title: "Papel Higiénico 4 rollos", description: "Papel higiénico suave", category: "Limpieza", price: 8000 },
    { title: "Cloro 1L", description: "Cloro para desinfección", category: "Limpieza", price: 3000 },
  ];

  // 5. Crear productos en la distribuidora
  const distributorProducts = await Promise.all(
    realProducts.map((product) =>
      prisma.product.create({
        data: {
          ...product,
          available: true,
          minimumStock: Math.floor(Math.random() * 11) + 10, // 10–20
          inventoryId: distributorInventory.id,
        },
      })
    )
  );

  // 6. Crear productos en la tienda con relación al producto de la distribuidora
  const storeProducts = await Promise.all(
    distributorProducts.slice(0, 12).map((product) =>
      prisma.product.create({
        data: {
          title: product.title,
          description: product.description,
          category: product.category,
          price: product.price,
          available: Math.random() > 0.2,
          inventoryId: storeInventory.id,
          minimumStock: Math.floor(Math.random() * 11) + 10,
          distributorProductId: product.id, // ✅ relación correcta
        },
      })
    )
  );


  // 7. Crear lotes correctamente relacionados
  const batches = await Promise.all(
    distributorProducts.slice(0, 10).map((product) =>
      prisma.batch.create({
        data: {
          code: `BATCH-${product.id}-${Date.now()}`,
          quantity: Math.floor(Math.random() * 100) + 100,
          expirationDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
          location: "Bodega Central",
          productId: product.id,
          inventoryId: distributorInventory.id,
        },
      })
    )
  );

  // 7.1. Crear un batch inicial para cada producto de la tienda
  await Promise.all(
    storeProducts.slice(0, 10).map((product) =>
      prisma.batch.create({
        data: {
          code: `BATCH-${product.id}-${Date.now()}`,
          quantity: Math.floor(Math.random() * 41) + 10, // entre 10 y 50 unidades
          purchasePrice: Math.floor(product.price * 0.6), // precio de compra aprox. 60% del precio de venta
          expirationDate: new Date(Date.now() + Math.floor(Math.random() * 90 + 30) * 24 * 60 * 60 * 1000), // entre 1 y 4 meses
          location: `Estante ${Math.floor(Math.random() * 5) + 1}`,
          productId: product.id,
          inventoryId: storeInventory.id,
        },
      })
    )
  );


  // 8. Crear pedidos realistas con fechas variadas
  const orders = [];

  // Pedidos recientes (últimos 30 días) - alta actividad
  for (let i = 0; i < 25; i++) {
    const product =
      distributorProducts[
        Math.floor(Math.random() * distributorProducts.length)
      ];
    const quantity = Math.floor(Math.random() * 10) + 1;
    const price = product.price * quantity;

    orders.push({
      status: Math.random() > 0.1 ? "received" : "pending", // 90% recibidos
      quantity,
      price,
      inventoryManagerId: inventoryManagerUser.id,
      salespersonId: salespersonUser.id,
      productId: product.id,
      sentBatchId:
        Math.random() > 0.3
          ? batches[Math.floor(Math.random() * batches.length)].id
          : null,
    });
  }

  // Pedidos del mes anterior (30-60 días atrás) - actividad media
  for (let i = 0; i < 15; i++) {
    const product =
      distributorProducts[
        Math.floor(Math.random() * distributorProducts.length)
      ];
    const quantity = Math.floor(Math.random() * 8) + 1;
    const price = product.price * quantity;

    orders.push({
      status: "received",
      quantity,
      price,
      inventoryManagerId: inventoryManagerUser.id,
      salespersonId: salespersonUser.id,
      productId: product.id,
      sentBatchId:
        Math.random() > 0.4
          ? batches[Math.floor(Math.random() * batches.length)].id
          : null,
    });
  }

  // Pedidos más antiguos (60-90 días atrás) - actividad baja
  for (let i = 0; i < 10; i++) {
    const product =
      distributorProducts[
        Math.floor(Math.random() * distributorProducts.length)
      ];
    const quantity = Math.floor(Math.random() * 5) + 1;
    const price = product.price * quantity;

    orders.push({
      status: "received",
      quantity,
      price,
      inventoryManagerId: inventoryManagerUser.id,
      salespersonId: salespersonUser.id,
      productId: product.id,
      sentBatchId:
        Math.random() > 0.5
          ? batches[Math.floor(Math.random() * batches.length)].id
          : null,
    });
  }

  // Crear todos los pedidos
  await prisma.order.createMany({
    data: orders,
  });

  // 9. Calcular estadísticas para verificación
  const totalOrders = await prisma.order.count();
  const receivedOrders = await prisma.order.count({
    where: { status: "received" },
  });
  const totalSales = await prisma.order.aggregate({
    where: { status: "received" },
    _sum: { price: true },
  });

  console.log("📊 Estadísticas generadas:");
  console.log(`- Total de pedidos: ${totalOrders}`);
  console.log(`- Pedidos recibidos: ${receivedOrders}`);
  console.log(
    `- Ventas totales: $${totalSales._sum.price?.toLocaleString() || 0}`
  );
  console.log(`- Productos en distribuidora: ${distributorProducts.length}`);
  console.log(`- Productos en tienda: ${storeProducts.length}`);
  console.log(
    `- Productos agotados en tienda: ${
      storeProducts.filter((product) => !product.available).length
    }`
  );
  console.log(`- Batches creados: ${batches.length}`);

  console.log("✅ Seed completado con datos realistas para analytics!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
