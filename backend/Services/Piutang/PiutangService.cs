using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ArManagement.Api.Data;
using ArManagement.Api.DTOs.Common;
using ArManagement.Api.DTOs.Piutang;
using ArManagement.Api.Models;
using ArManagement.Api.Services.Aging;

namespace ArManagement.Api.Services.Piutang
{
    public class PiutangService : IPiutangService
    {
        private readonly ArDbContext _context;
        private readonly IAgingEngineService _agingEngine;

        public PiutangService(ArDbContext context, IAgingEngineService agingEngine)
        {
            _context = context;
            _agingEngine = agingEngine;
        }

        public async Task<PagedResult<ArPiutang>> GetPagedListAsync(PiutangFilterDto filter)
        {
            var query = _context.Piutangs
                .Include(p => p.Satker)
                .Include(p => p.WajibBayar)
                .Include(p => p.JenisPnbp)
                .Include(p => p.DokumenDasar)
                .AsQueryable();

            if (filter.SatkerId.HasValue && filter.SatkerId.Value > 0)
                query = query.Where(p => p.SatkerId == filter.SatkerId.Value);

            if (filter.WajibBayarId.HasValue && filter.WajibBayarId.Value > 0)
                query = query.Where(p => p.WajibBayarId == filter.WajibBayarId.Value);

            if (!string.IsNullOrWhiteSpace(filter.Kualitas))
                query = query.Where(p => p.KualitasPiutang == filter.Kualitas);

            if (!string.IsNullOrWhiteSpace(filter.Status))
                query = query.Where(p => p.StatusPiutang == filter.Status);

            if (!string.IsNullOrWhiteSpace(filter.Search))
            {
                var s = filter.Search.Trim();
                query = query.Where(p => p.NomorRegistrasiPiutang.Contains(s) ||
                                         p.NomorDokumenPenetapan.Contains(s) ||
                                         (p.WajibBayar != null && p.WajibBayar.NamaWajibBayar.Contains(s)));
            }

            var total = await query.CountAsync();
            var items = await query
                .OrderByDescending(p => p.TanggalJatuhTempo)
                .Skip((filter.Page - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            return new PagedResult<ArPiutang>
            {
                Total = total,
                Page = filter.Page,
                PageSize = filter.PageSize,
                Items = items
            };
        }

        public async Task<ArPiutang?> GetByIdAsync(long id)
        {
            return await _context.Piutangs
                .Include(p => p.Satker)
                .Include(p => p.WajibBayar)
                .Include(p => p.JenisPnbp)
                .Include(p => p.DokumenDasar)
                .Include(p => p.Pembayarans.OrderByDescending(b => b.TanggalBayar))
                .Include(p => p.PenagihanLogs.OrderByDescending(n => n.TanggalSurat))
                .Include(p => p.Historis.OrderByDescending(h => h.TanggalTransaksi))
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<ArPiutang> CreatePiutangAsync(CreatePiutangRequest req)
        {
            var year = DateTime.UtcNow.Year;
            var countThisYear = await _context.Piutangs.CountAsync(p => p.TanggalDokumen.Year == year) + 1;
            var noReg = $"AR-KLH/{year}/{countThisYear:D6}";

            var total = req.NilaiPokok + req.NilaiDendaBunga;
            var today = DateTime.UtcNow.Date;
            var diffDays = Math.Max(0, (today - req.TanggalJatuhTempo.Date).Days);
            var kualitas = _agingEngine.TentukanKualitas(diffDays, "BELUM_PENAGIHAN");

            var entity = new ArPiutang
            {
                NomorRegistrasiPiutang = noReg,
                NomorDokumenPenetapan = req.NomorDokumenPenetapan,
                TanggalDokumen = req.TanggalDokumen,
                TanggalJatuhTempo = req.TanggalJatuhTempo,
                SatkerId = req.SatkerId,
                WajibBayarId = req.WajibBayarId,
                JenisPnbpId = req.JenisPnbpId,
                DokumenDasarId = req.DokumenDasarId,
                NilaiPokok = req.NilaiPokok,
                NilaiDendaBunga = req.NilaiDendaBunga,
                TotalPiutang = total,
                TotalTerbayar = 0m,
                SaldoPiutang = total,
                UmurHari = diffDays,
                KualitasPiutang = kualitas,
                StatusPiutang = "AKTIF",
                StatusPenagihan = "BELUM_PENAGIHAN",
                Keterangan = req.Keterangan,
                CreatedBy = req.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            _context.Piutangs.Add(entity);
            await _context.SaveChangesAsync();

            // Record initial history
            _context.PiutangHistoris.Add(new ArPiutangHistori
            {
                PiutangId = entity.Id,
                JenisMutasi = "PENETAPAN_AWAL",
                SaldoAwal = 0m,
                MutasiTambah = total,
                MutasiKurang = 0m,
                SaldoAkhir = total,
                ReferensiDokumen = entity.NomorDokumenPenetapan,
                CatatanAlasan = "Perekaman penetapan piutang baru",
                CreatedBy = entity.CreatedBy
            });

            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<(bool Success, string Message, decimal SisaSaldo, string Status)> RecordPembayaranAsync(long piutangId, RecordPembayaranRequest req)
        {
            var piutang = await _context.Piutangs.FindAsync(piutangId);
            if (piutang == null)
                return (false, "Data piutang tidak ditemukan.", 0, "");

            if (req.JumlahBayar <= 0)
                return (false, "Jumlah bayar harus lebih dari 0.", piutang.SaldoPiutang, piutang.StatusPiutang);

            if (req.JumlahBayar > piutang.SaldoPiutang)
                return (false, $"Jumlah bayar melebihi sisa saldo piutang (Rp {piutang.SaldoPiutang:N0}).", piutang.SaldoPiutang, piutang.StatusPiutang);

            var saldoLama = piutang.SaldoPiutang;
            piutang.TotalTerbayar += req.JumlahBayar;
            piutang.SaldoPiutang -= req.JumlahBayar;

            if (piutang.SaldoPiutang <= 0)
            {
                piutang.SaldoPiutang = 0m;
                piutang.StatusPiutang = "LUNAS";
            }

            piutang.UpdatedAt = DateTime.UtcNow;
            piutang.UpdatedBy = req.CreatedBy;

            var pembayaran = new ArPembayaran
            {
                PiutangId = piutangId,
                NomorBuktiBayar = "BUKTI-" + DateTime.UtcNow.ToString("yyyyMMddHHmmssfff"),
                TanggalBayar = req.TanggalBayar,
                JumlahBayar = req.JumlahBayar,
                AlokasiPokok = req.AlokasiPokok > 0 ? req.AlokasiPokok : req.JumlahBayar,
                AlokasiDenda = req.AlokasiDenda,
                Ntpn = req.Ntpn,
                KodeBilling = req.KodeBilling,
                BankPersepsi = req.BankPersepsi,
                MetodeBayar = req.MetodeBayar,
                Catatan = req.Catatan,
                CreatedBy = req.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            _context.Pembayarans.Add(pembayaran);

            _context.PiutangHistoris.Add(new ArPiutangHistori
            {
                PiutangId = piutangId,
                JenisMutasi = "PEMBAYARAN",
                SaldoAwal = saldoLama,
                MutasiTambah = 0m,
                MutasiKurang = req.JumlahBayar,
                SaldoAkhir = piutang.SaldoPiutang,
                ReferensiDokumen = pembayaran.NomorBuktiBayar,
                CatatanAlasan = $"Pelunasan via NTPN: {req.Ntpn ?? "-"} Billing: {req.KodeBilling ?? "-"}",
                CreatedBy = req.CreatedBy
            });

            await _context.SaveChangesAsync();
            return (true, "Pembayaran berhasil dicatat.", piutang.SaldoPiutang, piutang.StatusPiutang);
        }

        public async Task<(bool Success, string Message)> RecordPenagihanAsync(long piutangId, RecordPenagihanRequest req)
        {
            var piutang = await _context.Piutangs.FindAsync(piutangId);
            if (piutang == null)
                return (false, "Data piutang tidak ditemukan.");

            var log = new ArPenagihanLog
            {
                PiutangId = piutangId,
                JenisTindakan = req.JenisTindakan,
                NomorSurat = req.NomorSurat,
                TanggalSurat = req.TanggalSurat,
                TanggalJatuhTempoSurat = req.TanggalJatuhTempoSurat,
                PejabatPenandatangan = req.PejabatPenandatangan,
                Perihal = req.Perihal,
                StatusPengiriman = req.StatusPengiriman,
                HasilTindakLanjut = req.HasilTindakLanjut,
                CreatedBy = req.CreatedBy,
                CreatedAt = DateTime.UtcNow
            };

            piutang.StatusPenagihan = req.JenisTindakan;
            piutang.TanggalTerakhirPenagihan = req.TanggalSurat;
            piutang.KualitasPiutang = _agingEngine.TentukanKualitas(piutang.UmurHari, piutang.StatusPenagihan);
            piutang.UpdatedAt = DateTime.UtcNow;

            _context.PenagihanLogs.Add(log);
            await _context.SaveChangesAsync();

            return (true, $"Tindakan penagihan ({req.JenisTindakan}) berhasil dicatat.");
        }
    }
}
