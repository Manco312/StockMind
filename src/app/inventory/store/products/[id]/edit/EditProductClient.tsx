"use client"

import AppLayout from "@/components/AppLayout"
import EditProductForm from "@/components/EditProductForm"

type UserType = "distributor" | "salesperson" | "inventory_manager"

interface Batch {
  id: number
  code: string
  quantity: number
}

interface ProductProps {
  id: number
  title: string
  price: number
  stock: number
  batches: Batch[]
}

interface EditProductClientProps {
  userType: UserType
  userName: string
  product: Product
}

export default function EditProductClient({ userType, userName, product }: EditProductClientProps) {
  return (
    <AppLayout userType={userType} userName={userName} activeSection="inventory">
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-gray-800">{product.title}</h2>
        <div className="mb-6 text-gray-700 bg-gray-100 p-4 rounded-lg shadow-sm">
        <p className="font-semibold text-lg mb-2">Información actual </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-sm mt-5">
                <span>
                💲 <strong>Precio:</strong> ${product.price}
                </span>
                <span>
                ⚠️ <strong>Stock mínimo:</strong> {product.minimumStock}
                </span>
                <span>
                📦 <strong>Unidades:</strong> {product.stock}
                </span>
            </div>
        </div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">Editar Producto</h2>
        <EditProductForm product={product} />
      </div>
    </AppLayout>
  )
}
