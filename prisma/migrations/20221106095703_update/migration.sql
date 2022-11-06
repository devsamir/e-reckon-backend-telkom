/*
  Warnings:

  - A unique constraint covering the columns `[incident_code]` on the table `incidents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `incidents_incident_code_key` ON `incidents`(`incident_code`);
