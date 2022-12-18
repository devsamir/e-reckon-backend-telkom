/*
  Warnings:

  - You are about to drop the column `level` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `mitra` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `role` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `incidents` DROP FOREIGN KEY `incidents_assigned_mitra_fkey`;

-- DropForeignKey
ALTER TABLE `mitra` DROP FOREIGN KEY `mitra_created_by_fkey`;

-- DropForeignKey
ALTER TABLE `mitra` DROP FOREIGN KEY `mitra_deleted_by_fkey`;

-- DropForeignKey
ALTER TABLE `mitra` DROP FOREIGN KEY `mitra_updated_by_fkey`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `level`,
    ADD COLUMN `role` ENUM('admin', 'mitra', 'commerce', 'wh', 'telkom') NOT NULL;

-- DropTable
DROP TABLE `mitra`;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_assigned_mitra_fkey` FOREIGN KEY (`assigned_mitra`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
