using System;

namespace ArManagement.Api.DTOs.Piutang
{
    public class CreatePiutangRequest
    {
        public string NomorDokumenPenetapan { get; set; } = string.Empty;
        public DateTime TanggalDokumen { get; set; }
        public DateTime TanggalJatuhTempo { get; set; }
        public int SatkerId { get; set; }
        public int WajibBayarId { get; set; }
        public int JenisPnbpId { get; set; }
        public int DokumenDasarId { get; set; }
        public decimal NilaiPokok { get; set; }
        public decimal NilaiDendaBunga { get; set; }
        public string? Keterangan { get; set; }
        public string CreatedBy { get; set; } = "system";
    }

    public class RecordPembayaranRequest
    {
        public decimal JumlahBayar { get; set; }
        public decimal AlokasiPokok { get; set; }
        public decimal AlokasiDenda { get; set; }
        public string? Ntpn { get; set; }
        public string? KodeBilling { get; set; }
        public string? BankPersepsi { get; set; }
        public string? MetodeBayar { get; set; }
        public DateTime TanggalBayar { get; set; }
        public string? Catatan { get; set; }
        public string CreatedBy { get; set; } = "operator";
    }

    public class RecordPenagihanRequest
    {
        public string JenisTindakan { get; set; } = "SP1"; // SP1, SP2, SP3, SOMASI, PENYERAHAN_PUPN
        public string NomorSurat { get; set; } = string.Empty;
        public DateTime TanggalSurat { get; set; }
        public DateTime TanggalJatuhTempoSurat { get; set; }
        public string? PejabatPenandatangan { get; set; }
        public string? Perihal { get; set; }
        public string StatusPengiriman { get; set; } = "TERKIRIM";
        public string? HasilTindakLanjut { get; set; }
        public string CreatedBy { get; set; } = "operator";
    }

    public class PiutangFilterDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 15;
        public int? SatkerId { get; set; }
        public int? WajibBayarId { get; set; }
        public string? Kualitas { get; set; }
        public string? Status { get; set; }
        public string? Search { get; set; }
    }
}
