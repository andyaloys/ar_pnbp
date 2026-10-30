using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_dokumen_dasar")]
    public class ArDokumenDasar
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(30)]
        [Column("kode_dokumen")]
        public string KodeDokumen { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        [Column("nama_dokumen")]
        public string NamaDokumen { get; set; } = string.Empty;

        [Column("keterangan")]
        public string? Keterangan { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
