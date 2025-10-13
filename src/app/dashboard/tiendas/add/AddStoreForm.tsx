"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/Card"
import { Button } from "@/components/Button"

export default function AddStoreForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    neighborhood: "",
    capital: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields are filled
    if (!formData.name || !formData.address || !formData.neighborhood || !formData.capital) {
      alert("Todos los campos son obligatorios")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        alert("Tienda registrada exitosamente")
        router.push("/dashboard/tiendas")
      } else {
        alert(data.error || "Error al registrar la tienda")
      }
    } catch (error) {
      alert("Error de conexión")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Nueva Tienda Aliada</h2>
            <p className="text-gray-600">Completa la información de la tienda de barrio</p>
          </div>

          <div className="space-y-4">
            {/* Store Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Tienda <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Tienda Don José"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección <span className="text-red-500">*</span>
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Calle 123 #45-67"
              />
            </div>

            {/* Neighborhood */}
            <div>
              <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-2">
                Barrio <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="neighborhood"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Centro"
              />
            </div>

            {/* Capital */}
            <div>
              <label htmlFor="capital" className="block text-sm font-medium text-gray-700 mb-2">
                Capital Inicial <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="capital"
                name="capital"
                value={formData.capital}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 1000000"
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Nota:</strong> Todos los campos son obligatorios para registrar una nueva tienda aliada.
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              onClick={() => router.push("/dashboard/tiendas")}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Registrando..." : "Registrar Tienda"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
