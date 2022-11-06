-- AlterTable
ALTER TABLE `incidents` ADD COLUMN `status_tier_1` ENUM('open', 'closed') NOT NULL DEFAULT 'open',
    ADD COLUMN `status_tier_2` ENUM('open', 'closed_pekerjaan', 'cek_list_by_wh', 'wh_done') NULL,
    ADD COLUMN `status_tier_3` ENUM('open', 'closed_pekerjaan', 'cek_list_by_wh', 'wh_done') NULL,
    ADD COLUMN `status_wh` ENUM('open', 'return', 'closed') NULL;
