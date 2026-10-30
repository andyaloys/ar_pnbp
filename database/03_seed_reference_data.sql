-- ==============================================================
-- 03_SEED_REFERENCE_DATA.SQL
-- Seeding Data Master & Referensi Awal AR Management PNBP
-- ==============================================================

USE `pnbp_ar`;

-- 1. Parameter Kualitas Aging Piutang Negara (PMK 163/PMK.06/2020)
INSERT INTO `ar_kualitas_aging` (`kode_kualitas`, `nama_kualitas`, `min_hari`, `max_hari`, `syarat_tindakan`, `persen_penyisihan`, `warna_badge`, `urutan`) VALUES
('LANCAR', 'Lancar', 0, 30, 'Belum jatuh tempo s.d. 30 hari pasca jatuh tempo', 0.50, '#10b981', 1),
('KURANG_LANCAR', 'Kurang Lancar', 31, 90, 'Lewat 30 hari s.d. 90 hari, telah diterbitkan SP I', 10.00, '#3b82f6', 2),
('DIRAGUKAN', 'Diragukan', 91, 365, 'Lewat 90 hari s.d. 365 hari, telah diterbitkan SP II / SP III', 50.00, '#f59e0b', 3),
('MACET', 'Macet', 366, NULL, 'Lewat 365 hari atau telah diserahkan pengurusannya ke PUPN', 100.00, '#ef4444', 4)
ON DUPLICATE KEY UPDATE `nama_kualitas` = VALUES(`nama_kualitas`);

-- 2. Master Dokumen Sumber Penetapan
INSERT INTO `ar_dokumen_dasar` (`kode_dokumen`, `nama_dokumen`, `keterangan`) VALUES
('SK_PNBP', 'Surat Ketetapan PNBP Terutang', 'Penetapan resmi tagihan kewajiban PNBP'),
('SPTNP', 'Surat Penetapan Tarif dan Nilai PNBP', 'Penetapan tarif atas jasa layanan lingkungan hidup'),
('SK_DENDA', 'Surat Ketetapan Sanksi Denda Administratif', 'Denda atas keterlambatan atau pelanggaran'),
('TGR', 'Tuntutan Ganti Rugi / Penggantian Kerusakan', 'Ketetapan ganti rugi lingkungan hidup'),
('PUTUSAN_PENGADILAN', 'Salinan Putusan Pengadilan Berkekuatan Hukum Tetap', 'Kewajiban bayar hasil eksekusi putusan inkrah'),
('LHP_BPK', 'Rekomendasi Laporan Hasil Pemeriksaan BPK', 'Temuan kekurangan penerimaan kas negara')
ON DUPLICATE KEY UPDATE `nama_dokumen` = VALUES(`nama_dokumen`);

-- 3. Referensi Satker (15 Satker Prioritas KLH/BPLH)
INSERT INTO `ar_satker` (`kode_satker`, `nama_satker`, `unit_eselon`, `penanggung_jawab`, `is_prioritas`) VALUES
('1440101', 'Biro Perencanaan dan Keuangan Settama', 'Sekretariat Utama', 'Koordinator PNBP Pusat', TRUE),
('1440102', 'Pusat Data dan Informasi (Pusdatin)', 'Sekretariat Utama', 'Kabid Pengelolaan Sistem TI', TRUE),
('1440103', 'Pusat Standardisasi Instrumen Kualitas LH', 'Badan Standardisasi', 'Kasubbag Tata Usaha & Keuangan', TRUE),
('1440201', 'Direktorat Pengendalian Pencemaran Air', 'Ditjen PPKL', 'Bendahara Penerimaan', TRUE),
('1440202', 'Direktorat Pengendalian Pencemaran Udara', 'Ditjen PPKL', 'Bendahara Penerimaan', TRUE),
('1440301', 'Direktorat Penilaian AMDAL & Perizinan Lingkungan', 'Ditjen PKTL', 'Bendahara Penerimaan', TRUE),
('1440302', 'Direktorat Rencana Penggunaan Kawasan', 'Ditjen PKTL', 'Bendahara Penerimaan', TRUE),
('1440401', 'Direktorat Pengelolaan Sampah dan Limbah B3', 'Ditjen PSLB3', 'Bendahara Penerimaan', TRUE),
('1440402', 'Direktorat Pemulihan Lahan Terkontaminasi B3', 'Ditjen PSLB3', 'Bendahara Penerimaan', TRUE),
('1440501', 'Direktorat Pengawasan & Sanksi Administratif', 'Ditjen Gakkum', 'Bendahara Penerimaan', TRUE),
('1440502', 'Balai Gakkum Wilayah Sumatera', 'Ditjen Gakkum', 'Kaur Keuangan Satker', TRUE),
('1440503', 'Balai Gakkum Wilayah Jawa, Bali, Nusa Tenggara', 'Ditjen Gakkum', 'Kaur Keuangan Satker', TRUE),
('1440504', 'Balai Gakkum Wilayah Kalimantan', 'Ditjen Gakkum', 'Kaur Keuangan Satker', TRUE),
('1440505', 'Balai Gakkum Wilayah Sulawesi', 'Ditjen Gakkum', 'Kaur Keuangan Satker', TRUE),
('1440506', 'Balai Gakkum Wilayah Maluku dan Papua', 'Ditjen Gakkum', 'Kaur Keuangan Satker', TRUE)
ON DUPLICATE KEY UPDATE `nama_satker` = VALUES(`nama_satker`);

