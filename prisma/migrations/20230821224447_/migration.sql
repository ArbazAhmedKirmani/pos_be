/*
  Warnings:

  - You are about to drop the column `paymentType` on the `order` table. All the data in the column will be lost.
  - Added the required column `branchId` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paidAmount` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationSettings" AS ENUM ('IS_STICKY', 'DIRECT_LINK');

-- AlterTable
ALTER TABLE "order" DROP COLUMN "paymentType",
ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "paidAmount" MONEY NOT NULL;

-- CreateTable
CREATE TABLE "loginLogs" (
    "loginLogsId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "loginLogs_pkey" PRIMARY KEY ("loginLogsId")
);

-- CreateTable
CREATE TABLE "notificationSettings" (
    "notificationSettingId" TEXT NOT NULL,
    "setting" "NotificationSettings" NOT NULL,
    "value" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "notificationSettings_pkey" PRIMARY KEY ("notificationSettingId")
);

-- CreateTable
CREATE TABLE "orderPayments" (
    "orderPaymentId" SERIAL NOT NULL,
    "type" "PaymentType" NOT NULL DEFAULT 'CASH',
    "paidAmount" MONEY NOT NULL,
    "paymentModeId" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "orderPayments_pkey" PRIMARY KEY ("orderPaymentId")
);

-- AddForeignKey
ALTER TABLE "loginLogs" ADD CONSTRAINT "loginLogs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loginLogs" ADD CONSTRAINT "loginLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificationSettings" ADD CONSTRAINT "notificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch"("branchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderPayments" ADD CONSTRAINT "orderPayments_paymentModeId_fkey" FOREIGN KEY ("paymentModeId") REFERENCES "paymentMode"("paymentModeId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderPayments" ADD CONSTRAINT "orderPayments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderPayments" ADD CONSTRAINT "orderPayments_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
