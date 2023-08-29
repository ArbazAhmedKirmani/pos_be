/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `areas` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `branch` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `company` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `accessToken` on the `loginLogs` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `loginLogs` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `paymentMode` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `productCategory` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `productType` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `tables` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `waiters` table. All the data in the column will be lost.
  - Added the required column `expireAt` to the `loginLogs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `tables` table without a default value. This is not possible if the table is not empty.
  - Added the required column `branchId` to the `waiters` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BranchStatus" AS ENUM ('OPENED', 'CLOSED');

-- AlterTable
ALTER TABLE "areas" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "branch" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "status" "BranchStatus" NOT NULL DEFAULT 'CLOSED';

-- AlterTable
ALTER TABLE "company" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "loginLogs" DROP COLUMN "accessToken",
DROP COLUMN "updatedAt",
ADD COLUMN     "expireAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "logout" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "paymentMode" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "productCategory" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "productType" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "products" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "tables" DROP COLUMN "isDeleted",
ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "users" DROP COLUMN "isDeleted",
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "waiters" DROP COLUMN "isDeleted",
ADD COLUMN     "branchId" INTEGER NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "tables" ADD CONSTRAINT "tables_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch"("branchId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "waiters" ADD CONSTRAINT "waiters_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch"("branchId") ON DELETE RESTRICT ON UPDATE CASCADE;
