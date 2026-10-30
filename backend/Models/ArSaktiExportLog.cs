using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models
{
    [Table("ar_sakti_export_log")]
    public class ArSaktiExportLog
    {
        [Key]
        [Column("id")]
        public long Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("request_id")]
        public string RequestId { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("endpoint_called")]
        public string EndpointCalled { get; set; } = string.Empty;

        [Required]
        [MaxLength(10)]
        [Column("method")]
        public string Method { get; set; } = "GET";

        [Column("filter_payload")]
        public string? FilterPayload { get; set; }

        [Column("record_count")]
        public int RecordCount { get; set; }

        [Column("status_code")]
        public int StatusCode { get; set; } = 200;

        [Column("response_summary")]
        public string? ResponseSummary { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("consumer_system")]
        public string ConsumerSystem { get; set; } = "SAKTI_GATEWAY";

        [MaxLength(50)]
        [Column("ip_address")]
        public string? IpAddress { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
