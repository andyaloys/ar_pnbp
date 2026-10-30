using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_snapshot_detail")]
    public class ArSnapshotDetail
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("snapshot_id")]
        public int SnapshotId { get; set; }

        [ForeignKey("SnapshotId")]
        public ArSnapshotPeriodik? Snapshot { get; set; }

        [Column("piutang_id")]
        public long PiutangId { get; set; }

        [Column("satker_id")]
        public int SatkerId { get; set; }

        [Column("wajib_bayar_id")]
        public int WajibBayarId { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("nomor_dokumen_penetapan")]
        public string NomorDokumenPenetapan { get; set; } = string.Empty;

        [Column("saldo_piutang", TypeName = "decimal(18,2)")]
        public decimal SaldoPiutang { get; set; }

        [Column("umur_hari")]
        public int UmurHari { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("kualitas_piutang")]
        public string KualitasPiutang { get; set; } = "LANCAR";

        [Column("nilai_penyisihan", TypeName = "decimal(18,2)")]
        public decimal NilaiPenyisihan { get; set; } = 0.00m;
    }
}
