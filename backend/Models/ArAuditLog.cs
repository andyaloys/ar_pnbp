using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_audit_logs")]
    public class ArAuditLog
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("user_id")]
        public string UserId { get; set; } = string.Empty;

        [MaxLength(150)]
        [Column("user_name")]
        public string? UserName { get; set; }

        [MaxLength(20)]
        [Column("satker_kode")]
        public string? SatkerKode { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("aksi")]
        public string Aksi { get; set; } = string.Empty; // CREATE, UPDATE, DELETE, BULK_UPLOAD

        [Required]
        [MaxLength(50)]
        [Column("entitas")]
        public string Entitas { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        [Column("entitas_id")]
        public string EntitasId { get; set; } = string.Empty;

        [Column("data_sebelum", TypeName = "json")]
        public string? DataSebelum { get; set; }

        [Column("data_sesudah", TypeName = "json")]
        public string? DataSesudah { get; set; }

        [MaxLength(50)]
        [Column("ip_address")]
        public string? IpAddress { get; set; }

        [MaxLength(255)]
        [Column("user_agent")]
        public string? UserAgent { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
