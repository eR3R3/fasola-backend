/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Test` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED');

-- AlterTable
ALTER TABLE "MiniTest" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "Test" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "TestAssignment" (
    "id" SERIAL NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedTime" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "testId" INTEGER NOT NULL,
    "status" "TestStatus" NOT NULL DEFAULT 'PENDING',
    "score" DOUBLE PRECISION,

    CONSTRAINT "TestAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MiniTestToQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MiniTestToQuestion_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MiniTestToTest" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MiniTestToTest_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MiniTestToQuestion_B_index" ON "_MiniTestToQuestion"("B");

-- CreateIndex
CREATE INDEX "_MiniTestToTest_B_index" ON "_MiniTestToTest"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Test_name_key" ON "Test"("name");

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestAssignment" ADD CONSTRAINT "TestAssignment_testId_fkey" FOREIGN KEY ("testId") REFERENCES "Test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MiniTestToQuestion" ADD CONSTRAINT "_MiniTestToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "MiniTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MiniTestToQuestion" ADD CONSTRAINT "_MiniTestToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MiniTestToTest" ADD CONSTRAINT "_MiniTestToTest_A_fkey" FOREIGN KEY ("A") REFERENCES "MiniTest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MiniTestToTest" ADD CONSTRAINT "_MiniTestToTest_B_fkey" FOREIGN KEY ("B") REFERENCES "Test"("id") ON DELETE CASCADE ON UPDATE CASCADE;
