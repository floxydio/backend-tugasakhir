-- CreateTable
CREATE TABLE `absen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `guru_id` INTEGER NOT NULL,
    `pelajaran_id` INTEGER NOT NULL,
    `kelas_id` INTEGER NOT NULL,
    `keterangan` VARCHAR(255) NULL,
    `reason` VARCHAR(255) NULL,
    `day` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `time` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guru` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `mengajar` VARCHAR(255) NOT NULL,
    `status_guru` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `guru_users` (
    `id` INTEGER NOT NULL,
    `nama` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status_user` INTEGER NOT NULL DEFAULT 0,
    `status_role` INTEGER NOT NULL DEFAULT 0,
    `user_agent` VARCHAR(255) NULL,
    `profile_pic` VARCHAR(255) NOT NULL DEFAULT 'default.jpg',
    `notelp` INTEGER NOT NULL DEFAULT 0,
    `kelas_id` INTEGER NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jumlah` (
    `id` INTEGER NOT NULL,
    `nomor_kelas` VARCHAR(255) NOT NULL,
    `wali_kelas` VARCHAR(255) NOT NULL,
    `jam_kelas` VARCHAR(255) NOT NULL
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wali` VARCHAR(255) NOT NULL,
    `nomor` INTEGER NOT NULL,
    `jumlah_orang` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `nilai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uts` INTEGER NOT NULL,
    `uas` INTEGER NOT NULL,
    `kelas_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `semester` INTEGER NOT NULL,
    `pelajaran_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelajaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `guru_id` INTEGER NOT NULL,
    `kelas_id` INTEGER NOT NULL,
    `jadwal` INTEGER NOT NULL,
    `jam` VARCHAR(255) NOT NULL,
    `createdAt` DATE NOT NULL,
    `updatedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `status_user` INTEGER NOT NULL DEFAULT 0,
    `status_role` INTEGER NOT NULL DEFAULT 0,
    `user_agent` VARCHAR(255) NULL,
    `profile_pic` VARCHAR(255) NOT NULL DEFAULT 'default.jpg',
    `notelp` INTEGER NOT NULL DEFAULT 0,
    `kelas_id` INTEGER NULL,

    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `todo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ujian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_ujian` VARCHAR(255) NOT NULL,
    `tanggal` DATE NOT NULL,
    `mata_pelajaran` INTEGER NOT NULL,
    `durasi` INTEGER NOT NULL,
    `soal` LONGTEXT NOT NULL,
    `essay` LONGTEXT NOT NULL,
    `jam_mulai` VARCHAR(255) NOT NULL,
    `keterangan` VARCHAR(255) NOT NULL,
    `status_ujian` INTEGER NOT NULL DEFAULT 0,
    `total_soal` INTEGER NOT NULL,
    `kelas_id` INTEGER NOT NULL,
    `createdAt` DATE NOT NULL,
    `updatedAt` DATE NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `absen_guru` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `day` INTEGER NOT NULL,
    `month` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `time` VARCHAR(255) NOT NULL,
    `keterangan` VARCHAR(255) NOT NULL,
    `sakit_keterangan` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `jawaban_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `jawaban_pg` TEXT NULL,
    `jawaban_essay` TEXT NULL,
    `ujian_id` INTEGER NOT NULL,
    `total_benar` INTEGER NOT NULL,
    `total_salah` INTEGER NOT NULL,
    `log_history` TEXT NULL,
    `submittedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_ujian` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ujian_data` VARCHAR(255) NOT NULL,
    `soal_jawaban` TEXT NOT NULL,
    `user_id` INTEGER NOT NULL,
    `createdAt` DATE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `role_user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` INTEGER NOT NULL,
    `menu_name` VARCHAR(255) NOT NULL,
    `status_menu` INTEGER NOT NULL DEFAULT 0,
    `url_path` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
