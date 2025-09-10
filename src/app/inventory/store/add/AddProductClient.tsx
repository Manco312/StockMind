"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import AddProductForm from "@/components/AddProductForm";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
}

interface AddProductClientProps {
  userType: UserType;
  userName: string;
  products: Product[];
}

export default function AddProductClient({
  userType,
  userName,
  products,
}: AddProductClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    router.push("/inventory/store");
  };

  const handleSuccess = () => {
    router.push("/inventory/store");
  };

  return (
    <AppLayout
      userType={userType}
      userName={userName}
      activeSection="inventory"
      title="Agregar Productos al Inventario"
    >
      <div className="space-y-6">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver al Inventario
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Instrucciones
          </h3>
          <p className="text-blue-700 text-sm sm:text-base">
            Selecciona los productos del catálogo de distribuidor que deseas
            agregar a tu inventario. Puedes agregar múltiples productos a la
            vez.
          </p>
        </div>

        {/* Product Form */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
          <AddProductForm
            products={products}
            onSuccess={handleSuccess}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        </div>

        {/* Available Products Count */}
        <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Productos Disponibles
              </h3>
              <p className="text-2xl font-bold text-gray-900">
                {products.length}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-sm font-medium text-gray-500">Catálogo</h3>
              <p className="text-sm text-gray-600">Distribuidor</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
