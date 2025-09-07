/*
  Warnings:

  - The primary key for the `inventory_managers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `inventory_managers` table. All the data in the column will be lost.
  - The primary key for the `salespeople` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `salespeople` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_inventoryManagerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."orders" DROP CONSTRAINT "orders_salespersonId_fkey";

-- DropIndex
DROP INDEX "public"."inventory_managers_userId_key";

-- DropIndex
DROP INDEX "public"."salespeople_userId_key";

-- AlterTable
ALTER TABLE "public"."inventory_managers" DROP CONSTRAINT "inventory_managers_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "inventory_managers_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "public"."salespeople" DROP CONSTRAINT "salespeople_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "salespeople_pkey" PRIMARY KEY ("userId");

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_inventoryManagerId_fkey" FOREIGN KEY ("inventoryManagerId") REFERENCES "public"."inventory_managers"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."orders" ADD CONSTRAINT "orders_salespersonId_fkey" FOREIGN KEY ("salespersonId") REFERENCES "public"."salespeople"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
