-- ==============================================================
-- 04_SEED_SAMPLE_PIUTANG.SQL
-- Sample Transaksi Piutang Lintas 15 Satker & Berbagai Umur Aging
-- ==============================================================

USE `pnbp_ar`;

-- 1. Tambah variasi Wajib Bayar
INSERT INTO `ar_wajib_bayar` (`jenis_identitas`, `nomor_identitas`, `nama_wajib_bayar`, `badan_usaha`, `alamat`, `kota_kabupaten`, `provinsi`, `email`, `pic_nama`) VALUES
('NPWP', '057890123456000', 'PT. Riau Pulp & Paper Indo', 'PT', 'Jl. Jenderal Sudirman No. 88', 'Kota Pekanbaru', 'Riau', 'finance@riaupaper.co.id', 'Rian Hidayat'),
('NPWP', '068901234567000', 'PT. Kaltim Mineral Resources', 'PT', 'Jl. Mulawarman Kav. 14', 'Kota Balikpapan', 'Kalimantan Timur', 'tax@kaltim-min.com', 'Siti Rahma'),
('NPWP', '079012345678000', 'PT. Sulsel Tambang Nikel', 'PT', 'Kawasan Industri Bantaeng', 'Kab. Bantaeng', 'Sulawesi Selatan', 'ar@sulselnikel.com', 'Andi Mappaseng'),
('NPWP', '080123456789000', 'PT. Papua Bio Mandiri', 'PT', 'Jl. Percetakan Negara No. 12', 'Kota Jayapura', 'Papua', 'finance@papuabio.id', 'Frans Kaisiepo')
ON DUPLICATE KEY UPDATE `nama_wajib_bayar` = VALUES(`nama_wajib_bayar`);

-- 2. Sample Data Piutang dengan Subquery IDs
INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000001', 'SK-PNBP/144/AMDAL/01/2026', '2026-09-15', '2026-11-15', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440301' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '013456789012000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424111' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_PNBP' LIMIT 1),
250000000.00, 0.00, 250000000.00, 0.00, 250000000.00, 0, 'LANCAR', 'AKTIF', 'BELUM_PENAGIHAN', 'Jasa Penilaian Dokumen AMDAL Semester II', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000001');

INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000002', 'SK-PNBP/144/LAB/02/2026', '2026-09-20', '2026-11-20', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440103' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '024567890123000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424112' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_PNBP' LIMIT 1),
85000000.00, 0.00, 85000000.00, 0.00, 85000000.00, 0, 'LANCAR', 'AKTIF', 'BELUM_PENAGIHAN', 'Pengujian Baku Mutu Air Limbah Industri', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000002');

INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000003', 'SK-PNBP/144/LB3/03/2026', '2026-08-01', '2026-10-05', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440401' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '035678901234000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424121' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_PNBP' LIMIT 1),
175000000.00, 3500000.00, 178500000.00, 50000000.00, 128500000.00, 25, 'LANCAR', 'AKTIF', 'BELUM_PENAGIHAN', 'Izin Pengelolaan Limbah B3 Reaktif', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000003');

INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000004', 'SK-DENDA/144/GAKKUM-SM/01/2026', '2026-06-10', '2026-08-10', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440502' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '057890123456000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424131' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_DENDA' LIMIT 1),
450000000.00, 18000000.00, 468000000.00, 100000000.00, 368000000.00, 81, 'KURANG_LANCAR', 'AKTIF', 'SP1', 'Sanksi Administratif Pencemaran Lahan Sawit', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000004');

INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000005', 'SPTNP/144/EMISI/02/2026', '2026-06-25', '2026-08-25', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440202' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '046789012345000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424113' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SPTNP' LIMIT 1),
60000000.00, 2400000.00, 62400000.00, 0.00, 62400000.00, 66, 'KURANG_LANCAR', 'AKTIF', 'SP1', 'Uji Emisi Cerobong PLTU Pembangkit', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000005');

INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000006', 'SK-DENDA/144/GAKKUM-KL/02/2025', '2025-11-15', '2026-01-15', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440504' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '068901234567000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424131' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_DENDA' LIMIT 1),
820000000.00, 65600000.00, 885600000.00, 200000000.00, 685600000.00, 288, 'DIRAGUKAN', 'AKTIF', 'SP2', 'Denda Pelanggaran Pembuangan Tailing Pertambangan', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000006');

INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000007', 'TGR/144/GAKKUM-SL/01/2025', '2025-10-01', '2025-12-01', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440505' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '079012345678000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424131' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'TGR' LIMIT 1),
1250000000.00, 150000000.00, 1400000000.00, 0.00, 1400000000.00, 333, 'DIRAGUKAN', 'AKTIF', 'SP3', 'Tuntutan Ganti Rugi Kerusakan Ekosistem Mangrove', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000007');

INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000008', 'PUTUSAN/144/GAKKUM-PP/01/2024', '2024-04-10', '2024-06-10', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440506' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '080123456789000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424131' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'PUTUSAN_PENGADILAN' LIMIT 1),
2300000000.00, 276000000.00, 2576000000.00, 0.00, 2576000000.00, 872, 'MACET', 'DILIMPAHKAN_PUPN', 'PENYERAHAN_PUPN', 'Berkas telah dilimpahkan ke Panitia Urusan Piutang Negara (PUPN) Jayapura', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000008');

INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000009', 'SK-PNBP/144/AMDAL/08/2026', '2026-05-01', '2026-07-01', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440301' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '024567890123000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424111' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_PNBP' LIMIT 1),
150000000.00, 0.00, 150000000.00, 150000000.00, 0.00, 0, 'LANCAR', 'LUNAS', 'BELUM_PENAGIHAN', 'Lunas via Setoran Bank Mandiri (NTPN: B87263158912)', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000009');