-- 4. Referensi Jenis PNBP Bidang Lingkungan Hidup
INSERT INTO `ar_jenis_pnbp` (`kode_akun`, `nama_layanan`, `dasar_hukum`, `satuan`) VALUES
('424111', 'Pendapatan Jasa Penilaian AMDAL dan Dokumen Lingkungan', 'PP No. 44 Tahun 2025', 'Per Dokumen'),
('424112', 'Pendapatan Jasa Laboratorium Pengujian Kualitas Lingkungan', 'PP No. 44 Tahun 2025', 'Per Sampel'),
('424113', 'Pendapatan Jasa Uji Emisi & Kalibrasi Peralatan Lingkungan', 'PP No. 44 Tahun 2025', 'Per Alat/Titik'),
('424121', 'Pendapatan Izin Pengelolaan Limbah B3 untuk Usaha/Jasa', 'PP No. 44 Tahun 2025', 'Per Izin/Rekomendasi'),
('424122', 'Pendapatan Denda Administratif Keterlambatan Pembayaran PNBP', 'PP No. 58 Tahun 2020', 'Persen Per Bulan'),
('424131', 'Pendapatan Denda Pelanggaran Pengendalian Pencemaran LH', 'UU No. 32 Tahun 2009', 'Ketetapan Sanksi')
ON DUPLICATE KEY UPDATE `nama_layanan` = VALUES(`nama_layanan`);

-- 5. Contoh Data Wajib Bayar Awal (Sample Master)
INSERT INTO `ar_wajib_bayar` (`jenis_identitas`, `nomor_identitas`, `nama_wajib_bayar`, `badan_usaha`, `alamat`, `kota_kabupaten`, `provinsi`, `email`, `pic_nama`) VALUES
('NPWP', '013456789012000', 'PT. Barito Agro Lestari', 'PT', 'Kawasan Industri Mitra Blok C-4', 'Kab. Kotawaringin Timur', 'Kalimantan Tengah', 'finance@baritoagro.co.id', 'Hendra Wijaya'),
('NPWP', '024567890123000', 'PT. Cipta Mineral Abadi', 'PT', 'Gedung Wisma Niaga Lt. 12, Kav. 55', 'Jakarta Selatan', 'DKI Jakarta', 'tax@ciptamineral.com', 'Dewi Susanti'),
('NPWP', '035678901234000', 'PT. Nusantara Chemical Tech', 'PT', 'Jl. Raya Industri Cilegon Km. 7', 'Kota Cilegon', 'Banten', 'ar@nusantarachem.com', 'Budi Santoso'),
('NPWP', '046789012345000', 'CV. Mandiri Jaya Environmental', 'CV', 'Jl. Sukarno Hatta No. 128', 'Kota Bandung', 'Jawa Barat', 'mandiri.env@gmail.com', 'Ahmad Fauzi')
ON DUPLICATE KEY UPDATE `nama_wajib_bayar` = VALUES(`nama_wajib_bayar`);
