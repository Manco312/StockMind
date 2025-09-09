"use client";
import { Button } from "@/components/Button";

export function ClientButton() {
  return (
    <Button
      size="lg"
      onClick={() => (window.location.href = "/inventory/store/add")}
      className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 text-lg rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
    >
      Agregar Producto
    </Button>
  );
}