import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });
  return NextResponse.json({ success: true });
}
