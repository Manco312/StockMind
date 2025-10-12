import { prisma } from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const count = await prisma.alert.count({
    where: { resolved: false },
  });
  return NextResponse.json({ count });
}
