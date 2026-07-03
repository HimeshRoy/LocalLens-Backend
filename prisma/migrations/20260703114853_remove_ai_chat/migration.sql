/*
  Warnings:

  - You are about to drop the `AiChat` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "AiChat" DROP CONSTRAINT "AiChat_userId_fkey";

-- DropTable
DROP TABLE "AiChat";
