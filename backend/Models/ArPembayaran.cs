using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_pembayaran")]
    public class ArPembayaran
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("piutang_id")]
        public long PiutangId { get; set; }

        [ForeignKey("PiutangId")]
        public ArPiutang? Piutang { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("nomor_bukti_bayar")]
        public string NomorBuktiBayar { get; set; } = string.Empty;

        [Column("tanggal_bayar")]
        public DateTime TanggalBayar { get; set; }

        [Column("jumlah_bayar", TypeName = "decimal(18,2)")]
        public decimal JumlahBayar { get; set; }

        [Column("alokasi_pokok", TypeName = "decimal(18,2)")]
        public decimal AlokasiPokok { get; set; } = 0.00m;

        [Column("alokasi_denda", TypeName = "decimal(18,2)")]
        public decimal AlokasiDenda { get; set; } = 0.00m;

        [MaxLength(30)]
        [Column("ntpn")]
        public string? Ntpn { get; set; }

        [MaxLength(30)]
        [Column("kode_billing")]
        public string? KodeBilling { get; set; }

        [MaxLength(100)]
        [Column("bank_persepsi")]
        public string? BankPersepsi { get; set; }

        [MaxLength(50)]
        [Column("metode_bayar")]
        public string? MetodeBayar { get; set; }

        [Column("is_reconciled_simponi")]
        public bool IsReconciledSimponi { get; set; } = false;

        [Column("tanggal_rekonsiliasi")]
        public DateTime? TanggalRekonsiliasi { get; set; }

        [MaxLength(255)]
        [Column("bukti_setor_url")]
        public string? BuktiSetorUrl { get; set; }

        [MaxLength(20)]
        [Column("status_verifikasi")]
        public string StatusVerifikasi { get; set; } = "VERIFIED";

        [Column("catatan")]
        public string? Catatan { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("created_by")]
        public string CreatedBy { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
