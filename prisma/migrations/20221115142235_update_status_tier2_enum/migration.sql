-- AlterTable
ALTER TABLE `incidents` MODIFY `status_tier_2` ENUM('open', 'closed_pekerjaan', 'cek_list_by_wh', 'wh_done', 'return_by_ta', 'wh_decline') NULL;
