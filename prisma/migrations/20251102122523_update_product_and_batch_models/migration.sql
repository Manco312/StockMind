-- AlterTable
ALTER TABLE "public"."batches" ADD COLUMN     "purchasePrice" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."products" ADD COLUMN     "distributorProductId" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."products" ADD CONSTRAINT "products_distributorProductId_fkey" FOREIGN KEY ("distributorProductId") REFERENCES "public"."products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
