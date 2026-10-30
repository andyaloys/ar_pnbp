using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_upload_batch_detail")]
    public class ArUploadBatchDetail
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Column("upload_batch_id")]
        public int UploadBatchId { get; set; }

        [ForeignKey("UploadBatchId")]
        public ArUploadBatch? UploadBatch { get; set; }

        [Column("nomor_baris")]
        public int NomorBaris { get; set; }

        [Column("data_raw_json")]
        public string? DataRawJson { get; set; }

        [Column("is_success")]
        public bool IsSuccess { get; set; } = true;

        [Column("error_message")]
        public string? ErrorMessage { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
