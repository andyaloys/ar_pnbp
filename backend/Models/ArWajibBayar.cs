using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_wajib_bayar")]
    public class ArWajibBayar
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("jenis_identitas")]
        public string JenisIdentitas { get; set; } = "NPWP"; // NPWP / NIK

        [Required]
        [MaxLength(30)]
        [Column("nomor_identitas")]
        public string NomorIdentitas { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("nama_wajib_bayar")]
        public string NamaWajibBayar { get; set; } = string.Empty;

        [MaxLength(50)]
        [Column("badan_usaha")]
        public string? BadanUsaha { get; set; } // PT, CV, Koperasi, Perorangan

        [Column("alamat")]
        public string? Alamat { get; set; }

        [MaxLength(100)]
        [Column("kota_kabupaten")]
        public string? KotaKabupaten { get; set; }

        [MaxLength(100)]
        [Column("provinsi")]
        public string? Provinsi { get; set; }

        [MaxLength(50)]
        [Column("telepon")]
        public string? Telepon { get; set; }

        [MaxLength(100)]
        [Column("email")]
        public string? Email { get; set; }

        [MaxLength(150)]
        [Column("pic_nama")]
        public string? PicNama { get; set; }

        [MaxLength(50)]
        [Column("pic_kontak")]
        public string? PicKontak { get; set; }

        [Column("is_active")]
        public bool IsActive { get; set; } = true;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updated_at")]
        public DateTime? UpdatedAt { get; set; }
    }
}
