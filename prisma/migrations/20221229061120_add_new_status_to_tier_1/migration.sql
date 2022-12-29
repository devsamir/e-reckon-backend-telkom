-- AlterTable
ALTER TABLE `incidents` MODIFY `status_tier_1` ENUM('open', 'closed', 'mitra_done') NOT NULL DEFAULT 'open',
    MODIFY `status_tier_2` ENUM('open', 'mitra_done', 'closed_pekerjaan', 'cek_list_by_wh', 'wh_done', 'return_by_ta', 'wh_decline') NULL;
