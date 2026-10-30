using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_satker")]
    public class ArSatker
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("kode_satker")]
        public string KodeSatker { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("nama_satker")]
        public string NamaSatker { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("unit_eselon")]
        public string? UnitEselon { get; set; }

        [Column("alamat")]
        public string? Alamat { get; set; }

        [MaxLength(150)]
        [Column("penanggung_jawab")]
        public string? PenanggungJawab { get; set; }

        [MaxLength(50)]
        [Column("kontak_telepon")]
        public string? KontakTelepon { get; set; }

        [MaxLength(100)]
        [Column("email")]
        public string? Email { get; set; }

        [Column("is_prioritas")]
        public bool IsPrioritas { get; set; } = true;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
