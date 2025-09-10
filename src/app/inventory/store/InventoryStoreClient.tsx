"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/AppLayout";
import { Card } from "@/components/Card";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  available: boolean;
}

interface InventoryStoreClientProps {
  userType: UserType;
  userName: string;
  storeName: string;
  products: Product[];
}

export default function InventoryStoreClient({
  userType,
  userName,
  storeName,
  products,
}: InventoryStoreClientProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddProduct = () => {
    router.push("/inventory/store/add");
  };

  return (
    <AppLayout
      userType={userType}
      userName={userName}
      activeSection="inventory"
      title={`Inventario de ${storeName}`}
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Total Productos
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {products.length}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Disponibles
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {products.filter((p) => p.available).length}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Agotados</h3>
            <p className="text-2xl font-bold text-red-600">
              {products.filter((p) => !p.available).length}
            </p>
          </div>

          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Valor Total
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              ${products.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={handleAddProduct}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 text-center">
            {searchTerm ? (
              <div>
                <p className="text-gray-500 text-lg mb-4">
                  No se encontraron productos que coincidan con "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <div>
                <p className="text-gray-500 text-lg mb-4">
                  No hay productos disponibles en tu tienda.
                </p>
                <button
                  onClick={handleAddProduct}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Agregar Primer Producto
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="p-4 sm:p-6 bg-white shadow-lg hover:shadow-xl transition-all rounded-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-900 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="font-semibold text-blue-600 text-lg">
                    ${product.price.toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.available
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.available ? "Disponible" : "Agotado"}
                  </span>

                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Editar
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
