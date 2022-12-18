-- CreateTable
CREATE TABLE `Witel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,

    UNIQUE INDEX `Witel_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Datel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(30) NOT NULL,
    `witel_id` INTEGER NOT NULL,

    UNIQUE INDEX `Datel_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Datel` ADD CONSTRAINT `Datel_witel_id_fkey` FOREIGN KEY (`witel_id`) REFERENCES `Witel`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
