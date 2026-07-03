/*
  Warnings:

  - The values [LOW,MEDIUM,HIGH] on the enum `PriceRange` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `contact` on the `Place` table. All the data in the column will be lost.
  - The `priceRange` column on the `Place` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PriceRange_new" AS ENUM ('BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY');
ALTER TABLE "Place" ALTER COLUMN "priceRange" TYPE "PriceRange_new" USING ("priceRange"::text::"PriceRange_new");
ALTER TYPE "PriceRange" RENAME TO "PriceRange_old";
ALTER TYPE "PriceRange_new" RENAME TO "PriceRange";
DROP TYPE "public"."PriceRange_old";
COMMIT;

-- AlterTable
ALTER TABLE "Place" DROP COLUMN "contact",
ADD COLUMN     "phone" TEXT,
DROP COLUMN "priceRange",
ADD COLUMN     "priceRange" "PriceRange";
