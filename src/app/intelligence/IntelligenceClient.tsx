"use client";

import { useState } from "react";
import AppLayout from "@/components/AppLayout";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface AnalyticsData {
  store?: any;
  salesByProduct?: Record<number, any>;
  highRotationProducts?: any[];
  lowRotationProducts?: any[];
  outOfStockProducts?: any[];
  salesTrend?: number;
  totalSales?: number;
  totalOrders?: number;
  inventoryValue?: number;
  salesByStore?: Record<number, any>;
  activeStores?: number;
}

interface IntelligenceClientProps {
  userType: UserType;
  userName: string;
  analyticsData: AnalyticsData | null;
}

export default function IntelligenceClient({
  userType,
  userName,
  analyticsData,
}: IntelligenceClientProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Función para generar insights basados en los datos
  const generateInsights = () => {
    if (!analyticsData) return [];

    const insights = [];

    if (userType === "inventory_manager") {
      // Insights para Inventory Manager
      if (analyticsData.salesTrend && analyticsData.salesTrend > 0) {
        insights.push({
          type: "success",
          title: "Tendencia Positiva",
          message: `Las ventas han aumentado un ${analyticsData.salesTrend.toFixed(
            1
          )}% en los últimos 30 días.`,
        });
      } else if (analyticsData.salesTrend && analyticsData.salesTrend < 0) {
        insights.push({
          type: "warning",
          title: "Tendencia Negativa",
          message: `Las ventas han disminuido un ${Math.abs(
            analyticsData.salesTrend
          ).toFixed(1)}% en los últimos 30 días.`,
        });
      }

      if (
        analyticsData.outOfStockProducts &&
        analyticsData.outOfStockProducts.length > 0
      ) {
        insights.push({
          type: "error",
          title: "Productos Agotados",
          message: `Tienes ${analyticsData.outOfStockProducts.length} productos sin stock. Considera reabastecer.`,
        });
      }

      if (
        analyticsData.lowRotationProducts &&
        analyticsData.lowRotationProducts.length > 0
      ) {
        insights.push({
          type: "info",
          title: "Productos de Baja Rotación",
          message: `Identificamos ${analyticsData.lowRotationProducts.length} productos con baja rotación. Considera promociones.`,
        });
      }
    } else if (userType === "salesperson") {
      // Insights para Salesperson
      if (analyticsData.activeStores && analyticsData.activeStores > 0) {
        insights.push({
          type: "success",
          title: "Tiendas Activas",
          message: `Tienes ${analyticsData.activeStores} tiendas activas en tu territorio.`,
        });
      }

      if (analyticsData.totalSales && analyticsData.totalSales > 0) {
        insights.push({
          type: "info",
          title: "Rendimiento de Ventas",
          message: `Has generado $${analyticsData.totalSales.toLocaleString()} en ventas este mes.`,
        });
      }
    }

    return insights;
  };

  const insights = generateInsights();

  return (
    <AppLayout
      userType={userType}
      userName={userName}
      activeSection="intelligence"
      title="Inteligencia de Negocios"
    >
      <div className="space-y-6">
        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Filtros de Análisis
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Seleccionar período de análisis"
                aria-label="Seleccionar período de análisis"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 90 días</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                title="Seleccionar categoría de producto"
                aria-label="Seleccionar categoría de producto"
              >
                <option value="all">Todas las categorías</option>
                <option value="food">Alimentos</option>
                <option value="cleaning">Limpieza</option>
                <option value="beverages">Bebidas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {userType === "inventory_manager" ? (
            <>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-4 sm:p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-2">
                      Ventas del Mes
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      ${analyticsData?.totalSales?.toLocaleString() || "0"}
                    </p>
                    <p
                      className={`text-sm ${
                        analyticsData?.salesTrend &&
                        analyticsData.salesTrend > 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {analyticsData?.salesTrend
                        ? `${
                            analyticsData.salesTrend > 0 ? "+" : ""
                          }${analyticsData.salesTrend.toFixed(1)}%`
                        : "Sin datos"}{" "}
                      vs mes anterior
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-4 sm:p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-700 mb-2">
                      Pedidos Recibidos
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {analyticsData?.totalOrders || 0}
                    </p>
                    <p className="text-sm text-blue-600">este mes</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-4 sm:p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-purple-700 mb-2">
                      Valor del Inventario
                    </h3>
                    <p className="text-2xl font-bold text-purple-900">
                      ${analyticsData?.inventoryValue?.toLocaleString() || "0"}
                    </p>
                    <p className="text-sm text-purple-600">stock actual</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg p-4 sm:p-6 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-red-700 mb-2">
                      Productos Agotados
                    </h3>
                    <p className="text-2xl font-bold text-red-900">
                      {analyticsData?.outOfStockProducts?.length || 0}
                    </p>
                    <p className="text-sm text-red-600">
                      requieren reabastecimiento
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-lg p-4 sm:p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-2">
                      Ventas del Mes
                    </h3>
                    <p className="text-2xl font-bold text-green-900">
                      ${analyticsData?.totalSales?.toLocaleString() || "0"}
                    </p>
                    <p className="text-sm text-green-600">total generado</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-4 sm:p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-blue-700 mb-2">
                      Pedidos Realizados
                    </h3>
                    <p className="text-2xl font-bold text-blue-900">
                      {analyticsData?.totalOrders || 0}
                    </p>
                    <p className="text-sm text-blue-600">este mes</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-lg p-4 sm:p-6 border border-purple-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-purple-700 mb-2">
                      Tiendas Activas
                    </h3>
                    <p className="text-2xl font-bold text-purple-900">
                      {analyticsData?.activeStores || 0}
                    </p>
                    <p className="text-sm text-purple-600">en tu territorio</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-lg p-4 sm:p-6 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-orange-700 mb-2">
                      Productos Únicos
                    </h3>
                    <p className="text-2xl font-bold text-orange-900">
                      {analyticsData?.salesByStore
                        ? Object.values(analyticsData.salesByStore).reduce(
                            (sum: number, store: any) =>
                              sum + store.uniqueProducts,
                            0
                          )
                        : 0}
                    </p>
                    <p className="text-sm text-orange-600">vendidos este mes</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Análisis Detallados */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Productos con Alta Rotación */}
          {userType === "inventory_manager" &&
            analyticsData?.highRotationProducts &&
            analyticsData.highRotationProducts.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Productos con Alta Rotación
                </h3>
                <div className="space-y-3">
                  {analyticsData.highRotationProducts
                    .slice(0, 5)
                    .map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.totalQuantity} unidades vendidas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">
                            ${item.totalValue.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.orders} pedidos
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Productos con Baja Rotación */}
          {userType === "inventory_manager" &&
            analyticsData?.lowRotationProducts &&
            analyticsData.lowRotationProducts.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                  Productos con Baja Rotación
                </h3>
                <div className="space-y-3">
                  {analyticsData.lowRotationProducts
                    .slice(0, 5)
                    .map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.product.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.totalQuantity} unidades vendidas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-orange-600">
                            ${item.totalValue.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.orders} pedidos
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          {/* Análisis por Tienda (Salesperson) */}
          {userType === "salesperson" && analyticsData?.salesByStore && (
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Análisis por Tienda
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(analyticsData.salesByStore).map(
                  (store: any, index: number) => (
                    <div key={index} className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {store.store.name}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Ventas:</span>
                          <span className="font-medium text-blue-600">
                            ${store.totalValue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Pedidos:
                          </span>
                          <span className="font-medium text-blue-600">
                            {store.totalOrders}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Productos únicos:
                          </span>
                          <span className="font-medium text-blue-600">
                            {store.uniqueProducts}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>

        {/* Insights y Recomendaciones */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            Insights y Recomendaciones
          </h3>
          <div className="space-y-3">
            {insights.length > 0 ? (
              insights.map((insight, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    insight.type === "success"
                      ? "bg-green-50 border border-green-200"
                      : insight.type === "warning"
                      ? "bg-yellow-50 border border-yellow-200"
                      : insight.type === "error"
                      ? "bg-red-50 border border-red-200"
                      : "bg-blue-50 border border-blue-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        insight.type === "success"
                          ? "bg-green-500"
                          : insight.type === "warning"
                          ? "bg-yellow-500"
                          : insight.type === "error"
                          ? "bg-red-500"
                          : "bg-blue-500"
                      }`}
                    >
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        {insight.type === "success" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        ) : insight.type === "warning" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                          />
                        ) : insight.type === "error" ? (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        ) : (
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h4
                        className={`font-semibold ${
                          insight.type === "success"
                            ? "text-green-800"
                            : insight.type === "warning"
                            ? "text-yellow-800"
                            : insight.type === "error"
                            ? "text-red-800"
                            : "text-blue-800"
                        }`}
                      >
                        {insight.title}
                      </h4>
                      <p
                        className={`text-sm ${
                          insight.type === "success"
                            ? "text-green-700"
                            : insight.type === "warning"
                            ? "text-yellow-700"
                            : insight.type === "error"
                            ? "text-red-700"
                            : "text-blue-700"
                        }`}
                      >
                        {insight.message}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-500">
                  No hay insights disponibles en este momento.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Historial de Reportes */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Historial de Reportes
          </h3>
          <div className="space-y-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Reporte de Análisis Mensual
                  </h4>
                  <p className="text-sm text-gray-600">
                    Generado el {new Date().toLocaleDateString()}
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Descargar
                </button>
              </div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Análisis de Rotación de Productos
                  </h4>
                  <p className="text-sm text-gray-600">
                    Generado el{" "}
                    {new Date(
                      Date.now() - 7 * 24 * 60 * 60 * 1000
                    ).toLocaleDateString()}
                  </p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Descargar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
