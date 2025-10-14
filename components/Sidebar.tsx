"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface SidebarProps {
  userType: "distributor" | "salesperson" | "inventory_manager";
  activeSection?: string;
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
}

export default function Sidebar({
  userType,
  activeSection = "inicio",
  isOpen: externalIsOpen,
  setIsOpen: externalSetIsOpen,
}: SidebarProps) {
  const router = useRouter();
  const [internalIsOpen, setInternalIsOpen] = useState(false);

  // Use external state if provided, otherwise use internal state
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const setIsOpen = externalSetIsOpen || setInternalIsOpen;

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
          router.push("/inventory/distributor");
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
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-3 left-3 z-50 bg-slate-800 text-white p-2 rounded-md shadow-lg"
        title="Abrir menú"
        aria-label="Abrir menú de navegación"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 bg-slate-800 text-white h-full flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold">StockMind</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
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
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-700 space-y-3 flex-shrink-0">
          {userType === "inventory_manager" && (
            <button
              onClick={() => router.push("/inventory/store/add")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors truncate"
            >
              Agregar Productos
            </button>
          )}
          {(userType === "salesperson" || userType === "distributor") && (
            <button
              onClick={handleAddStore}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors truncate"
            >
              Añadir Tienda
            </button>
          )}
          <button
            onClick={handleLogout}
            className="w-full text-slate-300 hover:text-white py-2 transition-colors truncate"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
}
