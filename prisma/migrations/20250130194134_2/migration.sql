/*
  Warnings:

  - You are about to drop the column `clubName` on the `MiniClub` table. All the data in the column will be lost.
  - You are about to drop the column `clubName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `miniClubName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `positionName` on the `User` table. All the data in the column will be lost.
  - Added the required column `clubId` to the `MiniClub` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "MiniClub" DROP CONSTRAINT "MiniClub_clubName_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clubName_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_miniClubName_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_positionName_fkey";

-- AlterTable
ALTER TABLE "MiniClub" DROP COLUMN "clubName",
ADD COLUMN     "clubId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "clubName",
DROP COLUMN "miniClubName",
DROP COLUMN "positionName",
ADD COLUMN     "clubId" INTEGER,
ADD COLUMN     "miniClubId" INTEGER,
ADD COLUMN     "positionId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_miniClubId_fkey" FOREIGN KEY ("miniClubId") REFERENCES "MiniClub"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_positionId_fkey" FOREIGN KEY ("positionId") REFERENCES "Position"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MiniClub" ADD CONSTRAINT "MiniClub_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
