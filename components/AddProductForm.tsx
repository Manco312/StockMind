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

export default function AddProductForm({ products }: { products: Product[] }) {
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

    const res = await fetch("/api/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ products: selected }),
    });

    if (res.ok) {
      router.push("/inventory/store");
    } else {
      const data = await res.json();
      alert(data.error || "Error al agregar productos");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl mb-4">
        <Button
          size="md"
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-xl shadow-sm transition-all"
        >
          ← Regresar
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl w-full space-y-6">
        <h1 className="text-4xl font-bold text-slate-800 text-center mb-6">
          Agregar productos de la distribuidora
        </h1>

        {products.length === 0 ? (
          <p className="text-center text-gray-700 bg-red-100 p-4 rounded-md">
            No hay productos disponibles
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="cursor-pointer"
                onClick={() => toggleSelection(p.id)}
              >
                <Card
                  className={`p-5 flex flex-col justify-between transition-shadow hover:shadow-xl rounded-xl border ${
                    selected.includes(p.id)
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200"
                  }`}
                >
                  <div>
                    <h2 className="font-semibold text-lg text-slate-800 mb-2">
                      {p.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2">
                      {p.description}
                    </p>
                    <p className="text-gray-600">Precio: ${p.price}</p>
                    <p className="text-gray-500 text-xs">ID: {p.id}</p>
                  </div>
                  <p
                    className={`mt-3 font-medium text-sm ${
                      selected.includes(p.id)
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    {selected.includes(p.id) ? "Seleccionado ✅" : "Disponible"}
                  </p>
                </Card>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button
            size="lg"
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Agregar al inventario
          </Button>
        </div>
      </form>
    </div>
  );
}
