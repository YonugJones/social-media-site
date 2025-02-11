/*
  Warnings:

  - You are about to drop the column `status` on the `Friendship` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Friendship" DROP COLUMN "status",
ADD COLUMN     "isConfirmed" BOOLEAN NOT NULL DEFAULT false;
