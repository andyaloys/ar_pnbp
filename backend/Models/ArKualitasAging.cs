using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_kualitas_aging")]
    public class ArKualitasAging
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("kode_kualitas")]
        public string KodeKualitas { get; set; } = string.Empty; // LANCAR, KURANG_LANCAR, DIRAGUKAN, MACET

        [Required]
        [MaxLength(50)]
        [Column("nama_kualitas")]
        public string NamaKualitas { get; set; } = string.Empty;

        [Column("min_hari")]
        public int MinHari { get; set; } = 0;

        [Column("max_hari")]
        public int? MaxHari { get; set; }

        [MaxLength(255)]
        [Column("syarat_tindakan")]
        public string? SyaratTindakan { get; set; }

        [Column("persen_penyisihan", TypeName = "decimal(5,2)")]
        public decimal PersenPenyisihan { get; set; } = 0.00m;

        [MaxLength(20)]
        [Column("warna_badge")]
        public string WarnaBadge { get; set; } = "#10b981";

        [Column("urutan")]
        public int Urutan { get; set; } = 1;

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
