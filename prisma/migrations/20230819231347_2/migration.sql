-- CreateEnum
CREATE TYPE "CompanySetttings" AS ENUM ('ALLOW_POS', 'ALLOW_KDS', 'ALLOW_MULTI_PRINTING', 'NUMBER_OF_USERS', 'ALLOW_DYNAMIC_RECEIPT', 'ALLOW_INVENTORY', 'ALLOW_FINANCE', 'ADVANCE_REPORTING', 'NUMBER_OF_ACTIVE_USERS');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "notification" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "companySettings" (
    "companySettingId" SERIAL NOT NULL,
    "setting" "CompanySetttings" NOT NULL DEFAULT 'NUMBER_OF_USERS',
    "valueBool" BOOLEAN NOT NULL DEFAULT false,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "companySettings_pkey" PRIMARY KEY ("companySettingId")
);

-- AddForeignKey
ALTER TABLE "companySettings" ADD CONSTRAINT "companySettings_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
