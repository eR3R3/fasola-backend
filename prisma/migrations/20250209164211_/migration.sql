/*
  Warnings:

  - You are about to drop the column `proportions` on the `MiniTest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MiniTest" DROP COLUMN "proportions",
ADD COLUMN     "proportion" DOUBLE PRECISION[];
