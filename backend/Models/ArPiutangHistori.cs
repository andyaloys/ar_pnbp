using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_piutang_histori")]
    public class ArPiutangHistori
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("piutang_id")]
        public long PiutangId { get; set; }

        [ForeignKey("PiutangId")]
        public ArPiutang? Piutang { get; set; }

        [Column("tanggal_transaksi")]
        public DateTime TanggalTransaksi { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(50)]
        [Column("jenis_mutasi")]
        public string JenisMutasi { get; set; } = string.Empty;

        [Column("saldo_awal", TypeName = "decimal(18,2)")]
        public decimal SaldoAwal { get; set; }

        [Column("mutasi_tambah", TypeName = "decimal(18,2)")]
        public decimal MutasiTambah { get; set; } = 0.00m;

        [Column("mutasi_kurang", TypeName = "decimal(18,2)")]
        public decimal MutasiKurang { get; set; } = 0.00m;

        [Column("saldo_akhir", TypeName = "decimal(18,2)")]
        public decimal SaldoAkhir { get; set; }

        [MaxLength(100)]
        [Column("referensi_dokumen")]
        public string? ReferensiDokumen { get; set; }

        [Column("catatan_alasan")]
        public string? CatatanAlasan { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("created_by")]
        public string CreatedBy { get; set; } = string.Empty;
    }
}
