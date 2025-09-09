import { PrismaClient } from "../src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
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
              address: "Calle 123",
              neighborhood: "Centro",
              capital: 1000000
            }
          }
        }
      }
    },
    include: { inventoryManager: { include: { store: true } } }
  });

  const storeInventory = await prisma.inventory.create({
    data: {
        type: "Store",
        storeId: inventoryManagerUser.inventoryManager!.store.id
    }
  });

  const salespersonUser = await prisma.user.create({
    data: {
      name: "Ana Sales",
      phone: "3002223344",
      email: "ana@sales.com",
      password: hashedPassword,
      salesperson: {
        create: {}
      }
    },
    include: { salesperson: true }
  });

  // 2. Crear inventario de distribuidora
  const distributorInventory = await prisma.inventory.create({
    data: {
      type: "Distributor"
    }
  });

  // 3. Asociar salesperson al inventario de distribuidora
  await prisma.salesperson.update({
    where: { userId: salespersonUser.id },
    data: { inventoryId: distributorInventory.id }
  });

  // 4. Crear 10 productos "reales"
  const realProducts = [
    { title: "Arroz Diana 1kg", description: "Arroz blanco de alta calidad", category: "Alimentos", price: 5000 },
    { title: "Aceite Girasol 1L", description: "Aceite vegetal puro para cocinar", category: "Alimentos", price: 8000 },
    { title: "Leche Entera La Campiña 1L", description: "Leche pasteurizada fresca", category: "Lácteos", price: 4000 },
    { title: "Pan Bimbo 500g", description: "Pan de molde integral", category: "Panadería", price: 6000 },
    { title: "Huevos XL Docena", description: "Huevos frescos tamaño XL", category: "Alimentos", price: 12000 },
    { title: "Azúcar Blanca 1kg", description: "Azúcar refinada para repostería", category: "Alimentos", price: 3500 },
    { title: "Café Sello Rojo 250g", description: "Café molido tradicional", category: "Bebidas", price: 7000 },
    { title: "Jugo Hit 1L", description: "Jugo de frutas natural", category: "Bebidas", price: 5000 },
    { title: "Queso Paipa 200g", description: "Queso fresco típico colombiano", category: "Lácteos", price: 9000 },
    { title: "Galletas Festival 200g", description: "Galletas dulces surtidas", category: "Panadería", price: 4500 }
  ];

  const productsData = realProducts.map(p => ({ ...p, available: true, inventoryId: distributorInventory.id }));

  await prisma.product.createMany({
    data: productsData
  });

  console.log("Seed completado con productos reales ✅");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
