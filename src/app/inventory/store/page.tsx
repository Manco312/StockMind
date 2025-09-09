// app/inventario/page.tsx
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth";
import { ClientButton } from "@/components/ClientButton";
import { Card } from "@/components/Card";

export default async function InventoryPage() {
  const session = await auth();
  if (!session?.user?.email) return <p className="p-4 text-red-500">No autorizado</p>;

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return <p className="p-4 text-red-500">Usuario no encontrado</p>;

  const manager = await prisma.inventoryManager.findUnique({
    where: { userId: user.id },
    include: { store: { include: { inventory: { include: { offeredProducts: true } } } } },
  });
  if (!manager) return <p className="p-4 text-red-500">No eres un Inventory Manager</p>;

  const products = manager.store?.inventory?.offeredProducts || [];

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-10 text-center">
        Inventario de {manager.store?.name}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-700 bg-red-100 p-6 rounded-lg text-center w-full max-w-3xl shadow">
          No hay productos disponibles en tu tienda.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {products.map((p) => (
            <Card
              key={p.id}
              className="p-6 bg-white shadow-md hover:shadow-xl transition-all rounded-2xl flex flex-col justify-between"
            >
              <div>
                <h2 className="font-bold text-2xl text-gray-900 mb-3">{p.title}</h2>
                <p className="text-gray-700 mb-3">{p.description}</p>
                <p className="font-semibold text-indigo-600 text-lg">Precio: ${p.price}</p>
              </div>
              <p
                className={`mt-4 font-medium ${
                  p.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {p.available ? "Disponible" : "No disponible"}
              </p>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-10">
        <ClientButton />
      </div>
    </div>
  );
}
