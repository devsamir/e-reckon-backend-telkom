/*
  Warnings:

  - You are about to drop the column `created_by` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `user` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `User_username_key` ON `user`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `created_by`,
    DROP COLUMN `updated_by`,
    ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `mitra` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shortname` VARCHAR(15) NOT NULL,
    `fullname` VARCHAR(100) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `delete_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `item_code` VARCHAR(100) NOT NULL,
    `material_designator` VARCHAR(100) NULL,
    `service_designator` VARCHAR(100) NULL,
    `unit` VARCHAR(30) NOT NULL,
    `material_price_telkom` DECIMAL(65, 30) NOT NULL,
    `service_price_telkom` DECIMAL(65, 30) NOT NULL,
    `material_price_mitra` DECIMAL(65, 30) NOT NULL,
    `service_price_mitra` DECIMAL(65, 30) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `delete_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,
    `deleted_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incidents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `incident_code` VARCHAR(30) NOT NULL,
    `incident` VARCHAR(100) NOT NULL,
    `summary` TEXT NOT NULL,
    `job_type` VARCHAR(30) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT false,
    `on_tier` ENUM('tier_1', 'tier_2', 'tier_3', 'wh') NOT NULL DEFAULT 'tier_1',
    `assigned_mitra` INTEGER NOT NULL,
    `closed_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incident_details` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `incident_id` INTEGER NOT NULL,
    `item_id` INTEGER NOT NULL,
    `job_detail` TEXT NULL,
    `qty` INTEGER NOT NULL,
    `approve_wh` ENUM('not_yet', 'approved', 'decline') NOT NULL DEFAULT 'not_yet',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `created_by` INTEGER NULL,
    `updated_by` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LogIncident` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action_on` DATETIME(3) NOT NULL,
    `action_by` VARCHAR(191) NOT NULL,
    `action` INTEGER NOT NULL,
    `notes` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mitra` ADD CONSTRAINT `mitra_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mitra` ADD CONSTRAINT `mitra_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mitra` ADD CONSTRAINT `mitra_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `items` ADD CONSTRAINT `items_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_assigned_mitra_fkey` FOREIGN KEY (`assigned_mitra`) REFERENCES `mitra`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident_details` ADD CONSTRAINT `incident_details_incident_id_fkey` FOREIGN KEY (`incident_id`) REFERENCES `incidents`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident_details` ADD CONSTRAINT `incident_details_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident_details` ADD CONSTRAINT `incident_details_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `incident_details` ADD CONSTRAINT `incident_details_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
