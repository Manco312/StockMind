/*
  Warnings:

  - Added the required column `name` to the `stores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."stores" ADD COLUMN     "name" TEXT NOT NULL;
