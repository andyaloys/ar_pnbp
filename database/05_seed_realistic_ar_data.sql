-- ==============================================================
-- 05_SEED_REALISTIC_AR_DATA.SQL
-- Penambahan Data Riil Piutang PNBP KLH/BPLH untuk Pengujian Sistem
-- ==============================================================

USE `pnbp_ar`;

-- 1. Tambah Wajib Bayar Tambahan
INSERT INTO `ar_wajib_bayar` (`jenis_identitas`, `nomor_identitas`, `nama_wajib_bayar`, `badan_usaha`, `alamat`, `kota_kabupaten`, `provinsi`, `email`, `pic_nama`) VALUES
('NPWP', '011223344556000', 'PT. Barito Pasifik Energi', 'PT', 'Wisma Barito Pacific Tower B', 'Kota Jakarta Barat', 'DKI Jakarta', 'tax@barito.co.id', 'Hendro Kusuma'),
('NPWP', '022334455667000', 'PT. Vale Indonesia Tbk (Site Sorowako)', 'PT', 'Kawasan Pertambangan Sorowako', 'Kab. Luwu Timur', 'Sulawesi Selatan', 'finance.sorowako@vale.com', 'Nurul Annisa'),
('NPWP', '033445566778000', 'PT. Semen Padang Industri', 'PT', 'Jl. Raya Indarung', 'Kota Padang', 'Sumatera Barat', 'accounting@semenpadang.co.id', 'Budi Santoso'),
('NPWP', '044556677889000', 'PT. Indo Tambangraya Megah', 'PT', 'Pondok Indah Office Tower 3', 'Kota Jakarta Selatan', 'DKI Jakarta', 'ar.corpo@itmg.co.id', 'Dewi Lestari'),
('NPWP', '055667788990000', 'PT. Aneka Kimia Raya Corporindo', 'PT', 'Jl. Panjang No. 5 Kebon Jeruk', 'Kota Jakarta Barat', 'DKI Jakarta', 'pnbp.finance@akr.co.id', 'Fajar Pratama'),
('NPWP', '066778899001000', 'PT. Pupuk Sriwidjaja Palembang', 'PT', 'Jl. Mayor Zen', 'Kota Palembang', 'Sumatera Selatan', 'keuangan@pusri.co.id', 'M. Rizky Pratama'),
('NPWP', '077889900112000', 'PT. Pelabuhan Indonesia (Persero) Regional IV', 'BUMN', 'Jl. Soekarno No. 1', 'Kota Makassar', 'Sulawesi Selatan', 'ar.pnbp@pelindo.co.id', 'Sitti Syamsiah'),
('NPWP', '088990011223000', 'PT. Krakatau Posco', 'PT', 'Kawasan Industri Krakatau', 'Kota Cilegon', 'Banten', 'finance.legal@krakatauposco.co.id', 'Kim Jin-Woo / Agus Setiawan')
ON DUPLICATE KEY UPDATE `nama_wajib_bayar` = VALUES(`nama_wajib_bayar`);

-- 2. Tambah Data Piutang Beragam
-- Record 009: AMDAL PT Barito Pasifik (LANCAR, baru terbit)
INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000009', 'SK-PNBP/144/AMDAL/09/2026', '2026-10-01', '2026-12-01', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440301' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '011223344556000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424111' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_PNBP' LIMIT 1),
320000000.00, 0.00, 320000000.00, 0.00, 320000000.00, 0, 'LANCAR', 'AKTIF', 'BELUM_PENAGIHAN', 'Biaya Penilaian Dokumen AMDAL Pembangunan PLTS', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000009');

-- Record 010: Uji Lab Air PT Semen Padang (LANCAR, Jatuh tempo dekat)
INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000010', 'SK-PNBP/144/LAB/10/2026', '2026-09-05', '2026-11-05', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440103' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '033445566778000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424112' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_PNBP' LIMIT 1),
95000000.00, 0.00, 95000000.00, 0.00, 95000000.00, 0, 'LANCAR', 'AKTIF', 'BELUM_PENAGIHAN', 'Uji Emisi Cerobong Pabrik Semen Indarung', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000010');

-- Record 011: Limbah B3 PT Pupuk Sriwidjaja (KURANG LANCAR, Umur 45 hari, SP1)
INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000011', 'SK-PNBP/144/LB3/11/2026', '2026-07-15', '2026-09-15', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440401' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '066778899001000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424121' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_PNBP' LIMIT 1),
240000000.00, 4800000.00, 244800000.00, 50000000.00, 194800000.00, 45, 'KURANG_LANCAR', 'AKTIF', 'SP1', 'Izin Rekomendasi Pemanfaatan Limbah Amoniak', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000011');

-- Record 012: Denda Gakkum PT Vale Indonesia (DIRAGUKAN, Umur 150 hari, SP2)
INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000012', 'SK-DENDA/144/GAKKUM-SL/02/2026', '2026-04-01', '2026-06-01', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440505' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '022334455667000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424131' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_DENDA' LIMIT 1),
650000000.00, 39000000.00, 689000000.00, 100000000.00, 589000000.00, 151, 'DIRAGUKAN', 'AKTIF', 'SP2', 'Sanksi Keterlambatan Pelaporan RKL-RPL Tambang Nikel', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000012');

