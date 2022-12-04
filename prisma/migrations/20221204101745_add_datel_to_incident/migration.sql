/*
  Warnings:

  - Added the required column `datel_id` to the `incidents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `incidents` ADD COLUMN `datel_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_datel_id_fkey` FOREIGN KEY (`datel_id`) REFERENCES `Datel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
