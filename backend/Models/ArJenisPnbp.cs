using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_jenis_pnbp")]
    public class ArJenisPnbp
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("kode_akun")]
        public string KodeAkun { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("nama_layanan")]
        public string NamaLayanan { get; set; } = string.Empty;

        [MaxLength(255)]
        [Column("dasar_hukum")]
        public string? DasarHukum { get; set; }

        [MaxLength(50)]
        [Column("satuan")]
        public string? Satuan { get; set; }

        [Column("tarif_nominal", TypeName = "decimal(18,2)")]
        public decimal? TarifNominal { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;
    }
}
