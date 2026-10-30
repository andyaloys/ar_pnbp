-- ==============================================================
-- 02_CREATE_TABLES.SQL
-- DDL Seluruh Tabel Modul AR Management PNBP (pnbp_ar)
-- Standar Regulasi: PMK No. 163/PMK.06/2020 jo. PMK 150/PMK.06/2022
-- ==============================================================

USE `pnbp_ar`;

-- 1. Master Satuan Kerja (15 Satker Prioritas)
CREATE TABLE IF NOT EXISTS `ar_satker` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kode_satker` VARCHAR(20) NOT NULL UNIQUE,
    `nama_satker` VARCHAR(255) NOT NULL,
    `unit_eselon` VARCHAR(50) NULL,
    `alamat` TEXT NULL,
    `penanggung_jawab` VARCHAR(150) NULL,
    `kontak_telepon` VARCHAR(50) NULL,
    `email` VARCHAR(100) NULL,
    `is_prioritas` BOOLEAN NOT NULL DEFAULT TRUE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_satker_kode` (`kode_satker`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Master Wajib Bayar / Debitur PNBP
CREATE TABLE IF NOT EXISTS `ar_wajib_bayar` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `jenis_identitas` ENUM('NPWP', 'NIK', 'LAINNYA') NOT NULL DEFAULT 'NPWP',
    `nomor_identitas` VARCHAR(30) NOT NULL,
    `nama_wajib_bayar` VARCHAR(255) NOT NULL,
    `badan_usaha` VARCHAR(50) NULL, -- PT, CV, Koperasi, Perorangan
    `alamat` TEXT NULL,
    `kelurahan` VARCHAR(100) NULL,
    `kecamatan` VARCHAR(100) NULL,
    `kota_kabupaten` VARCHAR(100) NULL,
    `provinsi` VARCHAR(100) NULL,
    `kode_pos` VARCHAR(10) NULL,
    `telepon` VARCHAR(50) NULL,
    `email` VARCHAR(100) NULL,
    `pic_nama` VARCHAR(150) NULL,
    `pic_kontak` VARCHAR(50) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `uk_wajib_bayar_identitas` (`jenis_identitas`, `nomor_identitas`),
    INDEX `idx_wb_nama` (`nama_wajib_bayar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Referensi Jenis & Tarif PNBP Lingkungan Hidup
CREATE TABLE IF NOT EXISTS `ar_jenis_pnbp` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kode_akun` VARCHAR(20) NOT NULL, -- Kode Akun 424xxx / 411xxx
    `nama_layanan` VARCHAR(255) NOT NULL,
    `dasar_hukum` VARCHAR(255) NULL, -- PP No. Tarif
    `satuan` VARCHAR(50) NULL,
    `tarif_nominal` DECIMAL(18,2) NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_jenis_pnbp_akun` (`kode_akun`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Master Dokumen Sumber Penetapan
CREATE TABLE IF NOT EXISTS `ar_dokumen_dasar` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kode_dokumen` VARCHAR(30) NOT NULL UNIQUE,
    `nama_dokumen` VARCHAR(150) NOT NULL, -- SK Penetapan, SPTNP, SK Denda, Putusan Pengadilan, Rekomendasi BPK
    `keterangan` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Konfigurasi Parameter Aging & Kualitas Piutang (PMK 163/PMK.06/2020)
CREATE TABLE IF NOT EXISTS `ar_kualitas_aging` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kode_kualitas` VARCHAR(20) NOT NULL UNIQUE, -- LANCAR, KURANG_LANCAR, DIRAGUKAN, MACET
    `nama_kualitas` VARCHAR(50) NOT NULL,
    `min_hari` INT NOT NULL DEFAULT 0,
    `max_hari` INT NULL, -- NULL jika > 365 hari (tak terbatas)
    `syarat_tindakan` VARCHAR(255) NULL, -- Misal: 'Belum terbit SP1', 'Telah terbit SP1', 'PUPN'
    `persen_penyisihan` DECIMAL(5,2) NOT NULL DEFAULT 0.00, -- 0.5%, 10%, 50%, 100%
    `warna_badge` VARCHAR(20) NOT NULL DEFAULT '#10b981', -- Hex color untuk UI Badge
    `urutan` INT NOT NULL DEFAULT 1,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Tabel Utama: Ketetapan Piutang Negara (AR Ledger)
CREATE TABLE IF NOT EXISTS `ar_piutang` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `nomor_registrasi_piutang` VARCHAR(50) NOT NULL UNIQUE, -- Format Auto: AR-KLH/YYYY/XXXXXX
    `nomor_dokumen_penetapan` VARCHAR(100) NOT NULL,
    `tanggal_dokumen` DATE NOT NULL,
    `tanggal_jatuh_tempo` DATE NOT NULL,
    `satker_id` INT NOT NULL,
    `wajib_bayar_id` INT NOT NULL,
    `jenis_pnbp_id` INT NOT NULL,
    `dokumen_dasar_id` INT NOT NULL,
    `nilai_pokok` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `nilai_denda_bunga` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `total_piutang` DECIMAL(18,2) NOT NULL DEFAULT 0.00, -- Pokok + Denda
    `total_terbayar` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `saldo_piutang` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `umur_hari` INT NOT NULL DEFAULT 0,
    `kualitas_piutang` VARCHAR(20) NOT NULL DEFAULT 'LANCAR', -- LANCAR, KURANG_LANCAR, DIRAGUKAN, MACET
    `status_piutang` VARCHAR(30) NOT NULL DEFAULT 'AKTIF', -- AKTIF, LUNAS, KERINGANAN, ANGSURAN, DILIMPAHKAN_PUPN, HAPUS_BUKU
    `status_penagihan` VARCHAR(30) NOT NULL DEFAULT 'BELUM_PENAGIHAN', -- BELUM_PENAGIHAN, SP1, SP2, SP3, BERITA_ACARA, PUPN
    `tanggal_terakhir_penagihan` DATE NULL,
    `keterangan` TEXT NULL,
    `file_dokumen_penetapan_url` VARCHAR(255) NULL,
    `is_locked` BOOLEAN NOT NULL DEFAULT FALSE, -- Terkunci saat proses closing/snapshot
    `created_by` VARCHAR(100) NOT NULL,
    `updated_by` VARCHAR(100) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ar_piutang_satker` FOREIGN KEY (`satker_id`) REFERENCES `ar_satker` (`id`),
    CONSTRAINT `fk_ar_piutang_wb` FOREIGN KEY (`wajib_bayar_id`) REFERENCES `ar_wajib_bayar` (`id`),
    CONSTRAINT `fk_ar_piutang_jenis` FOREIGN KEY (`jenis_pnbp_id`) REFERENCES `ar_jenis_pnbp` (`id`),
    CONSTRAINT `fk_ar_piutang_dokdasar` FOREIGN KEY (`dokumen_dasar_id`) REFERENCES `ar_dokumen_dasar` (`id`),
    INDEX `idx_ar_piutang_jatuh_tempo` (`tanggal_jatuh_tempo`),
    INDEX `idx_ar_piutang_kualitas` (`kualitas_piutang`),
    INDEX `idx_ar_piutang_status` (`status_piutang`),
    INDEX `idx_ar_piutang_satker` (`satker_id`),
    INDEX `idx_ar_piutang_wb` (`wajib_bayar_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Histori Mutasi & Perubahan Saldo Piutang
CREATE TABLE IF NOT EXISTS `ar_piutang_histori` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `piutang_id` BIGINT NOT NULL,
    `tanggal_transaksi` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `jenis_mutasi` VARCHAR(50) NOT NULL, -- PENETAPAN_AWAL, PEMBAYARAN, DENDA_TAMBAHAN, KOREKSI_KURANG, KOREKSI_TAMBAH, PENGHAPUSAN
    `saldo_awal` DECIMAL(18,2) NOT NULL,
    `mutasi_tambah` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `mutasi_kurang` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `saldo_akhir` DECIMAL(18,2) NOT NULL,
    `referensi_dokumen` VARCHAR(100) NULL, -- No Surat / No Bukti
    `catatan_alasan` TEXT NULL,
    `created_by` VARCHAR(100) NOT NULL,
    CONSTRAINT `fk_histori_piutang` FOREIGN KEY (`piutang_id`) REFERENCES `ar_piutang` (`id`) ON DELETE CASCADE,
    INDEX `idx_histori_piutang_tgl` (`tanggal_transaksi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Perekaman Pembayaran & Rekonsiliasi SIMPONI
CREATE TABLE IF NOT EXISTS `ar_pembayaran` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `piutang_id` BIGINT NOT NULL,
    `nomor_bukti_bayar` VARCHAR(50) NOT NULL UNIQUE,
    `tanggal_bayar` DATE NOT NULL,
    `jumlah_bayar` DECIMAL(18,2) NOT NULL,
    `alokasi_pokok` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `alokasi_denda` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `ntpn` VARCHAR(30) NULL, -- Nomor Transaksi Penerimaan Negara dari SIMPONI
    `kode_billing` VARCHAR(30) NULL, -- Nomor Kode Billing SIMPONI
    `bank_persepsi` VARCHAR(100) NULL,
    `metode_bayar` VARCHAR(50) NULL, -- TELLER, ATM, INTERNET_BANKING, EDC
    `is_reconciled_simponi` BOOLEAN NOT NULL DEFAULT FALSE,
    `tanggal_rekonsiliasi` DATETIME NULL,
    `bukti_setor_url` VARCHAR(255) NULL,
    `status_verifikasi` VARCHAR(20) NOT NULL DEFAULT 'VERIFIED', -- PENDING, VERIFIED, REJECTED
    `catatan` TEXT NULL,
    `created_by` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_bayar_piutang` FOREIGN KEY (`piutang_id`) REFERENCES `ar_piutang` (`id`),
    INDEX `idx_bayar_ntpn` (`ntpn`),
    INDEX `idx_bayar_billing` (`kode_billing`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Jadwal Angsuran / Restrukturisasi Pembayaran
CREATE TABLE IF NOT EXISTS `ar_jadwal_angsuran` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `piutang_id` BIGINT NOT NULL,
    `nomor_perjanjian_angsuran` VARCHAR(100) NOT NULL,
    `angsuran_ke` INT NOT NULL,
    `total_angsuran` INT NOT NULL,
    `tanggal_jatuh_tempo` DATE NOT NULL,
    `nilai_pokok_angsuran` DECIMAL(18,2) NOT NULL,
    `nilai_bunga_angsuran` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `total_tagihan_angsuran` DECIMAL(18,2) NOT NULL,
    `total_terbayar` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `status_angsuran` VARCHAR(20) NOT NULL DEFAULT 'BELUM_LUNAS', -- BELUM_LUNAS, LUNAS, KETERLAMBATAN
    `tanggal_lunas` DATE NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_angsuran_piutang` FOREIGN KEY (`piutang_id`) REFERENCES `ar_piutang` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Log Upaya Penagihan (SP 1, SP 2, SP 3, Somasi, Pelimpahan PUPN)
CREATE TABLE IF NOT EXISTS `ar_penagihan_log` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `piutang_id` BIGINT NOT NULL,
    `jenis_tindakan` VARCHAR(50) NOT NULL, -- SP1, SP2, SP3, SOMASI, PANGGILAN, KLARIFIKASI, PENYERAHAN_PUPN
    `nomor_surat` VARCHAR(100) NOT NULL,
    `tanggal_surat` DATE NOT NULL,
    `tanggal_jatuh_tempo_surat` DATE NOT NULL,
    `pejabat_penandatangan` VARCHAR(150) NULL,
    `perihal` VARCHAR(255) NULL,
    `status_pengiriman` VARCHAR(50) NOT NULL DEFAULT 'TERKIRIM', -- TERKIRIM, DITERIMA, KEMBALI_POS, MENOLAK
    `tanggal_diterima` DATE NULL,
    `nama_penerima` VARCHAR(150) NULL,
    `hasil_tindak_lanjut` TEXT NULL,
    `created_by` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_penagihan_piutang` FOREIGN KEY (`piutang_id`) REFERENCES `ar_piutang` (`id`) ON DELETE CASCADE,
    INDEX `idx_penagihan_no_surat` (`nomor_surat`),
    INDEX `idx_penagihan_jenis` (`jenis_tindakan`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Dokumen Lampiran Surat Penagihan & Berita Acara
CREATE TABLE IF NOT EXISTS `ar_penagihan_dokumen` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `penagihan_log_id` BIGINT NOT NULL,
    `nama_dokumen` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_size_bytes` BIGINT NULL,
    `mime_type` VARCHAR(100) NULL,
    `uploaded_by` VARCHAR(100) NOT NULL,
    `uploaded_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_dok_penagihan` FOREIGN KEY (`penagihan_log_id`) REFERENCES `ar_penagihan_log` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Batch Impor / Unggah Massal Excel Satker
CREATE TABLE IF NOT EXISTS `ar_upload_batch` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `satker_id` INT NOT NULL,
    `nama_file_asli` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `total_baris` INT NOT NULL DEFAULT 0,
    `baris_sukses` INT NOT NULL DEFAULT 0,
    `baris_gagal` INT NOT NULL DEFAULT 0,
    `status_proses` VARCHAR(30) NOT NULL DEFAULT 'PROCESSED', -- UPLOADED, PROCESSING, COMPLETED, FAILED
    `total_nilai_piutang_impor` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `uploaded_by` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_batch_satker` FOREIGN KEY (`satker_id`) REFERENCES `ar_satker` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Detail Validasi Unggah Massal Excel (Error Baris per Baris)
CREATE TABLE IF NOT EXISTS `ar_upload_batch_detail` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `upload_batch_id` INT NOT NULL,
    `nomor_baris` INT NOT NULL,
    `data_raw_json` TEXT NULL,
    `is_success` BOOLEAN NOT NULL DEFAULT TRUE,
    `error_message` TEXT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_detail_batch` FOREIGN KEY (`upload_batch_id`) REFERENCES `ar_upload_batch` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Freeze Snapshot Periodik untuk Pelaporan Audit
CREATE TABLE IF NOT EXISTS `ar_snapshot_periodik` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama_snapshot` VARCHAR(100) NOT NULL, -- Misal: Closing Semester I 2026, Closing Tahunan 2026
    `tahun_anggaran` INT NOT NULL,
    `periode` ENUM('BULANAN', 'SEMESTER_1', 'SEMESTER_2', 'TAHUNAN') NOT NULL,
    `tanggal_cut_off` DATE NOT NULL,
    `total_piutang_bruto` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `total_lancar` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `total_kurang_lancar` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `total_diragukan` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `total_macet` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `total_penyisihan` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    `status_kunci` BOOLEAN NOT NULL DEFAULT TRUE,
    `generated_by` VARCHAR(100) NOT NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_snapshot_tahun` (`tahun_anggaran`, `periode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. Detail Piutang pada Snapshot
CREATE TABLE IF NOT EXISTS `ar_snapshot_detail` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `snapshot_id` INT NOT NULL,
    `piutang_id` BIGINT NOT NULL,
    `satker_id` INT NOT NULL,
    `wajib_bayar_id` INT NOT NULL,
    `nomor_dokumen_penetapan` VARCHAR(100) NOT NULL,
    `saldo_piutang` DECIMAL(18,2) NOT NULL,
    `umur_hari` INT NOT NULL,
    `kualitas_piutang` VARCHAR(20) NOT NULL,
    `nilai_penyisihan` DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT `fk_snap_header` FOREIGN KEY (`snapshot_id`) REFERENCES `ar_snapshot_periodik` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. Log Pertukaran Data Integrasi SAKTI
CREATE TABLE IF NOT EXISTS `ar_sakti_export_log` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `request_id` VARCHAR(100) NOT NULL UNIQUE,
    `endpoint_called` VARCHAR(255) NOT NULL,
    `method` VARCHAR(10) NOT NULL, -- GET, POST
    `filter_payload` TEXT NULL,
    `record_count` INT NOT NULL DEFAULT 0,
    `status_code` INT NOT NULL DEFAULT 200,
    `response_summary` TEXT NULL,
    `consumer_system` VARCHAR(100) NOT NULL DEFAULT 'SAKTI_GATEWAY',
    `ip_address` VARCHAR(50) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. Audit Trail Sistem (Immutable Logging)
CREATE TABLE IF NOT EXISTS `ar_audit_logs` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` VARCHAR(100) NOT NULL,
    `user_name` VARCHAR(150) NULL,
    `satker_kode` VARCHAR(20) NULL,
    `aksi` VARCHAR(50) NOT NULL, -- CREATE, UPDATE, DELETE, BULK_UPLOAD, APPROVE, REJECT
    `entitas` VARCHAR(50) NOT NULL, -- ar_piutang, ar_pembayaran, ar_penagihan_log
    `entitas_id` VARCHAR(50) NOT NULL,
    `data_sebelum` JSON NULL,
    `data_sesudah` JSON NULL,
    `ip_address` VARCHAR(50) NULL,
    `user_agent` VARCHAR(255) NULL,
    `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_audit_waktu` (`created_at`),
    INDEX `idx_audit_user` (`user_id`),
    INDEX `idx_audit_entitas` (`entitas`, `entitas_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
