"use client";

import { useState, useEffect } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
}

interface EditPriceModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (productId: number, newPrice: number) => void;
}

export default function EditPriceModal({ product, onClose, onSave }: EditPriceModalProps) {
  const [newPrice, setNewPrice] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (product) {
      setNewPrice(String(product.price));
      setError("");
    }
  }, [product]);

  if (!product) {
    return null;
  }

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewPrice(value);
    if (Number(value) > 0) {
      setError("");
    } else {
      setError("El precio debe ser un número positivo mayor que cero.");
    }
  };

  const handleSave = () => {
    const priceValue = Number(newPrice);
    if (priceValue > 0) {
      onSave(product.id, priceValue);
    } else {
      setError("Por favor, ingrese un precio válido.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md m-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Editar Precio</h2>
        <p className="text-gray-600 mb-6">
          Estás editando el precio para <span className="font-semibold text-blue-600">{product.title}</span>.
        </p>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Nuevo Precio de Venta
          </label>
          <input
            id="price"
            type="number"
            value={newPrice}
            onChange={handlePriceChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            } focus:border-transparent`}
            placeholder="Ej: 125.50"
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div className="mt-8 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!!error || newPrice === ""}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
