/*
  Warnings:

  - You are about to drop the `logincident` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `logincident`;

-- CreateTable
CREATE TABLE `log_incident` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `action_on` DATETIME(3) NOT NULL,
    `action_by` VARCHAR(191) NOT NULL,
    `action` INTEGER NOT NULL,
    `notes` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
