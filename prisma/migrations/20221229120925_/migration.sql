/*
  Warnings:

  - The values [cek_list_by_wh,wh_done,return_by_ta,wh_decline] on the enum `incidents_status_tier_2` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `incidents` MODIFY `status_tier_1` ENUM('open', 'closed', 'mitra_done', 'return_to_mitra') NOT NULL DEFAULT 'open',
    MODIFY `status_tier_2` ENUM('open', 'mitra_done', 'closed_pekerjaan', 'return_by_tier_1') NULL;
