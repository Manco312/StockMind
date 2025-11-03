"use client";

import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import OrderForm from "@/components/OrderForm";
import AppLayout from "@/components/AppLayout";
import { InventoryManager, Product } from "@/src/generated/prisma";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface CreateOrderClientProps {
  userType: UserType;
  userName: string;
  offeredProducts: Product[];
  inventoryManager: InventoryManager;
}

export default function CreateOrderClient({ 
  userType,
  userName,
  offeredProducts, 
  inventoryManager 
}: CreateOrderClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const handleSuccess = () => {
    router.back(); 
  };

  return (
    <AppLayout
      userType={userType}
      userName={userName} 
      activeSection="orders"
      title="Pedidos"
    >
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Crear Nuevo Pedido
        </h1>
        <OrderForm
          offeredProducts={offeredProducts}
          inventoryManager={inventoryManager}
          onSuccessAction={handleSuccess}
          preselectedProductId={productId ? parseInt(productId) : undefined} 
        />
      </div>
    </AppLayout>
    
  );
}
