using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArManagement.Api.Data;
using ArManagement.Api.DTOs.Dashboard;

namespace ArManagement.Api.Services.Dashboard
{
    public class DashboardService : IDashboardService
    {
        private readonly ArDbContext _context;

        public DashboardService(ArDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync(int? tahun, int? satkerId)
        {
            var query = _context.Piutangs.AsQueryable();

            if (satkerId.HasValue && satkerId.Value > 0)
                query = query.Where(p => p.SatkerId == satkerId.Value);

            if (tahun.HasValue && tahun.Value > 0)
                query = query.Where(p => p.TanggalDokumen.Year == tahun.Value);

            var totalPiutang = await query.SumAsync(p => (decimal?)p.TotalPiutang) ?? 0m;
            var totalTerbayar = await query.SumAsync(p => (decimal?)p.TotalTerbayar) ?? 0m;
            var totalSaldo = await query.SumAsync(p => (decimal?)p.SaldoPiutang) ?? 0m;

            var today = DateTime.UtcNow.Date;
            var jatuhTempo = await query
                .Where(p => p.SaldoPiutang > 0 && p.TanggalJatuhTempo < today)
                .SumAsync(p => (decimal?)p.SaldoPiutang) ?? 0m;

            var countTotal = await query.CountAsync();
            var countLunas = await query.Where(p => p.SaldoPiutang == 0 || p.StatusPiutang == "LUNAS").CountAsync();
            var countAktif = await query.Where(p => p.SaldoPiutang > 0).CountAsync();

            decimal recoveryRate = totalPiutang > 0 ? Math.Round((totalTerbayar / totalPiutang) * 100m, 2) : 0m;

            // Perhitungan penyisihan piutang negara (PMK 163/PMK.06/2020)
            var saldoLancar = await query.Where(p => p.KualitasPiutang == "LANCAR").SumAsync(p => (decimal?)p.SaldoPiutang) ?? 0m;
            var saldoKurangLancar = await query.Where(p => p.KualitasPiutang == "KURANG_LANCAR").SumAsync(p => (decimal?)p.SaldoPiutang) ?? 0m;
            var saldoDiragukan = await query.Where(p => p.KualitasPiutang == "DIRAGUKAN").SumAsync(p => (decimal?)p.SaldoPiutang) ?? 0m;
            var saldoMacet = await query.Where(p => p.KualitasPiutang == "MACET").SumAsync(p => (decimal?)p.SaldoPiutang) ?? 0m;

            decimal penyisihan = (saldoLancar * 0.005m) + 
                                 (saldoKurangLancar * 0.10m) + 
                                 (saldoDiragukan * 0.50m) + 
                                 (saldoMacet * 1.00m);

            return new DashboardSummaryDto
            {
                TotalPiutangBruto = totalPiutang,
                TotalTertagih = totalTerbayar,
                TotalSaldoPiutang = totalSaldo,
                PiutangJatuhTempo = jatuhTempo,
                RecoveryRate = recoveryRate,
                TotalPenyisihan = Math.Round(penyisihan, 2),
                Counts = new DashboardCountsDto
                {
                    TotalDokumen = countTotal,
                    Lunas = countLunas,
                    Aktif = countAktif
                }
            };
        }

        public async Task<IEnumerable<AgingMatrixItemDto>> GetAgingMatrixAsync(int? satkerId)
        {
            var query = _context.Piutangs.Where(p => p.SaldoPiutang > 0).AsQueryable();

            if (satkerId.HasValue && satkerId.Value > 0)
                query = query.Where(p => p.SatkerId == satkerId.Value);

            var items = await query.Select(p => new { p.SaldoPiutang, p.UmurHari }).ToListAsync();

            return new[]
            {
                new AgingMatrixItemDto { Label = "Belum Jatuh Tempo (Current)", Jumlah = items.Where(p => p.UmurHari <= 0).Sum(p => p.SaldoPiutang), Count = items.Count(p => p.UmurHari <= 0), Color = "#10b981" },
                new AgingMatrixItemDto { Label = "1 - 30 Hari", Jumlah = items.Where(p => p.UmurHari >= 1 && p.UmurHari <= 30).Sum(p => p.SaldoPiutang), Count = items.Count(p => p.UmurHari >= 1 && p.UmurHari <= 30), Color = "#3b82f6" },
                new AgingMatrixItemDto { Label = "31 - 90 Hari", Jumlah = items.Where(p => p.UmurHari >= 31 && p.UmurHari <= 90).Sum(p => p.SaldoPiutang), Count = items.Count(p => p.UmurHari >= 31 && p.UmurHari <= 90), Color = "#6366f1" },
                new AgingMatrixItemDto { Label = "91 - 180 Hari", Jumlah = items.Where(p => p.UmurHari >= 91 && p.UmurHari <= 180).Sum(p => p.SaldoPiutang), Count = items.Count(p => p.UmurHari >= 91 && p.UmurHari <= 180), Color = "#f59e0b" },
                new AgingMatrixItemDto { Label = "181 - 365 Hari", Jumlah = items.Where(p => p.UmurHari >= 181 && p.UmurHari <= 365).Sum(p => p.SaldoPiutang), Count = items.Count(p => p.UmurHari >= 181 && p.UmurHari <= 365), Color = "#f97316" },
                new AgingMatrixItemDto { Label = "> 365 Hari (Macet)", Jumlah = items.Where(p => p.UmurHari > 365).Sum(p => p.SaldoPiutang), Count = items.Count(p => p.UmurHari > 365), Color = "#ef4444" }
            };
        }

        public async Task<IEnumerable<KualitasBreakdownItemDto>> GetKualitasBreakdownAsync(int? satkerId)
        {
            var query = _context.Piutangs.Where(p => p.SaldoPiutang > 0).AsQueryable();

            if (satkerId.HasValue && satkerId.Value > 0)
                query = query.Where(p => p.SatkerId == satkerId.Value);

            return await query
                .GroupBy(p => p.KualitasPiutang)
                .Select(g => new KualitasBreakdownItemDto
                {
                    Kualitas = g.Key,
                    TotalSaldo = g.Sum(p => p.SaldoPiutang),
                    JumlahDokumen = g.Count()
                })
                .ToListAsync();
        }

        public async Task<IEnumerable<SatkerSummaryItemDto>> GetSatkerSummaryAsync()
        {
            return await _context.Satkers
                .Where(s => s.IsActive)
                .Select(s => new SatkerSummaryItemDto
                {
                    SatkerId = s.Id,
                    KodeSatker = s.KodeSatker,
                    NamaSatker = s.NamaSatker,
                    TotalPiutang = _context.Piutangs.Where(p => p.SatkerId == s.Id).Sum(p => (decimal?)p.TotalPiutang) ?? 0m,
                    TotalSaldo = _context.Piutangs.Where(p => p.SatkerId == s.Id).Sum(p => (decimal?)p.SaldoPiutang) ?? 0m,
                    TotalTerbayar = _context.Piutangs.Where(p => p.SatkerId == s.Id).Sum(p => (decimal?)p.TotalTerbayar) ?? 0m,
                    JumlahDokumen = _context.Piutangs.Count(p => p.SatkerId == s.Id),
                    PiutangMacet = _context.Piutangs.Where(p => p.SatkerId == s.Id && p.KualitasPiutang == "MACET").Sum(p => (decimal?)p.SaldoPiutang) ?? 0m
                })
                .OrderByDescending(s => s.TotalSaldo)
                .ToListAsync();
        }
    }
}
