"use client";

import AppLayout from "@/components/AppLayout";
import { Order } from "@/src/generated/prisma";
import ProcessOrderForm from "@/components/ProcessOrderForm";
import MarkReceivedOrderForm from "@/components/MarkReceivedOrderForm";

type UserType = "distributor" | "salesperson" | "inventory_manager";

interface ProcessOrderClientProps {
  userType: UserType;
  userName: string;
  order: Order;
}

export default function ProcessOrderClient({
  userType,
  userName,
  order,
}: ProcessOrderClientProps) {
  return (
    <AppLayout userType={userType} userName={userName} activeSection="orders">
      {userType === "inventory_manager" ? (
        <MarkReceivedOrderForm order={order} />
      ) : (
        <ProcessOrderForm order={order} />
      )}
    </AppLayout>
  );
}
