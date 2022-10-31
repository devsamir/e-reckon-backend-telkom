/*
  Warnings:

  - You are about to alter the column `material_price_telkom` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `service_price_telkom` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `material_price_mitra` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.
  - You are about to alter the column `service_price_mitra` on the `items` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Int`.

*/
-- AlterTable
ALTER TABLE `items` MODIFY `material_price_telkom` INTEGER NOT NULL,
    MODIFY `service_price_telkom` INTEGER NOT NULL,
    MODIFY `material_price_mitra` INTEGER NOT NULL,
    MODIFY `service_price_mitra` INTEGER NOT NULL;
