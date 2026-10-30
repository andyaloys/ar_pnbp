using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArManagement.Api.Data;
using ArManagement.Api.Models;

namespace ArManagement.Api.Services.Sakti
{
    public class SaktiIntegrationService : ISaktiIntegrationService
    {
        private readonly ArDbContext _context;

        public SaktiIntegrationService(ArDbContext context)
        {
            _context = context;
        }

        public async Task<(string RequestId, IEnumerable<object> Data)> GetPosisiPiutangAsync(string? kodeSatker, int? tahun, string? kualitas, string clientIp)
        {
            var reqId = "REQ-SAKTI-" + Guid.NewGuid().ToString("N")[..12].ToUpper();

            var query = _context.Piutangs
                .Include(p => p.Satker)
                .Include(p => p.WajibBayar)
                .Include(p => p.JenisPnbp)
                .Where(p => p.SaldoPiutang > 0)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(kodeSatker))
                query = query.Where(p => p.Satker != null && p.Satker.KodeSatker == kodeSatker);

            if (tahun.HasValue && tahun.Value > 0)
                query = query.Where(p => p.TanggalDokumen.Year == tahun.Value);

            if (!string.IsNullOrWhiteSpace(kualitas))
                query = query.Where(p => p.KualitasPiutang == kualitas);

            var list = await query.Select(p => new
            {
                kodeSatker = p.Satker != null ? p.Satker.KodeSatker : "",
                namaSatker = p.Satker != null ? p.Satker.NamaSatker : "",
                nomorRegister = p.NomorRegistrasiPiutang,
                nomorSK = p.NomorDokumenPenetapan,
                tanggalSK = p.TanggalDokumen.ToString("yyyy-MM-dd"),
                tanggalJatuhTempo = p.TanggalJatuhTempo.ToString("yyyy-MM-dd"),
                identitasDebitur = p.WajibBayar != null ? p.WajibBayar.NomorIdentitas : "",
                namaDebitur = p.WajibBayar != null ? p.WajibBayar.NamaWajibBayar : "",
                kodeAkunAkuntansi = p.JenisPnbp != null ? p.JenisPnbp.KodeAkun : "115111",
                namaAkun = p.JenisPnbp != null ? p.JenisPnbp.NamaLayanan : "",
                nilaiKetetapan = p.TotalPiutang,
                nilaiPelunasan = p.TotalTerbayar,
                saldoAkhirPiutang = p.SaldoPiutang,
                umurPiutangHari = p.UmurHari,
                kualitasPiutang = p.KualitasPiutang,
                statusPenagihan = p.StatusPenagihan
            }).ToListAsync();

            _context.SaktiExportLogs.Add(new ArSaktiExportLog
            {
                RequestId = reqId,
                EndpointCalled = "/api/sakti/posisi-piutang",
                Method = "GET",
                FilterPayload = $"kodeSatker={kodeSatker}&tahun={tahun}&kualitas={kualitas}",
                RecordCount = list.Count,
                StatusCode = 200,
                ResponseSummary = $"Exported {list.Count} records to SAKTI",
                ConsumerSystem = "SAKTI_PROTOTYPE_BRIDGE",
                IpAddress = clientIp,
                CreatedAt = DateTime.UtcNow
            });

            await _context.SaveChangesAsync();
            return (reqId, list);
        }

        public async Task<(string RequestId, object Periode, IEnumerable<object> Data)> GetMutasiPiutangAsync(DateTime? startDate, DateTime? endDate, string? kodeSatker, string clientIp)
        {
            var reqId = "REQ-SAKTI-MUTASI-" + Guid.NewGuid().ToString("N")[..12].ToUpper();
            var start = startDate ?? DateTime.UtcNow.AddMonths(-1);
            var end = endDate ?? DateTime.UtcNow;

            var query = _context.PiutangHistoris
                .Where(h => h.TanggalTransaksi >= start && h.TanggalTransaksi <= end)
                .AsQueryable();

            var data = await query
                .OrderByDescending(h => h.TanggalTransaksi)
                .Take(500)
                .Select(h => new
                {
                    mutasiId = h.Id,
                    piutangId = h.PiutangId,
                    tanggalTransaksi = h.TanggalTransaksi.ToString("yyyy-MM-dd HH:mm:ss"),
                    jenisMutasi = h.JenisMutasi,
                    debet = h.MutasiTambah,
                    kredit = h.MutasiKurang,
                    saldoAkhir = h.SaldoAkhir,
                    dokumenSumber = h.ReferensiDokumen,
                    keterangan = h.CatatanAlasan
                })
                .ToListAsync();

            var periode = new { start = start.ToString("yyyy-MM-dd"), end = end.ToString("yyyy-MM-dd") };
            return (reqId, periode, data);
        }
    }
}
