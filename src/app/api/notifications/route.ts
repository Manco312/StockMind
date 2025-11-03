import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { auth } from "@/src/auth"
import { redirect } from "next/navigation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) redirect("/accounting/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) redirect("/accounting/login");

  const notifications = await prisma.notification.findMany({
    where: { recipientId: user.id, read: false },
    orderBy: { createdAt: "desc" },
    take: 20, 
  });

  return NextResponse.json(notifications);
}
