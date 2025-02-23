/*
  Warnings:

  - You are about to drop the column `userId` on the `TestAssignment` table. All the data in the column will be lost.
  - Added the required column `revieweeId` to the `TestAssignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviewerId` to the `TestAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TestAssignment" DROP CONSTRAINT "TestAssignment_userId_fkey";

-- AlterTable
ALTER TABLE "TestAssignment" DROP COLUMN "userId",
ADD COLUMN     "revieweeId" INTEGER NOT NULL,
ADD COLUMN     "reviewerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_revieweeId_fkey" FOREIGN KEY ("revieweeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
