-- ==============================================================
-- 07_UPDATE_PASSWORDS.SQL
-- Update Password Pengguna AR Management PNBP
-- 1. superadmin -> SuperAdmin123!
-- 2. user lainnya -> P@ssw0rd
-- ==============================================================

USE `pnbp_ar`;

-- 1. Update Password Superadmin ('SuperAdmin123!')
-- Hash SHA-256 = 'd357150517d3e65ae84985f7b705ad99fdc38372a22ecea0cecaf8aaf820a249'
UPDATE `ar_users` 
SET `password_hash` = 'd357150517d3e65ae84985f7b705ad99fdc38372a22ecea0cecaf8aaf820a249',
    `updated_at` = NOW()
WHERE `username` = 'superadmin';

-- 2. Update Password Semua Pengguna Selain Superadmin ('P@ssw0rd')
-- Hash SHA-256 = 'b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342'
UPDATE `ar_users` 
SET `password_hash` = 'b03ddf3ca2e714a6548e7495e2a03f5e824eaac9837cd7f159c67b90fb4b7342',
    `updated_at` = NOW()
WHERE `username` <> 'superadmin';
