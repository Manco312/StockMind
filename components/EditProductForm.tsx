"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

interface Batch {
  id: number
  code: string
  quantity: number
}

interface Product {
  id: number
  title: string
  price: number
  stock: number
  batches: Batch[]
}

interface EditProductFormProps {
  product: Product
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const router = useRouter()
  const [newPrice, setNewPrice] = useState(product.price)
  const [editStock, setEditStock] = useState(false)
  const [selectedBatch, setSelectedBatch] = useState<number | null>(null)
  const [newQuantity, setNewQuantity] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSaveChanges = async () => {
    setLoading(true)
    try {
      const updates: any = {}

      if (newPrice !== product.price) {
        updates.price = newPrice
      }

      if (editStock && selectedBatch && newQuantity !== null) {
        updates.stockUpdate = {
          batchId: selectedBatch,
          newQuantity,
        }
      }

      if (Object.keys(updates).length === 0) {
        setMessage("No se realizaron cambios.")
        setLoading(false)
        return
      }

      const response = await fetch(`/api/inventory/products/${product.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })

      if (!response.ok) throw new Error("Error al actualizar el producto")

      setMessage("Cambios guardados con éxito ✅")
      router.refresh()
      setTimeout(() => router.push("/inventory/store"), 1500)
    } catch (err: any) {
      setMessage(err.message || "Error al guardar cambios")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Cambiar precio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Precio de venta</label>
        <input
          type="number"
          value={newPrice}
          onChange={(e) => setNewPrice(parseFloat(e.target.value))}
          className="w-full border border-gray-700 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
        />
      </div>

      {/* Cambiar stock */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <input
            type="checkbox"
            checked={editStock}
            onChange={(e) => setEditStock(e.target.checked)}
          />
          Modificar stock
        </label>

        {editStock && (
          <div className="space-y-3">
            <select
              value={selectedBatch || ""}
              onChange={(e) => setSelectedBatch(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
            >
              <option value="">Selecciona un lote</option>
              {product.batches.map((batch) => (
                <option key={batch.id} value={batch.id}>
                  {batch.code} — {batch.quantity} unidades
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Nueva cantidad"
              value={newQuantity || ""}
              onChange={(e) => setNewQuantity(parseInt(e.target.value))}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        )}
      </div>

      <button
        onClick={handleSaveChanges}
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium text-white ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Guardando..." : "Guardar Cambios"}
      </button>

      {message && <p className="text-center mt-4 text-sm text-gray-700">{message}</p>}
    </div>
  )
}
