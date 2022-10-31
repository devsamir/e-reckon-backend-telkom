-- AlterTable
ALTER TABLE `incident_details` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `incidents` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `items` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `mitra` MODIFY `update_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `unit` MODIFY `update_at` DATETIME(3) NULL;
