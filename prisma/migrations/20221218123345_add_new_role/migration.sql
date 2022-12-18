-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('admin', 'mitra', 'commerce', 'wh', 'telkom', 'tl') NOT NULL;
