"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";

type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
};

interface AddProductFormProps {
  products: Product[];
  onSuccess?: () => void;
  isSubmitting?: boolean;
  setIsSubmitting?: (value: boolean) => void;
}

export default function AddProductForm({
  products,
  onSuccess,
  isSubmitting = false,
  setIsSubmitting,
}: AddProductFormProps) {
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();

  const toggleSelection = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected.length) return alert("Selecciona al menos un producto");

    if (setIsSubmitting) setIsSubmitting(true);

    try {
      const res = await fetch("/api/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: selected }),
      });

      if (res.ok) {
        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/inventory/store");
        }
      } else {
        const data = await res.json();
        alert(data.error || "Error al agregar productos");
      }
    } catch (error) {
      alert("Error de conexión");
    } finally {
      if (setIsSubmitting) setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
          Selecciona Productos
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Elige los productos que deseas agregar a tu inventario
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-700 bg-red-100 p-4 rounded-lg">
            No hay productos disponibles en el catálogo
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              className="cursor-pointer"
              onClick={() => toggleSelection(p.id)}
            >
              <Card
                className={`p-4 sm:p-6 flex flex-col justify-between transition-all hover:shadow-xl rounded-xl border-2 ${
                  selected.includes(p.id)
                    ? "border-blue-500 shadow-lg bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    {p.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {p.description}
                  </p>
                  <p className="font-semibold text-blue-600 text-lg">
                    ${p.price.toLocaleString()}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selected.includes(p.id)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {selected.includes(p.id) ? "Seleccionado" : "Disponible"}
                  </span>

                  {selected.includes(p.id) && (
                    <span className="text-blue-600 text-lg">✓</span>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {selected.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm sm:text-base">
            <strong>{selected.length}</strong> producto
            {selected.length > 1 ? "s" : ""} seleccionado
            {selected.length > 1 ? "s" : ""}
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <Button
          size="lg"
          type="submit"
          disabled={!selected.length || isSubmitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          {isSubmitting
            ? "Agregando..."
            : `Agregar ${selected.length} producto${
                selected.length > 1 ? "s" : ""
              }`}
        </Button>
      </div>
    </form>
  );
}
