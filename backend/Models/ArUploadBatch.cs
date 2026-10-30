using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_upload_batch")]
    public class ArUploadBatch
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Column("satker_id")]
        public int SatkerId { get; set; }

        [ForeignKey("SatkerId")]
        public ArSatker? Satker { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("nama_file_asli")]
        public string NamaFileAsli { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("file_path")]
        public string FilePath { get; set; } = string.Empty;

        [Column("total_baris")]
        public int TotalBaris { get; set; } = 0;

        [Column("baris_sukses")]
        public int BarisSukses { get; set; } = 0;

        [Column("baris_gagal")]
        public int BarisGagal { get; set; } = 0;

        [MaxLength(30)]
        [Column("status_proses")]
        public string StatusProses { get; set; } = "PROCESSED";

        [Column("total_nilai_piutang_impor", TypeName = "decimal(18,2)")]
        public decimal TotalNilaiPiutangImpor { get; set; } = 0.00m;

        [Required]
        [MaxLength(100)]
        [Column("uploaded_by")]
        public string UploadedBy { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ArUploadBatchDetail> Details { get; set; } = new List<ArUploadBatchDetail>();
    }
}
