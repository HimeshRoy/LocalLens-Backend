/*
  Warnings:

  - You are about to drop the column `documentPublicId` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `documentUrl` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `rejectionReason` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `selfiePublicId` on the `VerificationRequest` table. All the data in the column will be lost.
  - You are about to drop the column `selfieUrl` on the `VerificationRequest` table. All the data in the column will be lost.
  - The `status` column on the `VerificationRequest` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "VerificationRequest" DROP COLUMN "documentPublicId",
DROP COLUMN "documentUrl",
DROP COLUMN "reason",
DROP COLUMN "rejectionReason",
DROP COLUMN "selfiePublicId",
DROP COLUMN "selfieUrl",
DROP COLUMN "status",
ADD COLUMN     "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE INDEX "VerificationRequest_status_idx" ON "VerificationRequest"("status");
