-- AlterTable
ALTER TABLE `incidents` MODIFY `on_tier` ENUM('tier_1', 'tier_2', 'tier_3', 'wh', 'commerce') NOT NULL DEFAULT 'tier_1';
