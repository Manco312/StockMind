-- CreateTable
CREATE TABLE "public"."ProductUpdate" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "ProductUpdate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ProductUpdate" ADD CONSTRAINT "ProductUpdate_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
