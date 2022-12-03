/*
  Warnings:

  - Added the required column `open_at` to the `incidents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `incidents` ADD COLUMN `open_at` DATETIME(3) NOT NULL;
