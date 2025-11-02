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
  product: ProductProps
}

export default function EditProductClient({ userType, userName, product }: EditProductClientProps) {
  return (
    <AppLayout userType={userType} userName={userName} activeSection="inventory">
      <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Editar Producto</h2>
        <p className="text-gray-600 mb-6">
          Modifica el precio o el stock de <span className="font-semibold">{product.title}</span>.
        </p>
        <EditProductForm product={product} />
      </div>
    </AppLayout>
  )
}
