"use client";

import AppLayout from "@/components/AppLayout";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface IntelligenceClientProps {
  userType: UserType;
  userName: string;
}

export default function IntelligenceClient({
  userType,
  userName,
}: IntelligenceClientProps) {
  return (
    <AppLayout
      userType={userType}
      userName={userName}
      activeSection="intelligence"
      title="Inteligencia de Negocios"
    >
      <div className="space-y-6">
        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Ventas del Mes
            </h3>
            <p className="text-2xl font-bold text-green-600">$45,230</p>
            <p className="text-sm text-gray-500">+12% vs mes anterior</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Productos Más Vendidos
            </h3>
            <p className="text-2xl font-bold text-blue-600">156</p>
            <p className="text-sm text-gray-500">unidades vendidas</p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Clientes Activos
            </h3>
            <p className="text-2xl font-bold text-purple-600">89</p>
            <p className="text-sm text-gray-500">este mes</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Tendencia de Ventas
            </h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Gráfico de ventas por implementar</p>
            </div>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Distribución de Productos
            </h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">
                Gráfico de distribución por implementar
              </p>
            </div>
          </div>
        </div>

        {/* Insights Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Insights y Recomendaciones
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Recomendación:</strong> Los productos de la categoría
                "Electrónicos" tienen una demanda alta. Considera aumentar el
                stock.
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-800">
                <strong>Insight:</strong> Las ventas aumentan un 23% los fines
                de semana. Programa promociones especiales.
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Alerta:</strong> El inventario de "Productos de
                Limpieza" está bajo. Reabastece pronto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
