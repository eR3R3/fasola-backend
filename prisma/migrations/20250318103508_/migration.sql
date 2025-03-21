/*
  Warnings:

  - You are about to drop the column `reviewerId` on the `TestAssignment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TestAssignment" DROP CONSTRAINT "TestAssignment_reviewerId_fkey";

-- AlterTable
ALTER TABLE "TestAssignment" DROP COLUMN "reviewerId";

-- CreateTable
CREATE TABLE "_reviewer" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_reviewer_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_reviewer_B_index" ON "_reviewer"("B");

-- AddForeignKey
ALTER TABLE "_reviewer" ADD CONSTRAINT "_reviewer_A_fkey" FOREIGN KEY ("A") REFERENCES "TestAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_reviewer" ADD CONSTRAINT "_reviewer_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
