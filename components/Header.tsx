"use client";

import { useState, useEffect, useRef } from "react";
import { Notification } from "@/src/generated/prisma";
import { useRouter } from "next/navigation";
import { notificationTypeMap } from "@/src/lib/services/notificationUtils";

interface HeaderProps {
  userType: "distributor" | "salesperson" | "inventory_manager";
  userName?: string;
  notifications: Notification[];
}

export default function Header({ userType, userName, notifications }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close notification menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirect from notification 
  const handleNotificationClick = (n: Notification) => {
    const mapped = notificationTypeMap[n.type];
    if (mapped) {
      const url = mapped.getUrl(n);
      setIsOpen(false);
      router.push(url);

      try {
        fetch(`/api/notifications/${n.id}/mark-read`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        })
    } catch (error) {
      console.error("Error marcando notificación como leída:", error);
    }
    }
  };
 

  const getHeaderTitle = () => {
    switch (userType) {
      case "inventory_manager":
        return "Home Encargado de Inventario";
      case "salesperson":
        return "Home Preventista";
      case "distributor":
        return "Home Distribuidor";
      default:
        return "Home";
    }
  };

  const getSearchPlaceholder = () => {
    switch (userType) {
      case "inventory_manager":
        return "Buscar producto";
      case "salesperson":
      case "distributor":
        return "Buscar tienda";
      default:
        return "Buscar";
    }
  };

  return (
    <header className="bg-gray-100 border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <h1 className="text-sm sm:text-lg font-semibold text-gray-800 truncate">
            {getHeaderTitle()}
          </h1>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-2 sm:mx-8 hidden sm:block">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Right side - Icons */}
        <div className="flex items-center space-x-4">


          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <div className="text-gray-600 text-xs font-semibold truncate">
              Pedidos
            </div>
            {/* Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
              title="Notificaciones"
              aria-label="Ver notificaciones"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 25 25"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0a3 3 0 11-6 0h6z"
                />
              </svg>

              {notifications.length > 0 && (
                <span className="absolute top-0 right--5 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                  {notifications.length}
                </span>
              )}
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-2 border-b font-semibold text-gray-700">
                  Notificaciones
                </div>
                {notifications.length === 0 ? (
                  <div className="p-4 text-sm text-gray-500 text-center">
                    No hay notificaciones
                  </div>
                ) : (
                  <ul className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => {
                      const mapped = notificationTypeMap[n.type];
                      const extraMsg = mapped ? mapped.message : n.message;
                      const msg = n.message;

                      return (
                        <li
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`p-3 text-sm cursor-pointer hover:bg-gray-100 transition ${
                            n.read ? "text-gray-500" : "text-gray-800 font-medium"
                          }`}
                        >
                          <div className="flex justify-between">
                            <span>{n.title}</span>
                            <span className="text-xs text-gray-400">
                              {n.createdAt
                                ? new Date(n.createdAt).toLocaleDateString("es-CO", {
                                    day: "2-digit",
                                    month: "short",
                                  })
                                : ""}
                            </span>
                          </div>
                          <p className="text-gray-600 text-xs truncate">{msg}</p>
                          {extraMsg && <p className="text-blue-400 text-xs truncate">{extraMsg}</p>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Settings */}
          <button
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            title="Configuración"
            aria-label="Abrir configuración"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </button>

          {/* User Profile */}
          <button
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            title="Perfil de usuario"
            aria-label="Abrir perfil de usuario"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
