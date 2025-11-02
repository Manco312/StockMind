import { prisma } from "@/src/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const productId = parseInt(id)
    const { price, stockUpdate } = await req.json()

    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })

    const updates: any = {}
    const updatesCreated = []

    // Actualización de precio
    if (price && price !== product.price) {
      updates.price = price
      await prisma.productUpdate.create({
        data: {
          type: "price_update",
          message: `Precio actualizado de $${product.price} a $${price}`,
          productId,
          date: new Date(),
        },
      })
      updatesCreated.push("price_update")
    }

    // Actualización de stock
    if (stockUpdate) {
      const { batchId, newQuantity } = stockUpdate
      const batch = await prisma.batch.update({
        where: { id: batchId },
        data: { quantity: newQuantity },
      })

      await prisma.productUpdate.create({
        data: {
          type: "stock_update",
          message: `Stock del lote ${batch.code} actualizado a ${newQuantity} unidades.`,
          productId,
          date: new Date(),
        },
      })
      updatesCreated.push("stock_update")
    }

    if (Object.keys(updates).length > 0) {
      await prisma.product.update({ where: { id: productId }, data: updates })
    }

    return NextResponse.json({
      message: "Cambios guardados correctamente",
      updates: updatesCreated,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 })
  }
}
