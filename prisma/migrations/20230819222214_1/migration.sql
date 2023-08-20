/*
  Warnings:

  - You are about to drop the column `branchId` on the `users` table. All the data in the column will be lost.
  - Added the required column `companyId` to the `branch` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BranchType" AS ENUM ('WAREHOUSE', 'OUTLET');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('FOOD', 'RETAIL', 'GENERAL');

-- CreateEnum
CREATE TYPE "SizeType" AS ENUM ('SELLING', 'INVENTORY');

-- CreateEnum
CREATE TYPE "OrderMode" AS ENUM ('DINE_IN', 'DELIVERY', 'TAKE_AWAY', 'OTHERS');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('POS', 'FOODPANDA', 'GOLOOTLO', 'CHEETAY', 'SUPERMEAN', 'EATOYE', 'FOOD_GENIES', 'ZAPP', 'HI_FOOD', 'TOSSDOWN', 'WEB_ORDER', 'CALL_CENTER', 'CAREEM', 'UBER');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'ACCEPTED', 'PROCESSING', 'READY', 'DELIVERED', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'CARD', 'DEBT', 'CREDIT', 'ONLINE', 'CHEQUE', 'OTHERS');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('HOME', 'OFFICE', 'WORK', 'FRIEND', 'OTHERS');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('ORDER', 'PAYMENT', 'SUMMARY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "UserRole" ADD VALUE 'SUB_ADMIN';
ALTER TYPE "UserRole" ADD VALUE 'CALL_CENTER';

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_branchId_fkey";

-- AlterTable
ALTER TABLE "branch" ADD COLUMN     "companyId" INTEGER NOT NULL,
ADD COLUMN     "description" VARCHAR(200),
ADD COLUMN     "type" "BranchType" NOT NULL DEFAULT 'OUTLET';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "branchId",
ADD COLUMN     "companyId" INTEGER,
ADD COLUMN     "isEmailVerified" BOOLEAN DEFAULT false;

-- CreateTable
CREATE TABLE "company" (
    "companyId" SERIAL NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "businessType" "BusinessType" NOT NULL DEFAULT 'FOOD',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "company_pkey" PRIMARY KEY ("companyId")
);

-- CreateTable
CREATE TABLE "devices" (
    "deviceId" TEXT NOT NULL,
    "device" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devices_pkey" PRIMARY KEY ("deviceId")
);

-- CreateTable
CREATE TABLE "notifications" (
    "notificationId" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "type" "NotificationType" NOT NULL,
    "createdOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedOn" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("notificationId")
);

-- CreateTable
CREATE TABLE "otp" (
    "otpId" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "otp" TEXT NOT NULL,
    "expiryTime" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("otpId")
);

-- CreateTable
CREATE TABLE "size" (
    "sizeId" SERIAL NOT NULL,
    "sizeName" TEXT NOT NULL,
    "type" "SizeType" NOT NULL DEFAULT 'SELLING',
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "size_pkey" PRIMARY KEY ("sizeId")
);

-- CreateTable
CREATE TABLE "flavour" (
    "flevourId" SERIAL NOT NULL,
    "flavourName" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "flavour_pkey" PRIMARY KEY ("flevourId")
);

-- CreateTable
CREATE TABLE "unitConversion" (
    "unitConversionId" SERIAL NOT NULL,
    "buyingUnitId" INTEGER NOT NULL,
    "distributionUnitId" INTEGER NOT NULL,
    "sellingUnitId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "unitConversion_pkey" PRIMARY KEY ("unitConversionId")
);

-- CreateTable
CREATE TABLE "productCategory" (
    "productCategoryId" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "color" TEXT,
    "printerName" TEXT,
    "image" TEXT,
    "image2" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "productCategory_pkey" PRIMARY KEY ("productCategoryId")
);

-- CreateTable
CREATE TABLE "productType" (
    "productTypeId" SERIAL NOT NULL,
    "typeName" TEXT NOT NULL,
    "description" TEXT,
    "printerName" TEXT,
    "color" TEXT,
    "image" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "productType_pkey" PRIMARY KEY ("productTypeId")
);

-- CreateTable
CREATE TABLE "products" (
    "productId" SERIAL NOT NULL,
    "productName" TEXT NOT NULL,
    "descriptions" TEXT,
    "allowDiscount" BOOLEAN NOT NULL DEFAULT true,
    "isSaleable" BOOLEAN NOT NULL DEFAULT true,
    "isInventory" BOOLEAN NOT NULL DEFAULT false,
    "sellingPrice" MONEY NOT NULL,
    "servingQuantity" DECIMAL,
    "isDeal" BOOLEAN NOT NULL DEFAULT false,
    "isHalfNhalf" BOOLEAN NOT NULL DEFAULT false,
    "halfNhalfPcs" INTEGER,
    "image" TEXT,
    "image2" TEXT,
    "unitConversionId" INTEGER NOT NULL,
    "productCategoryId" INTEGER NOT NULL,
    "productTypeId" INTEGER NOT NULL,
    "flavourId" INTEGER NOT NULL,
    "sizeId" INTEGER NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("productId")
);

-- CreateTable
CREATE TABLE "areas" (
    "areaId" SERIAL NOT NULL,
    "areaName" TEXT NOT NULL,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "deliveryTime" TEXT,
    "deliveryCharges" MONEY,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "areas_pkey" PRIMARY KEY ("areaId")
);

-- CreateTable
CREATE TABLE "paymentMode" (
    "paymentModeId" SERIAL NOT NULL,
    "paymentModeName" TEXT NOT NULL,
    "PaymentType" "PaymentType" NOT NULL DEFAULT 'CASH',
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "paymentMode_pkey" PRIMARY KEY ("paymentModeId")
);

-- CreateTable
CREATE TABLE "tables" (
    "tableId" SERIAL NOT NULL,
    "tableName" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "tables_pkey" PRIMARY KEY ("tableId")
);

-- CreateTable
CREATE TABLE "waiters" (
    "waiterId" SERIAL NOT NULL,
    "waiterName" TEXT NOT NULL,
    "cnic" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "waiters_pkey" PRIMARY KEY ("waiterId")
);

-- CreateTable
CREATE TABLE "customerName" (
    "customerNameId" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "customerName_pkey" PRIMARY KEY ("customerNameId")
);

-- CreateTable
CREATE TABLE "customerAddress" (
    "customerAddressId" SERIAL NOT NULL,
    "address" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "type" "AddressType" NOT NULL DEFAULT 'HOME',
    "isActive" BOOLEAN DEFAULT true,

    CONSTRAINT "customerAddress_pkey" PRIMARY KEY ("customerAddressId")
);

-- CreateTable
CREATE TABLE "customer" (
    "customerId" SERIAL NOT NULL,
    "customerName" TEXT NOT NULL,
    "cnic" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "rewards" MONEY,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("customerId")
);

-- CreateTable
CREATE TABLE "order" (
    "orderId" TEXT NOT NULL,
    "orderDate" TIMESTAMP(3) NOT NULL,
    "mode" "OrderMode" NOT NULL DEFAULT 'DINE_IN',
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "type" "OrderType" NOT NULL DEFAULT 'POS',
    "paymentType" "PaymentType" NOT NULL DEFAULT 'CASH',
    "isAdvanceOrder" BOOLEAN NOT NULL DEFAULT false,
    "orderProgress" INTEGER,
    "amount" MONEY NOT NULL,
    "gst" DOUBLE PRECISION,
    "gstAmount" MONEY NOT NULL DEFAULT 0,
    "vat" DOUBLE PRECISION,
    "vatAmount" MONEY NOT NULL DEFAULT 0,
    "discount" DOUBLE PRECISION,
    "discountAmount" MONEY NOT NULL DEFAULT 0,
    "totalAmount" MONEY NOT NULL,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "orderDetail" (
    "orderDetailId" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "isDeal" BOOLEAN NOT NULL,
    "isHalfNhalf" BOOLEAN NOT NULL,
    "halfNhalfQuantity" INTEGER,
    "parentProductId" INTEGER,
    "productId" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "orderDetail_pkey" PRIMARY KEY ("orderDetailId")
);

-- CreateTable
CREATE TABLE "_branchTousers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_branchToproducts" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_areasTobranch" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_tablesTowaiters" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "devices_device_key" ON "devices"("device");

-- CreateIndex
CREATE UNIQUE INDEX "_branchTousers_AB_unique" ON "_branchTousers"("A", "B");

-- CreateIndex
CREATE INDEX "_branchTousers_B_index" ON "_branchTousers"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_branchToproducts_AB_unique" ON "_branchToproducts"("A", "B");

-- CreateIndex
CREATE INDEX "_branchToproducts_B_index" ON "_branchToproducts"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_areasTobranch_AB_unique" ON "_areasTobranch"("A", "B");

-- CreateIndex
CREATE INDEX "_areasTobranch_B_index" ON "_areasTobranch"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_tablesTowaiters_AB_unique" ON "_tablesTowaiters"("A", "B");

-- CreateIndex
CREATE INDEX "_tablesTowaiters_B_index" ON "_tablesTowaiters"("B");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devices" ADD CONSTRAINT "devices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp" ADD CONSTRAINT "otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "size" ADD CONSTRAINT "size_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flavour" ADD CONSTRAINT "flavour_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unitConversion" ADD CONSTRAINT "unitConversion_buyingUnitId_fkey" FOREIGN KEY ("buyingUnitId") REFERENCES "size"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unitConversion" ADD CONSTRAINT "unitConversion_distributionUnitId_fkey" FOREIGN KEY ("distributionUnitId") REFERENCES "size"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unitConversion" ADD CONSTRAINT "unitConversion_sellingUnitId_fkey" FOREIGN KEY ("sellingUnitId") REFERENCES "size"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unitConversion" ADD CONSTRAINT "unitConversion_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productCategory" ADD CONSTRAINT "productCategory_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productType" ADD CONSTRAINT "productType_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_unitConversionId_fkey" FOREIGN KEY ("unitConversionId") REFERENCES "unitConversion"("unitConversionId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productCategoryId_fkey" FOREIGN KEY ("productCategoryId") REFERENCES "productCategory"("productCategoryId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "productType"("productTypeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_flavourId_fkey" FOREIGN KEY ("flavourId") REFERENCES "flavour"("flevourId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_sizeId_fkey" FOREIGN KEY ("sizeId") REFERENCES "size"("sizeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "areas" ADD CONSTRAINT "areas_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paymentMode" ADD CONSTRAINT "paymentMode_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waiters" ADD CONSTRAINT "waiters_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customerName" ADD CONSTRAINT "customerName_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customerAddress" ADD CONSTRAINT "customerAddress_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customer"("customerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_parentProductId_fkey" FOREIGN KEY ("parentProductId") REFERENCES "products"("productId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDetail" ADD CONSTRAINT "orderDetail_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_branchTousers" ADD CONSTRAINT "_branchTousers_A_fkey" FOREIGN KEY ("A") REFERENCES "branch"("branchId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_branchTousers" ADD CONSTRAINT "_branchTousers_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_branchToproducts" ADD CONSTRAINT "_branchToproducts_A_fkey" FOREIGN KEY ("A") REFERENCES "branch"("branchId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_branchToproducts" ADD CONSTRAINT "_branchToproducts_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("productId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_areasTobranch" ADD CONSTRAINT "_areasTobranch_A_fkey" FOREIGN KEY ("A") REFERENCES "areas"("areaId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_areasTobranch" ADD CONSTRAINT "_areasTobranch_B_fkey" FOREIGN KEY ("B") REFERENCES "branch"("branchId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tablesTowaiters" ADD CONSTRAINT "_tablesTowaiters_A_fkey" FOREIGN KEY ("A") REFERENCES "tables"("tableId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_tablesTowaiters" ADD CONSTRAINT "_tablesTowaiters_B_fkey" FOREIGN KEY ("B") REFERENCES "waiters"("waiterId") ON DELETE CASCADE ON UPDATE CASCADE;
