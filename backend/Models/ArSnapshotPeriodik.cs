using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_snapshot_periodik")]
    public class ArSnapshotPeriodik
    {
        [Key]
        [Column("id")]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nama_snapshot")]
        public string NamaSnapshot { get; set; } = string.Empty;

        [Column("tahun_anggaran")]
        public int TahunAnggaran { get; set; }

        [Required]
        [MaxLength(30)]
        [Column("periode")]
        public string Periode { get; set; } = "TAHUNAN"; // BULANAN, SEMESTER_1, SEMESTER_2, TAHUNAN

        [Column("tanggal_cut_off")]
        public DateTime TanggalCutOff { get; set; }

        [Column("total_piutang_bruto", TypeName = "decimal(18,2)")]
        public decimal TotalPiutangBruto { get; set; }

        [Column("total_lancar", TypeName = "decimal(18,2)")]
        public decimal TotalLancar { get; set; }

        [Column("total_kurang_lancar", TypeName = "decimal(18,2)")]
        public decimal TotalKurangLancar { get; set; }

        [Column("total_diragukan", TypeName = "decimal(18,2)")]
        public decimal TotalDiragukan { get; set; }

        [Column("total_macet", TypeName = "decimal(18,2)")]
        public decimal TotalMacet { get; set; }

        [Column("total_penyisihan", TypeName = "decimal(18,2)")]
        public decimal TotalPenyisihan { get; set; }

        [Column("status_kunci")]
        public bool StatusKunci { get; set; } = true;

        [Required]
        [MaxLength(100)]
        [Column("generated_by")]
        public string GeneratedBy { get; set; } = string.Empty;

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<ArSnapshotDetail> Details { get; set; } = new List<ArSnapshotDetail>();
    }
}
