/*
  Warnings:

  - A unique constraint covering the columns `[salespersonId]` on the table `inventories` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."inventories" ADD COLUMN     "salespersonId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "inventories_salespersonId_key" ON "public"."inventories"("salespersonId");

-- AddForeignKey
ALTER TABLE "public"."inventories" ADD CONSTRAINT "inventories_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES "public"."salespeople"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
