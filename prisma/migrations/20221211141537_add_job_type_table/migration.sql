/*
  Warnings:

  - You are about to drop the column `job_type` on the `incidents` table. All the data in the column will be lost.
  - Added the required column `job_type_id` to the `incidents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `incidents` DROP COLUMN `job_type`,
    ADD COLUMN `job_type_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `JobType` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `JobType_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `incidents` ADD CONSTRAINT `incidents_job_type_id_fkey` FOREIGN KEY (`job_type_id`) REFERENCES `JobType`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
