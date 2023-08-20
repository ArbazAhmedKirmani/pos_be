/*
  Warnings:

  - You are about to drop the column `valueBool` on the `companySettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "companySettings" DROP COLUMN "valueBool",
ADD COLUMN     "value" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "isApproved" BOOLEAN DEFAULT true;
