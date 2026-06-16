-- CreateTable
CREATE TABLE "ClientPhoto" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL DEFAULT '',
    "imageUrl" TEXT NOT NULL DEFAULT '',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClientPhoto_order_idx" ON "ClientPhoto"("order");
