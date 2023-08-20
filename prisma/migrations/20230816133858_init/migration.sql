-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MANAGER', 'BRANCH_MANAGER', 'CASHIER');

-- CreateTable
CREATE TABLE "city" (
    "cityId" SERIAL NOT NULL,
    "cityName" TEXT NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("cityId")
);

-- CreateTable
CREATE TABLE "users" (
    "userId" SERIAL NOT NULL,
    "fullname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cityId" INTEGER,
    "role" "UserRole" NOT NULL DEFAULT 'MANAGER',
    "branchId" INTEGER,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "branch" (
    "branchId" SERIAL NOT NULL,
    "branchName" TEXT NOT NULL,
    "address" TEXT,
    "longitude" DECIMAL(65,30),
    "latitude" DECIMAL(65,30),
    "startTime" TEXT,
    "endTime" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "createdBy" BIGINT,
    "updatedAt" TIMESTAMP(3),
    "updatedBy" BIGINT,
    "isDeleted" BOOLEAN DEFAULT false,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("branchId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "city"("cityId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branch"("branchId") ON DELETE SET NULL ON UPDATE CASCADE;
