using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArManagement.Api.Data;

namespace ArManagement.Api.Services.Aging
{
    public class AgingEngineService : IAgingEngineService
    {
        private readonly ArDbContext _context;

        public AgingEngineService(ArDbContext context)
        {
            _context = context;
        }

        public string TentukanKualitas(int umurHari, string statusPenagihan)
        {
            // Aturan Klasifikasi Kualitas Piutang Negara (PMK 163/PMK.06/2020)
            if (statusPenagihan == "PENYERAHAN_PUPN" || statusPenagihan == "PUPN" || umurHari > 365)
                return "MACET";

            if (umurHari > 90 || statusPenagihan == "SP2" || statusPenagihan == "SP3")
                return "DIRAGUKAN";

            if (umurHari > 30 || statusPenagihan == "SP1")
                return "KURANG_LANCAR";

            return "LANCAR";
        }

        public async Task<int> RecalculateAllAgingAsync(DateTime? tanggalAcuan = null)
        {
            var today = tanggalAcuan?.Date ?? DateTime.UtcNow.Date;

            var activePiutangs = await _context.Piutangs
                .Where(p => p.SaldoPiutang > 0 && !p.IsLocked)
                .ToListAsync();

            int updatedCount = 0;
            foreach (var p in activePiutangs)
            {
                var diffDays = (today - p.TanggalJatuhTempo.Date).Days;
                p.UmurHari = Math.Max(0, diffDays);
                p.KualitasPiutang = TentukanKualitas(p.UmurHari, p.StatusPenagihan);
                p.UpdatedAt = DateTime.UtcNow;
                updatedCount++;
            }

            if (updatedCount > 0)
            {
                await _context.SaveChangesAsync();
            }

            return updatedCount;
        }
    }
}
