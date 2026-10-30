-- ==============================================================
-- 06_CREATE_USERS_TABLES.SQL
-- Skema Tabel Pengguna & Hak Akses (RBAC) AR Management PNBP 2026
-- ==============================================================

USE `pnbp_ar`;

-- 1. Tabel Master Roles
CREATE TABLE IF NOT EXISTS `ar_roles` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `role_code` VARCHAR(50) NOT NULL UNIQUE,
    `role_name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Tabel Pengguna (Users)
CREATE TABLE IF NOT EXISTS `ar_users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `nip` VARCHAR(30) NULL,
    `telepon` VARCHAR(30) NULL,
    `role_id` INT NOT NULL,
    `satker_id` INT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `last_login_at` DATETIME NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_user_role` FOREIGN KEY (`role_id`) REFERENCES `ar_roles` (`id`),
    CONSTRAINT `fk_user_satker` FOREIGN KEY (`satker_id`) REFERENCES `ar_satker` (`id`) ON DELETE SET NULL,
    INDEX `idx_user_username` (`username`),
    INDEX `idx_user_email` (`email`),
    INDEX `idx_user_role` (`role_id`),
    INDEX `idx_user_satker` (`satker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Seed Master Roles
INSERT INTO `ar_roles` (`id`, `role_code`, `role_name`, `description`) VALUES
(1, 'SUPERADMIN', 'Super Administrator', 'Akses penuh administrasi sistem, API OpenAPI, dan security audit'),
(2, 'ADMIN_PUSAT', 'Pengelola PNBP Pusat', 'Biro Renkeu Settama - Pengawasan nasional, approval penagihan, dan integrasi SAKTI'),
(3, 'OPERATOR_SATKER', 'Operator Satker', 'Petugas keuangan di 15 Satker Prioritas - Perekaman piutang & setoran NTPN'),
(4, 'EKSEKUTIF', 'Pimpinan / Eksekutif', 'Menteri, Wamen, Sestama, Karo Keuangan - Pemantauan dashboard eksekutif')
ON DUPLICATE KEY UPDATE `role_name` = VALUES(`role_name`), `description` = VALUES(`description`);

-- 4. Seed Akun Default Pengguna (Password standar demo: 'Admin@12345' menggunakan hash SHA-256)
-- Hash untuk 'Admin@12345' = '6f2cb9dd8f4b65e24e1c3f3fa5bc57982349237f11abceacd45bbcb74d621c25'
INSERT INTO `ar_users` (`id`, `username`, `password_hash`, `full_name`, `email`, `nip`, `role_id`, `satker_id`, `is_active`) VALUES
(1, 'superadmin', '6f2cb9dd8f4b65e24e1c3f3fa5bc57982349237f11abceacd45bbcb74d621c25', 'Administrator Pusdatin', 'pusdatin.admin@menlhk.go.id', '198501152008121001', 1, 1, TRUE),
(2, 'admin.pusat', '6f2cb9dd8f4b65e24e1c3f3fa5bc57982349237f11abceacd45bbcb74d621c25', 'Kaur Pengelolaan Piutang PNBP', 'ar.pusat@menlhk.go.id', '198704202010121002', 2, 1, TRUE),
(3, 'operator.gakkum', '6f2cb9dd8f4b65e24e1c3f3fa5bc57982349237f11abceacd45bbcb74d621c25', 'Petugas Keuangan Balai Gakkum Sumatera', 'keu.gakkum.sm@menlhk.go.id', '199208142015031003', 3, (SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440502' LIMIT 1), TRUE),
(4, 'pimpinan', '6f2cb9dd8f4b65e24e1c3f3fa5bc57982349237f11abceacd45bbcb74d621c25', 'Kepala Biro Perencanaan & Keuangan', 'karo.keuangan@menlhk.go.id', '197503121998031001', 4, 1, TRUE)
ON DUPLICATE KEY UPDATE `password_hash` = VALUES(`password_hash`), `full_name` = VALUES(`full_name`), `email` = VALUES(`email`);
