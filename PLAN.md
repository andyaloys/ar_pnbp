# RENCANA PENGEMBANGAN SISTEM AR MANAGEMENT PNBP
## (Accounts Receivable Management Enhancement - Lingkup KLH/BPLH 2026)

---

## 1. Arsitektur & Prinsip Sistem

1. **Aplikasi Terpisah (Standalone Subsystem)**
   - Berdiri sendiri di folder `c:\TI\NET\AR Management PNBP`, terpisah dari repositori `pnbp2`.
   - Menghilangkan risiko gangguan pada operasional billing dan layanan publik PNBP eksisting.
   
2. **Teknologi Identik dengan `pnbp2`**
   - **Frontend**: **Angular 20**, **PrimeNG 20**, **TailwindCSS**, **Chart.js / ngx-echarts**, **ExcelJS**, **jsPDF**.
   - **Backend**: **ASP.NET Core Web API (.NET 8.0)** dengan C#.
   
3. **Database Development (`109.123.235.50`)**
   - **DBMS**: MySQL / MariaDB (Port 3306).
   - **Skema Baru**: `pnbp_ar` (terpisah dari skema operasional `pnbp_stg`).
   - Mendukung *cross-schema read-only queries* ke tabel transaksi/billing `pnbp2` jika diperlukan rekonsiliasi.

4. **Karakter & Nuansa Tampilan (UI/UX)**
   - Struktur tata letak identik dengan `pnbp2` (*Sidebar*, *Header*, *Breadcrumb*, *Dynamic Filter*, *Data Table* PrimeNG).
   - **Pembeda Nuansa**: Menggunakan tema **Deep Navy & Slate Indigo** dengan aksen **Amber/Gold & Crimson** (merepresentasikan tata kelola piutang, status penagihan, dan *due date*).

---

## 2. Rincian Modul yang Akan Dibangun

### Modul 1: Dashboard Eksekutif & Analitik Aging Nasional
- **KPI Cards**: Total Piutang Bruto, Total Piutang Tertagih/Lunas, Piutang Jatuh Tempo, Rasio Pemulihan (*Recovery Rate*), Estimasi Penyisihan Piutang.
- **Visualisasi Aging Schedule Matrix**: Grafik batang komposisi umur piutang (*Belum Jatuh Tempo*, *1–30 hr*, *31–90 hr*, *91–180 hr*, *181–365 hr*, *>365 hr*).
- **Chart Kualitas Piutang**: Persentase *Lancar*, *Kurang Lancar*, *Diragukan*, *Macet* (PMK 163/2020).
- **Drill-Down Interaktif**: Nasional $\rightarrow$ Satker (15 Satker Prioritas) $\rightarrow$ Wajib Bayar $\rightarrow$ Rincian Dokumen Ketetapan.
- **Filter Cepat**: Berdasarkan Tahun Anggaran, Satker, Jenis PNBP, dan Kualitas Piutang.

### Modul 2: Master Data Piutang & Wajib Bayar
- **Master Wajib Bayar**: NPWP, NIK, Nama Perusahaan/Individu, Alamat, PIC/Kontak, Klasifikasi Usaha, validasi anti-duplikasi.
- **Master Satuan Kerja**: 15 Satker Prioritas, Kode Satker Kemenkeu, Unit Eselon, Penanggung Jawab Keuangan.
- **Master Referensi Tarif & Objek PNBP**: Terhubung dengan akun penerimaan negara bidang lingkungan hidup.
- **Master Dokumen Dasar**: SK Penetapan PNBP, SK Tuntutan Ganti Rugi, Putusan Pengadilan, Denda Keterlambatan.

### Modul 3: Pencatatan Piutang & Buku Pembantu (AR Ledger)
- **Form Perekaman Piutang**: No. Dokumen Penetapan, Tanggal Penetapan, Tanggal Jatuh Tempo, Satker Pemilik, Nilai Pokok, Denda/Bunga.
- **Fitur Unggah Massal (Bulk Upload Excel)**:
  - Format template Excel terstandar untuk 15 satker.
  - Validasi otomatis baris-per-baris di backend (cek format NPWP, tanggal, nilai, kode satker).
  - Laporan hasil impor: rincian baris sukses dan baris gagal beserta alasan error.
- **Pencatatan Pembayaran / Pelunasan**:
  - Pelunasan penuh maupun bertahap (angsuran).
  - Pencatatan NTPN, Nomor Billing SIMPONI, Tanggal Setor, Bank Persepsi.
- **Koreksi & Pembatalan**: Mekanisme koreksi saldo dengan *approval workflow* dan *audit reason*.

### Modul 4: Mesin Kalkulasi Aging & Klasifikasi Kualitas (PMK 163/2020)
- **Kalkulasi Umur Otomatis**: Menghitung selisih hari tanggal jatuh tempo terhadap tanggal *cut-off*.
- **Klasifikasi Kualitas Piutang Negara**:
  1. *Lancar*: Belum jatuh tempo s.d. 1 bulan pasca jatuh tempo.
  2. *Kurang Lancar*: Jatuh tempo > 1 bulan s.d. 3 bulan (telah diterbitkan SP I).
  3. *Diragukan*: Telah terbit SP II / belum dilunasi > 3 bulan s.d. 12 bulan.
  4. *Macet*: Telah diserahkan pengurusannya ke PUPN/DJKN atau > 12 bulan tanpa penyelesaian.
- **Simulasi & Snapshot Periodik**: Fitur *freeze snapshot* data piutang akhir bulan/semester/tahunan untuk kebutuhan audit BPK tanpa terpengaruh transaksi berjalan.

