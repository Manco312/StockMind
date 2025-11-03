"use client";

import { useRouter } from "next/navigation"
import AppLayout from "@/components/AppLayout";

type UserType = "distributor" | "salesperson" | "inventory_manager"

interface Update {
  id: number;
  type: string;
  message: string;
  date: string;
}

interface Props {
  updates: Update[];
  productTitle: string;
  userType: UserType;
  userName: string;
}

export default function ProductHistoryClient({
  updates,
  productTitle,
  userType,
  userName,
}: Props) {
  const router = useRouter()
  const getEmoji = (type: string) => {
    switch (type) {
      case "stock_update":
        return "🔴"; // stock disminuyó
      case "stock_add":
        return "🟢"; // stock aumentó
      case "price_update":
        return "💰"; 
      default:
        return "ℹ️";
    }
  };

  const getStyle = (type: string) => {
    switch (type) {
      case "stock_update":
        return "bg-red-50 border-red-200";
      case "stock_add":
        return "bg-green-100 border-green-300";
      case "price_update":
        return "bg-yellow-50 border-yellow-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getTytle = (type: string) => {
    switch (type) {
      case "stock_update":
        return "Disminución de stock";
      case "stock_add":
        return "Aumento de stock";
      case "price_update":
        return "Actualización de precio";
      default:
        return "Historial";
    }
  };

  const handleBack = () => {
    router.back()
  }

  return (
    <AppLayout userType={userType} userName={userName} activeSection="inventory">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Historial de actualizaciones de {productTitle}</h1>
          <button onClick={handleBack} className="text-sm text-blue-600 hover:underline">
            ← Volver a productos
          </button>
        </div>
        {updates.length === 0 ? (
          <p className="text-gray-500 text-lg">
            No hay actualizaciones registradas para este producto.
          </p>
        ) : (
          <ul className="space-y-4">
            {updates.map((update) => (
              <li  
                key={update.id}
                className={`flex items-start gap-4 p-4 rounded-lg border shadow-sm ${getStyle(
                  update.type
                )}`}
              >
                <div className="text-2xl mt-1">{getEmoji(update.type)}</div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {getTytle(update.type)}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{update.message.replaceAll("_", " ")}</p>
                </div>
                <p className="text-l text-gray-500 mt-1">
                  {new Date(update.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppLayout>
  );
}