/*
  Warnings:

  - You are about to drop the column `guru_id` on the `absen` table. All the data in the column will be lost.
  - You are about to drop the column `kelas_id` on the `absen` table. All the data in the column will be lost.
  - You are about to drop the column `pelajaran_id` on the `absen` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `guru_users` table. All the data in the column will be lost.
  - You are about to drop the column `kelas_id` on the `guru_users` table. All the data in the column will be lost.
  - You are about to drop the column `status_role` on the `guru_users` table. All the data in the column will be lost.
  - You are about to alter the column `nama` on the `guru_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `username` on the `guru_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(20)`.
  - You are about to alter the column `password` on the `guru_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `user_agent` on the `guru_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(200)`.
  - You are about to alter the column `profile_pic` on the `guru_users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - The primary key for the `jawaban_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `jawaban_user` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `jawaban_user` table. All the data in the column will be lost.
  - The primary key for the `kelas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `kelas` table. All the data in the column will be lost.
  - You are about to drop the column `nomor` on the `kelas` table. All the data in the column will be lost.
  - You are about to drop the column `wali` on the `kelas` table. All the data in the column will be lost.
  - You are about to drop the column `soal_jawaban` on the `log_ujian` table. All the data in the column will be lost.
  - You are about to drop the column `ujian_data` on the `log_ujian` table. All the data in the column will be lost.
  - The primary key for the `pelajaran` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `pelajaran` table. All the data in the column will be lost.
  - You are about to alter the column `nama` on the `pelajaran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `jam` on the `pelajaran` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(10)`.
  - The primary key for the `ujian` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ujian` table. All the data in the column will be lost.
  - You are about to drop the column `mata_pelajaran` on the `ujian` table. All the data in the column will be lost.
  - You are about to alter the column `nama_ujian` on the `ujian` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `jam_mulai` on the `ujian` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(10)`.
  - You are about to alter the column `keterangan` on the `ujian` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to drop the `jumlah` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `guru_id` to the `guru_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jawaban_user_id` to the `jawaban_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `siswa_id` to the `jawaban_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guru_id` to the `kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelas_id` to the `kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomor_kelas` to the `kelas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `log` to the `log_ujian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pelajaran_id` to the `pelajaran` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pelajaran_id` to the `ujian` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ujian_id` to the `ujian` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `absen` DROP COLUMN `guru_id`,
    DROP COLUMN `kelas_id`,
    DROP COLUMN `pelajaran_id`;

-- AlterTable
ALTER TABLE `guru_users` DROP COLUMN `id`,
    DROP COLUMN `kelas_id`,
    DROP COLUMN `status_role`,
    ADD COLUMN `guru_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nama` VARCHAR(50) NOT NULL,
    MODIFY `username` VARCHAR(20) NOT NULL,
    MODIFY `password` VARCHAR(100) NOT NULL,
    MODIFY `user_agent` VARCHAR(200) NULL,
    MODIFY `profile_pic` VARCHAR(50) NOT NULL DEFAULT 'default.jpg',
    MODIFY `notelp` VARCHAR(12) NOT NULL DEFAULT '0',
    ADD PRIMARY KEY (`guru_id`);

-- AlterTable
ALTER TABLE `jawaban_user` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `user_id`,
    ADD COLUMN `jawaban_user_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `semester` INTEGER NULL,
    ADD COLUMN `siswa_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`jawaban_user_id`);

-- AlterTable
ALTER TABLE `kelas` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `nomor`,
    DROP COLUMN `wali`,
    ADD COLUMN `guru_id` INTEGER NOT NULL,
    ADD COLUMN `kelas_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `nomor_kelas` VARCHAR(10) NOT NULL,
    ADD PRIMARY KEY (`kelas_id`);

-- AlterTable
ALTER TABLE `log_ujian` DROP COLUMN `soal_jawaban`,
    DROP COLUMN `ujian_data`,
    ADD COLUMN `log` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `pelajaran` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `pelajaran_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nama` VARCHAR(50) NOT NULL,
    MODIFY `jam` VARCHAR(10) NOT NULL,
    ADD PRIMARY KEY (`pelajaran_id`);

-- AlterTable
ALTER TABLE `ujian` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    DROP COLUMN `mata_pelajaran`,
    ADD COLUMN `pelajaran_id` INTEGER NOT NULL,
    ADD COLUMN `semester` INTEGER NULL,
    ADD COLUMN `ujian_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `nama_ujian` VARCHAR(50) NOT NULL,
    MODIFY `jam_mulai` VARCHAR(10) NOT NULL,
    MODIFY `keterangan` VARCHAR(100) NOT NULL,
    ADD PRIMARY KEY (`ujian_id`);

-- DropTable
DROP TABLE `jumlah`;

-- DropTable
DROP TABLE `users`;

-- CreateTable
CREATE TABLE `siswa` (
    `siswa_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `username` VARCHAR(20) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `status_user` INTEGER NOT NULL DEFAULT 0,
    `user_agent` VARCHAR(200) NULL,
    `profile_pic` VARCHAR(50) NOT NULL DEFAULT 'default.jpg',
    `notelp` VARCHAR(12) NOT NULL DEFAULT '0',
    `kelas_id` INTEGER NOT NULL,

    UNIQUE INDEX `username`(`username`),
    INDEX `kelas_id`(`kelas_id`),
    PRIMARY KEY (`siswa_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `user_id` ON `absen`(`user_id`);

-- CreateIndex
CREATE INDEX `user_id` ON `jawaban_user`(`siswa_id`);

-- CreateIndex
CREATE INDEX `ujian_id` ON `jawaban_user`(`ujian_id`);

-- CreateIndex
CREATE INDEX `guru_user_id` ON `kelas`(`guru_id`);

-- CreateIndex
CREATE INDEX `user_id` ON `log_ujian`(`user_id`);

-- CreateIndex
CREATE INDEX `kelas_id` ON `pelajaran`(`kelas_id`);

-- CreateIndex
CREATE INDEX `pelajaran_ibfk_1` ON `pelajaran`(`guru_id`);

-- CreateIndex
CREATE INDEX `mata_pelajaran` ON `ujian`(`pelajaran_id`);

-- CreateIndex
CREATE INDEX `kelas_id` ON `ujian`(`kelas_id`);

-- AddForeignKey
ALTER TABLE `absen` ADD CONSTRAINT `absen_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `siswa`(`siswa_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `kelas` ADD CONSTRAINT `kelas_ibfk_1` FOREIGN KEY (`guru_id`) REFERENCES `guru_users`(`guru_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pelajaran` ADD CONSTRAINT `pelajaran_ibfk_1` FOREIGN KEY (`guru_id`) REFERENCES `guru_users`(`guru_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `pelajaran` ADD CONSTRAINT `pelajaran_ibfk_2` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`kelas_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ujian` ADD CONSTRAINT `ujian_ibfk_1` FOREIGN KEY (`pelajaran_id`) REFERENCES `pelajaran`(`pelajaran_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `ujian` ADD CONSTRAINT `ujian_ibfk_2` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`kelas_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `jawaban_user` ADD CONSTRAINT `jawaban_user_ibfk_1` FOREIGN KEY (`siswa_id`) REFERENCES `siswa`(`siswa_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `jawaban_user` ADD CONSTRAINT `jawaban_user_ibfk_2` FOREIGN KEY (`ujian_id`) REFERENCES `ujian`(`ujian_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `log_ujian` ADD CONSTRAINT `log_ujian_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `siswa`(`siswa_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `siswa` ADD CONSTRAINT `siswa_ibfk_1` FOREIGN KEY (`kelas_id`) REFERENCES `kelas`(`kelas_id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