-- Record 013: Denda Pelanggaran Emisi PT Krakatau Posco (DIRAGUKAN, Umur 210 hari, SP3)
INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000013', 'SK-DENDA/144/GAKKUM-JW/01/2026', '2026-02-01', '2026-04-01', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440503' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '088990011223000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424131' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_DENDA' LIMIT 1),
1100000000.00, 99000000.00, 1199000000.00, 200000000.00, 999000000.00, 212, 'DIRAGUKAN', 'AKTIF', 'SP3', 'Sanksi Administratif Baku Mutu Emisi Peleburan Baja', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000013');

-- Record 014: TGR Kerusakan Mangrove PT Indo Tambangraya (MACET, Umur 420 hari, Dilimpahkan PUPN)
INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000014', 'TGR/144/GAKKUM-KL/01/2025', '2025-07-01', '2025-09-01', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440504' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '044556677889000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424131' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'TGR' LIMIT 1),
1850000000.00, 222000000.00, 2072000000.00, 0.00, 2072000000.00, 424, 'MACET', 'DILIMPAHKAN_PUPN', 'PENYERAHAN_PUPN', 'Pelimpahan Pengurusan Piutang Macet ke KPKNL Samarinda', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000014');

-- Record 015: Jasa Lab Balai Lab Lingkungan PT AKR (LUNAS, NTPN Lengkap)
INSERT INTO `ar_piutang` 
(`nomor_registrasi_piutang`, `nomor_dokumen_penetapan`, `tanggal_dokumen`, `tanggal_jatuh_tempo`, `satker_id`, `wajib_bayar_id`, `jenis_pnbp_id`, `dokumen_dasar_id`, `nilai_pokok`, `nilai_denda_bunga`, `total_piutang`, `total_terbayar`, `saldo_piutang`, `umur_hari`, `kualitas_piutang`, `status_piutang`, `status_penagihan`, `keterangan`, `created_by`)
SELECT
'AR-KLH/2026/000015', 'SK-PNBP/144/LAB/15/2026', '2026-08-10', '2026-09-10', 
(SELECT id FROM `ar_satker` WHERE `kode_satker` = '1440103' LIMIT 1),
(SELECT id FROM `ar_wajib_bayar` WHERE `nomor_identitas` = '055667788990000' LIMIT 1),
(SELECT id FROM `ar_jenis_pnbp` WHERE `kode_akun` = '424112' LIMIT 1),
(SELECT id FROM `ar_dokumen_dasar` WHERE `kode_dokumen` = 'SK_PNBP' LIMIT 1),
145000000.00, 0.00, 145000000.00, 145000000.00, 0.00, 0, 'LANCAR', 'LUNAS', 'SELESAI', 'Pengujian Mutu Tangki Timbun Bahan Kimia - Lunas MPN G3', 'admin_satker'
WHERE NOT EXISTS (SELECT 1 FROM `ar_piutang` WHERE `nomor_registrasi_piutang` = 'AR-KLH/2026/000015');

-- 3. Catat Pembayaran untuk Piutang yang telah dibayar
INSERT INTO `ar_pembayaran` 
(`piutang_id`, `nomor_bukti_bayar`, `ntpn`, `kode_billing`, `tanggal_bayar`, `jumlah_bayar`, `bank_persepsi`, `metode_bayar`, `status_verifikasi`, `catatan`, `created_by`)
SELECT 
p.id, 'PAY-KLH/2026/100004', '8847AB99C1283F41', '8202609151234567', '2026-09-08', 145000000.00, 'Bank Mandiri', 'TELLER', 'VERIFIED', 'Pelunasan Penuh Jasa Lab Lingkungan Hidup', 'operator_keuangan'
FROM `ar_piutang` p WHERE p.`nomor_registrasi_piutang` = 'AR-KLH/2026/000015'
AND NOT EXISTS (SELECT 1 FROM `ar_pembayaran` WHERE `ntpn` = '8847AB99C1283F41');

INSERT INTO `ar_pembayaran` 
(`piutang_id`, `nomor_bukti_bayar`, `ntpn`, `kode_billing`, `tanggal_bayar`, `jumlah_bayar`, `bank_persepsi`, `metode_bayar`, `status_verifikasi`, `catatan`, `created_by`)
SELECT 
p.id, 'PAY-KLH/2026/100005', '9912CD44E5671A22', '8202609207654321', '2026-09-22', 50000000.00, 'Bank BNI', 'INTERNET_BANKING', 'VERIFIED', 'Setoran Angsuran Pertama Denda Limbah B3', 'operator_keuangan'
FROM `ar_piutang` p WHERE p.`nomor_registrasi_piutang` = 'AR-KLH/2026/000011'
AND NOT EXISTS (SELECT 1 FROM `ar_pembayaran` WHERE `ntpn` = '9912CD44E5671A22');
