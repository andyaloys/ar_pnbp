using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_penagihan_log")]
    public class ArPenagihanLog
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
        [Column("jenis_tindakan")]
        public string JenisTindakan { get; set; } = "SP1"; // SP1, SP2, SP3, SOMASI, PENYERAHAN_PUPN

        [Required]
        [MaxLength(100)]
        [Column("nomor_surat")]
        public string NomorSurat { get; set; } = string.Empty;

        [Column("tanggal_surat")]
        public DateTime TanggalSurat { get; set; }

        [Column("tanggal_jatuh_tempo_surat")]
        public DateTime TanggalJatuhTempoSurat { get; set; }

        [MaxLength(150)]
        [Column("pejabat_penandatangan")]
        public string? PejabatPenandatangan { get; set; }

        [MaxLength(255)]
        [Column("perihal")]
        public string? Perihal { get; set; }

        [MaxLength(50)]
        [Column("status_pengiriman")]
        public string StatusPengiriman { get; set; } = "TERKIRIM"; // TERKIRIM, DITERIMA, KEMBALI_POS

        [Column("tanggal_diterima")]
        public DateTime? TanggalDiterima { get; set; }

        [MaxLength(150)]
        [Column("nama_penerima")]
        public string? NamaPenerima { get; set; }

        [Column("hasil_tindak_lanjut")]
        public string? HasilTindakLanjut { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("created_by")]
        public string CreatedBy { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ArPenagihanDokumen> Dokumens { get; set; } = new List<ArPenagihanDokumen>();
    }
}
