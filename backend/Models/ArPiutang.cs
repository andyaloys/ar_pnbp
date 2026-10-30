using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_piutang")]
    public class ArPiutang
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("nomor_registrasi_piutang")]
        public string NomorRegistrasiPiutang { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("nomor_dokumen_penetapan")]
        public string NomorDokumenPenetapan { get; set; } = string.Empty;

        [Column("tanggal_dokumen")]
        public DateTime TanggalDokumen { get; set; }

        [Column("tanggal_jatuh_tempo")]
        public DateTime TanggalJatuhTempo { get; set; }

        [Column("satker_id")]
        public int SatkerId { get; set; }

        [ForeignKey("SatkerId")]
        public ArSatker? Satker { get; set; }

        [Column("wajib_bayar_id")]
        public int WajibBayarId { get; set; }

        [ForeignKey("WajibBayarId")]
        public ArWajibBayar? WajibBayar { get; set; }

        [Column("jenis_pnbp_id")]
        public int JenisPnbpId { get; set; }

        [ForeignKey("JenisPnbpId")]
        public ArJenisPnbp? JenisPnbp { get; set; }

        [Column("dokumen_dasar_id")]
        public int DokumenDasarId { get; set; }

        [ForeignKey("DokumenDasarId")]
        public ArDokumenDasar? DokumenDasar { get; set; }

        [Column("nilai_pokok", TypeName = "decimal(18,2)")]
        public decimal NilaiPokok { get; set; } = 0.00m;

        [Column("nilai_denda_bunga", TypeName = "decimal(18,2)")]
        public decimal NilaiDendaBunga { get; set; } = 0.00m;

        [Column("total_piutang", TypeName = "decimal(18,2)")]
        public decimal TotalPiutang { get; set; } = 0.00m;

        [Column("total_terbayar", TypeName = "decimal(18,2)")]
        public decimal TotalTerbayar { get; set; } = 0.00m;

        [Column("saldo_piutang", TypeName = "decimal(18,2)")]
        public decimal SaldoPiutang { get; set; } = 0.00m;

        [Column("umur_hari")]
        public int UmurHari { get; set; } = 0;

        [MaxLength(20)]
        [Column("kualitas_piutang")]
        public string KualitasPiutang { get; set; } = "LANCAR";

        [MaxLength(30)]
        [Column("status_piutang")]
        public string StatusPiutang { get; set; } = "AKTIF"; // AKTIF, LUNAS, KERINGANAN, ANGSURAN, DILIMPAHKAN_PUPN

        [MaxLength(30)]
        [Column("status_penagihan")]
        public string StatusPenagihan { get; set; } = "BELUM_PENAGIHAN"; // BELUM_PENAGIHAN, SP1, SP2, SP3, PUPN

        [Column("tanggal_terakhir_penagihan")]
        public DateTime? TanggalTerakhirPenagihan { get; set; }

        [Column("keterangan")]
        public string? Keterangan { get; set; }

        [MaxLength(255)]
        [Column("file_dokumen_penetapan_url")]
        public string? FileDokumenPenetapanUrl { get; set; }

        [Column("is_locked")]
        public bool IsLocked { get; set; } = false;

        [Required]
        [MaxLength(100)]
        [Column("created_by")]
        public string CreatedBy { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("updated_by")]
        public string? UpdatedBy { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }

        public ICollection<ArPembayaran> Pembayarans { get; set; } = new List<ArPembayaran>();
        public ICollection<ArPenagihanLog> PenagihanLogs { get; set; } = new List<ArPenagihanLog>();
        public ICollection<ArPiutangHistori> Historis { get; set; } = new List<ArPiutangHistori>();
    }
}
