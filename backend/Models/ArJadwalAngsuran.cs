using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_jadwal_angsuran")]
    public class ArJadwalAngsuran
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("piutang_id")]
        public long PiutangId { get; set; }

        [ForeignKey("PiutangId")]
        public ArPiutang? Piutang { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nomor_perjanjian_angsuran")]
        public string NomorPerjanjianAngsuran { get; set; } = string.Empty;

        [Column("angsuran_ke")]
        public int AngsuranKe { get; set; }

        [Column("total_angsuran")]
        public int TotalAngsuran { get; set; }

        [Column("tanggal_jatuh_tempo")]
        public DateTime TanggalJatuhTempo { get; set; }

        [Column("nilai_pokok_angsuran", TypeName = "decimal(18,2)")]
        public decimal NilaiPokokAngsuran { get; set; }

        [Column("nilai_bunga_angsuran", TypeName = "decimal(18,2)")]
        public decimal NilaiBungaAngsuran { get; set; } = 0.00m;

        [Column("total_tagihan_angsuran", TypeName = "decimal(18,2)")]
        public decimal TotalTagihanAngsuran { get; set; }

        [Column("total_terbayar", TypeName = "decimal(18,2)")]
        public decimal TotalTerbayar { get; set; } = 0.00m;

        [MaxLength(20)]
        [Column("status_angsuran")]
        public string StatusAngsuran { get; set; } = "BELUM_LUNAS"; // BELUM_LUNAS, LUNAS, KETERLAMBATAN

        [Column("tanggal_lunas")]
        public DateTime? TanggalLunas { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