### Modul 5: Monitoring Penagihan & Tindak Lanjut
- **Perekaman Surat Tagihan Berjenjang**:
  - Penerbitan Surat Tagihan I (SP I).
  - Penerbitan Surat Peringatan II (SP II).
  - Penerbitan Surat Peringatan III (SP III).
  - Somasi, Klarifikasi, dan Berita Acara Pengakuan Hutang.
- **Pelacakan Status Khusus**:
  - Proses Keberatan / Permohonan Keringanan.
  - Perjanjian Angsuran (Jadwal cicilan & monitoring pembayaran).
  - Pelimpahan berkas pengurusan piutang macet ke **PUPN / DJKN**.
- **Digital Archive**: Unggah salinan PDF surat tagihan, tanda terima pos/ekspedisi, dan dokumen penagihan.
- **Early Warning System**: Notifikasi piutang yang mendekati atau telah melewati jatuh tempo.

### Modul 6: Pelaporan Keuangan & Ekspor
- **Laporan Mutasi Piutang**: Saldo Awal, Penambahan Piutang Baru, Pengurangan (Pelunasan/Koreksi), Saldo Akhir.
- **Laporan Rincian Umur Piutang (Aging Schedule)**: Format standar akuntansi pelaporan Kemenkeu.
- **Laporan Kualitas Piutang & Estimasi Penyisihan**.
- **Ekspor Dokumen**: Generator **Excel (.xlsx)** terformat rapi dan **PDF Siap Cetak**.

### Modul 7: Layanan Integrasi (SIMPONI & Prototype SAKTI)
- **Konektor SIMPONI**: Pengecekan otomatis status billing untuk rekonsiliasi pelunasan.
- **Prototype REST API SAKTI Kemenkeu (OpenAPI 3.0)**:
  - Endpoint penyedia data piutang untuk modul SAKTI Piutang dan Buku Besar (GL).
  - Keamanan dengan Bearer JWT / API Key dan rate limiting.
  - Audit logging seluruh aktivitas panggilan API.

### Modul 8: Manajemen Pengguna & Keamanan (RBAC)
- **Role-Based Access Control**:
  - *Super Admin (Pusdatin)*: Konfigurasi sistem, manajemen user, log audit.
  - *Pengelola Pusat (Biro Renkeu)*: Akses 15 satker nasional, approval penyesuaian, laporan nasional.
  - *Operator Satker (15 Satker)*: Akses terbatas hanya pada data satkernya sendiri.
  - *Auditor / Pimpinan*: Read-only viewer untuk dashboard eksekutif dan ekspor laporan.
- **Audit Trail**: Pencatatan riwayat setiap aksi perubahan data (*immutable log*).

---

## 3. Struktur Skema Database (`109.123.235.50` - `pnbp_ar`)

```
pnbp_ar
 ├── ar_wajib_bayar                 (Master Wajib Bayar / Debitur)
 ├── ar_satker                      (15 Satker Prioritas)
 ├── ar_jenis_pnbp                  (Referensi Jenis & Tarif PNBP)
 ├── ar_piutang                     (Tabel Utama Ketetapan Piutang)
 ├── ar_piutang_histori             (Log Perubahan Nilai & Mutasi)
 ├── ar_pembayaran                  (Riwayat Setoran/Pelunasan, NTPN, Billing)
 ├── ar_jadwal_angsuran             (Jadwal & Realisasi Cicilan)
 ├── ar_penagihan_log               (Riwayat SP 1, SP 2, SP 3, Somasi, dsb.)
 ├── ar_penagihan_dokumen           (Berkas Digital Surat & Bukti Penerimaan)
 ├── ar_kualitas_aging              (Parameter Batas Hari & Kualitas PMK 163)
 ├── ar_snapshot_periodik           (Snapshot Saldo Akhir Bulan/Tahun)
 ├── ar_upload_batch                (Header Batch Impor Excel Satker)
 ├── ar_upload_batch_detail         (Log Baris Validasi Impor)
 ├── ar_sakti_export_log            (Log Pertukaran Data SAKTI)
 └── ar_audit_logs                  (Log Aktivitas Pengguna)
```

---

## 4. Struktur Folder Repositori Proyek

```
c:\TI\NET\AR Management PNBP\
 ├── PLAN.md                               (Dokumen Rencana Ini)
 ├── dokumen\                              (KAK & Proposal Acuan)
 ├── backend\                              (ASP.NET Core Web API .NET 8.0)
 │    ├── Controllers\
 │    ├── Models\
 │    ├── Data\ (DbContext MySQL / MariaDB)
 │    ├── Services\ (Aging Engine, Excel Importer, Report Generator)
 │    └── appsettings.json
 ├── frontend\                             (Angular 20 + PrimeNG 20 + Tailwind)
 │    ├── src\
 │    │    ├── app\
 │    │    │    ├── layouts\ (Struktur serupa pnbp2)
 │    │    │    ├── features\ (dashboard, master, piutang, penagihan, laporan)
 │    │    │    └── shared\
 │    └── tailwind.config.js
 └── database\                             (Skrip DDL & Migrasi MySQL pnbp_ar)
      ├── 01_create_schema.sql
      ├── 02_create_tables.sql
      └── 03_seed_reference_data.sql
```

---

## 5. Pertanyaan & Konfirmasi Diskusi

1. **Kredensial Database `109.123.235.50`**:
   - Apakah user & password yang digunakan untuk membuat database/skema `pnbp_ar` sama dengan kredensial `pnbp2` (`root` / `2MinutesToMidnight#`), atau ada akun database lain?
2. **Prioritas Pengerjaan Awal**:
   - Apakah kita mulai dari pembuatan skrip DDL database `pnbp_ar` dan inisiasi project Backend (.NET 8.0) + Frontend (Angular 20)?
