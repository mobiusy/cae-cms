/*
  Warnings:

  - You are about to drop the `PageViewStatistics` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "UploadRecord" ADD COLUMN     "mimetype" TEXT,
ADD COLUMN     "originalname" TEXT,
ADD COLUMN     "size" INTEGER;

-- DropTable
DROP TABLE "PageViewStatistics";
