-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('admin', 'mitra', 'commerce', 'wh', 'telkom', 'tl', 'first_tier') NOT NULL;
