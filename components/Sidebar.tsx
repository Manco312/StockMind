"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarProps {
  userType: "distributor" | "salesperson" | "inventory_manager";
  activeSection?: string;
}

export default function Sidebar({
  userType,
  activeSection = "inicio",
}: SidebarProps) {
  const router = useRouter();

  const getNavigationItems = () => {
    switch (userType) {
      case "inventory_manager":
        return [
          { id: "inicio", label: "Inicio", icon: "🏠" },
          { id: "productos", label: "Productos", icon: "📦" },
          { id: "pedidos", label: "Pedidos", icon: "📋" },
          { id: "estadisticas", label: "Estadísticas", icon: "📊" },
        ];
      case "salesperson":
      case "distributor":
        return [
          { id: "inicio", label: "Inicio", icon: "🏠" },
          { id: "productos", label: "Productos", icon: "📦" },
          { id: "tiendas", label: "Tiendas", icon: "🏪" },
          { id: "estadisticas", label: "Estadísticas", icon: "📊" },
        ];
      default:
        return [];
    }
  };

  const handleNavigation = (section: string) => {
    switch (section) {
      case "inicio":
        router.push("/dashboard");
        break;
      case "productos":
        if (userType === "inventory_manager") {
          router.push("/inventory/store");
        } else {
          router.push("/dashboard/productos");
        }
        break;
      case "pedidos":
        router.push("/orders");
        break;
      case "tiendas":
        router.push("/dashboard/tiendas");
        break;
      case "estadisticas":
        router.push("/intelligence");
        break;
      default:
        console.log(`Navegando a: ${section}`);
    }
  };

  const handleAddStore = () => {
    if (userType === "salesperson" || userType === "distributor") {
      router.push("/dashboard/tiendas/add");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="w-64 bg-slate-800 text-white h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold">StockMind</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {getNavigationItems().map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Action Buttons */}
      <div className="p-4 border-t border-slate-700 space-y-3">
        {userType === "inventory_manager" && (
          <button
            onClick={() => router.push("/inventory/store/add")}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Agregar Productos
          </button>
        )}
        {(userType === "salesperson" || userType === "distributor") && (
          <button
            onClick={handleAddStore}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            Añadir Tienda
          </button>
        )}
        <button
          onClick={handleLogout}
          className="w-full text-slate-300 hover:text-white py-2 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
