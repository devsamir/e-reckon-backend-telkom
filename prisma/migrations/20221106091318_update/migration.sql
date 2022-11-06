-- DropForeignKey
ALTER TABLE `incidents` DROP FOREIGN KEY `incidents_assigned_mitra_fkey`;

-- AlterTable
ALTER TABLE `incidents` MODIFY `assigned_mitra` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_assigned_mitra_fkey` FOREIGN KEY (`assigned_mitra`) REFERENCES `mitra`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
