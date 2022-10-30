/*
  Warnings:

  - Made the column `material_designator` on table `items` required. This step will fail if there are existing NULL values in that column.
  - Made the column `service_designator` on table `items` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `items` MODIFY `material_designator` VARCHAR(100) NOT NULL,
    MODIFY `service_designator` VARCHAR(100) NOT NULL;
