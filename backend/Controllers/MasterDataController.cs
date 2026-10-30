using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ArManagement.Api.Data;
using ArManagement.Api.Models;

namespace ArManagement.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class MasterDataController : ControllerBase
    {
        private readonly ArDbContext _context;

        public MasterDataController(ArDbContext context)
        {
            _context = context;
        }

        [HttpGet("satker")]
        public async Task<IActionResult> GetSatkers()
        {
            var data = await _context.Satkers
                .Where(s => s.IsActive)
                .OrderBy(s => s.KodeSatker)
                .ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("wajib-bayar")]
        public async Task<IActionResult> GetWajibBayars([FromQuery] string? search)
        {
            var query = _context.WajibBayars.Where(w => w.IsActive).AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                query = query.Where(w => w.NamaWajibBayar.Contains(search) || 
                                         w.NomorIdentitas.Contains(search));
            }

            var data = await query.OrderBy(w => w.NamaWajibBayar).Take(100).ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpPost("wajib-bayar")]
        public async Task<IActionResult> CreateWajibBayar([FromBody] ArWajibBayar model)
        {
            var exists = await _context.WajibBayars.AnyAsync(w => 
                w.JenisIdentitas == model.JenisIdentitas && 
                w.NomorIdentitas == model.NomorIdentitas);

            if (exists)
            {
                return BadRequest(new { success = false, message = "Wajib Bayar dengan identitas tersebut sudah terdaftar." });
            }

            model.CreatedAt = DateTime.UtcNow;
            _context.WajibBayars.Add(model);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, data = model, message = "Wajib Bayar berhasil ditambahkan." });
        }

        [HttpGet("jenis-pnbp")]
        public async Task<IActionResult> GetJenisPnbps()
        {
            var data = await _context.JenisPnbps
                .Where(j => j.IsActive)
                .OrderBy(j => j.KodeAkun)
                .ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("dokumen-dasar")]
        public async Task<IActionResult> GetDokumenDasars()
        {
            var data = await _context.DokumenDasars
                .Where(d => d.IsActive)
                .OrderBy(d => d.KodeDokumen)
                .ToListAsync();
            return Ok(new { success = true, data });
        }

        [HttpGet("kualitas-aging")]
        public async Task<IActionResult> GetKualitasAgings()
        {
            var data = await _context.KualitasAgings
                .OrderBy(k => k.Urutan)
                .ToListAsync();
            return Ok(new { success = true, data });
        }
    }
}
