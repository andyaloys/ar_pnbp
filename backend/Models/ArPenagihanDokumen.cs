using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_penagihan_dokumen")]
    public class ArPenagihanDokumen
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("penagihan_log_id")]
        public long PenagihanLogId { get; set; }

        [ForeignKey("PenagihanLogId")]
        public ArPenagihanLog? PenagihanLog { get; set; }

        [Required]
        [MaxLength(255)]
        [Column("nama_dokumen")]
        public string NamaDokumen { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("file_path")]
        public string FilePath { get; set; } = string.Empty;

        [Column("file_size_bytes")]
        public long? FileSizeBytes { get; set; }

        [MaxLength(100)]
        [Column("mime_type")]
        public string? MimeType { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("uploaded_by")]
        public string UploadedBy { get; set; } = string.Empty;

        [Column("uploaded_at")]
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}
