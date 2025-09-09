/*
  Warnings:

  - Added the required column `name` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."salespeople" ADD COLUMN     "inventoryId" INTEGER;

-- AlterTable
ALTER TABLE "public"."stores" ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."salespeople" ADD CONSTRAINT "salespeople_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "public"."inventories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
