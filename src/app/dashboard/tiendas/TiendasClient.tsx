"use client";

import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { useRouter } from "next/navigation";

type Store = {
  id: number;
  name: string;
  address: string;
  neighborhood: string;
  capital: number;
  inventory: any;
  inventoryManager: {
    user: {
      name: string;
      email: string;
    };
  } | null;
};

interface TiendasClientProps {
  stores: Store[];
}

export default function TiendasClient({ stores }: TiendasClientProps) {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p className="text-gray-600">
          Total de tiendas aliadas: <strong>{stores.length}</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={() => router.push("/dashboard/tiendas/register-manager")}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            + Registrar Encargado
          </Button>
          <Button
            onClick={() => router.push("/dashboard/tiendas/add")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            + Añadir Tienda
          </Button>
        </div>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-600 text-lg mb-4">
              No hay tiendas registradas aún
            </p>
            <Button
              onClick={() => router.push("/dashboard/tiendas/add")}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Registrar Primera Tienda
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <Card
              key={store.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {store.name}
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start">
                      <span className="mr-2">📍</span>
                      <span>{store.address}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🏘️</span>
                      <span>{store.neighborhood}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">💰</span>
                      <span>Capital: ${store.capital.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {store.inventoryManager && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">
                    Administrador de Inventario
                  </p>
                  <p className="text-sm font-medium text-gray-700">
                    {store.inventoryManager.user.name}
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center justify-between">
                <span
                  className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                    store.inventory
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {store.inventory ? "Con Inventario" : "Sin Inventario"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    router.push(`/dashboard/tiendas/${store.id}/pedidos`)
                  }
                >
                  Ver Historial
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
