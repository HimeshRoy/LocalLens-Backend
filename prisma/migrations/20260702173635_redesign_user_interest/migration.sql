/*
  Warnings:

  - You are about to drop the column `category` on the `UserInterest` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,type,value]` on the table `UserInterest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `UserInterest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `UserInterest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InterestType" AS ENUM ('CATEGORY', 'TAG', 'CITY', 'PRICE_RANGE');

-- DropIndex
DROP INDEX "UserInterest_userId_category_key";

-- AlterTable
ALTER TABLE "UserInterest" DROP COLUMN "category",
ADD COLUMN     "type" "InterestType" NOT NULL,
ADD COLUMN     "value" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "UserInterest_userId_type_value_key" ON "UserInterest"("userId", "type", "value");
