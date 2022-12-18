-- AlterTable
ALTER TABLE `jobtype` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `created_by` INTEGER NULL,
    ADD COLUMN `delete_at` DATETIME(3) NULL,
    ADD COLUMN `deleted_by` INTEGER NULL,
    ADD COLUMN `update_at` DATETIME(3) NULL,
    ADD COLUMN `updated_by` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `JobType` ADD CONSTRAINT `JobType_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobType` ADD CONSTRAINT `JobType_updated_by_fkey` FOREIGN KEY (`updated_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `JobType` ADD CONSTRAINT `JobType_deleted_by_fkey` FOREIGN KEY (`deleted_by`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
