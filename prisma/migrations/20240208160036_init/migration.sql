/*
  Warnings:

  - You are about to alter the column `nama_ujian` on the `ujian` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(30)`.
  - You are about to alter the column `keterangan` on the `ujian` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to drop the `guru` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `siswa` MODIFY `kelas_id` INTEGER NULL;

-- AlterTable
ALTER TABLE `ujian` MODIFY `nama_ujian` VARCHAR(30) NOT NULL,
    MODIFY `keterangan` VARCHAR(50) NOT NULL;

-- DropTable
DROP TABLE `guru`;

-- CreateTable
CREATE TABLE `admin` (
    `admin_id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(50) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `status_user` INTEGER NOT NULL,
    `user_agent` VARCHAR(200) NOT NULL,
    `profile_picture` VARCHAR(50) NOT NULL,
    `access_key` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`admin_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `permission_name` VARCHAR(255) NOT NULL,
    `created_at` DATE NULL,
    `updated_admin_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
