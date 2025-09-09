import { PrismaClient } from "src/generated/prisma";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Crear usuarios base
  const passwordHash = await bcrypt.hash("123456", 10);

  const inventoryManagerUser = await prisma.user.create({
    data: {
      name: "Carlos Manager",
      phone: "3001112233",
      email: "manager@esperanza.com",
      password: passwordHash,
      inventoryManager: {
        create: {
          store: {
            create: {
              name: "Tienda La Esperanza",
              address: "Calle 123 #45-67",
              neighborhood: "Centro",
              capital: 5000000,
              inventory: {
                create: { type: "Store" },
              },
            },
          },
        },
      },
    },
    include: {
      inventoryManager: {
        include: {
          store: { include: { inventory: true } },
        },
      },
    },
  });

  const salespersonUser = await prisma.user.create({
    data: {
      name: "Laura Vendedora",
      phone: "3012223344",
      email: "sales@distcolombia.com",
      password: passwordHash,
      salesperson: {
        create: {
          inventory: {
            create: {
              type: "Distributor",
            },
          },
        },
      },
    },
    include: {
      salesperson: {
        include: { inventory: true },
      },
    },
  });


  const inventory = salespersonUser.salesperson!.inventory!;

  // Lista de productos
  const productos = [
    { title: "Arroz Diana 1kg", description: "Bolsa de arroz premium", category: "Granos", price: 4500 },
    { title: "Aceite Premier 1L", description: "Aceite vegetal para cocinar", category: "Aceites", price: 12000 },
    { title: "Leche Alquería 1L", description: "Leche entera larga vida", category: "Lácteos", price: 4200 },
    { title: "Azúcar Manuelita 1kg", description: "Azúcar blanca refinada", category: "Endulzantes", price: 3800 },
    { title: "Pasta Doria 500g", description: "Spaghetti clásico", category: "Pasta", price: 2500 },
    { title: "Pan Bimbo Familiar", description: "Pan tajado blanco", category: "Panadería", price: 6500 },
    { title: "Gaseosa Coca-Cola 1.5L", description: "Bebida gaseosa", category: "Bebidas", price: 5000 },
    { title: "Café Sello Rojo 250g", description: "Café molido colombiano", category: "Café", price: 8500 },
    { title: "Sal Refisal 1kg", description: "Sal refinada", category: "Condimentos", price: 2000 },
    { title: "Huevos Kikes 30und", description: "Cubeta de huevos AA", category: "Proteína", price: 14500 },
  ];

  // Insertar productos + batches
  for (let i = 0; i < productos.length; i++) {
    const p = productos[i];
    await prisma.product.create({
      data: {
        ...p,
        inventoryId: inventory.id,
        batches: {
          create: {
            code: `BATCH-${i + 1}`,
            quantity: 100 + i * 10,
            expirationDate: new Date("2025-12-31"),
            location: "Bodega Principal",
            inventoryId: inventory.id,
          },
        },
      },
    });
  }

  console.log("✅ Usuarios, tienda, inventario y 10 productos creados!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
