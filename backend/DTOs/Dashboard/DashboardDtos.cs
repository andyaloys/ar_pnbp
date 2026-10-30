namespace ArManagement.Api.DTOs.Dashboard
{
    public class DashboardSummaryDto
    {
        public decimal TotalPiutangBruto { get; set; }
        public decimal TotalTertagih { get; set; }
        public decimal TotalSaldoPiutang { get; set; }
        public decimal PiutangJatuhTempo { get; set; }
        public decimal RecoveryRate { get; set; }
        public decimal TotalPenyisihan { get; set; }
        public DashboardCountsDto Counts { get; set; } = new();
    }

    public class DashboardCountsDto
    {
        public int TotalDokumen { get; set; }
        public int Lunas { get; set; }
        public int Aktif { get; set; }
    }

    public class AgingMatrixItemDto
    {
        public string Label { get; set; } = string.Empty;
        public decimal Jumlah { get; set; }
        public int Count { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public class KualitasBreakdownItemDto
    {
        public string Kualitas { get; set; } = string.Empty;
        public decimal TotalSaldo { get; set; }
        public int JumlahDokumen { get; set; }
    }

    public class SatkerSummaryItemDto
    {
        public int SatkerId { get; set; }
        public string KodeSatker { get; set; } = string.Empty;
        public string NamaSatker { get; set; } = string.Empty;
        public decimal TotalPiutang { get; set; }
        public decimal TotalSaldo { get; set; }
        public decimal TotalTerbayar { get; set; }
        public int JumlahDokumen { get; set; }
        public decimal PiutangMacet { get; set; }
    }
}
