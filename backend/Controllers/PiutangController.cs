using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ArManagement.Api.DTOs.Common;
using ArManagement.Api.DTOs.Piutang;
using ArManagement.Api.Models;
using ArManagement.Api.Services.Aging;
using ArManagement.Api.Services.Piutang;

namespace ArManagement.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PiutangController : ControllerBase
    {
        private readonly IPiutangService _piutangService;
        private readonly IAgingEngineService _agingEngine;

        public PiutangController(IPiutangService piutangService, IAgingEngineService agingEngine)
        {
            _piutangService = piutangService;
            _agingEngine = agingEngine;
        }

        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] PiutangFilterDto filter)
        {
            var result = await _piutangService.GetPagedListAsync(filter);
            return Ok(new
            {
                success = true,
                total = result.Total,
                page = result.Page,
                pageSize = result.PageSize,
                totalPages = result.TotalPages,
                data = result.Items
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(long id)
        {
            var item = await _piutangService.GetByIdAsync(id);
            if (item == null)
                return NotFound(ApiResponse<string>.Fail("Data piutang tidak ditemukan."));

            return Ok(ApiResponse<ArPiutang>.Ok(item));
        }

        [HttpPost]
        public async Task<IActionResult> CreatePiutang([FromBody] CreatePiutangRequest req)
        {
            if (string.IsNullOrWhiteSpace(req.NomorDokumenPenetapan))
                return BadRequest(ApiResponse<string>.Fail("Nomor Dokumen Penetapan wajib diisi."));

            var entity = await _piutangService.CreatePiutangAsync(req);
            return Ok(ApiResponse<ArPiutang>.Ok(entity, "Piutang berhasil dicatat."));
        }

        [HttpPost("{id}/pembayaran")]
        public async Task<IActionResult> RecordPembayaran(long id, [FromBody] RecordPembayaranRequest req)
        {
            var result = await _piutangService.RecordPembayaranAsync(id, req);
            if (!result.Success)
                return BadRequest(ApiResponse<string>.Fail(result.Message));

            return Ok(new
            {
                success = true,
                message = result.Message,
                saldoSisa = result.SisaSaldo,
                statusPiutang = result.Status
            });
        }

        [HttpPost("{id}/penagihan")]
        public async Task<IActionResult> RecordPenagihan(long id, [FromBody] RecordPenagihanRequest req)
        {
            var result = await _piutangService.RecordPenagihanAsync(id, req);
            if (!result.Success)
                return BadRequest(ApiResponse<string>.Fail(result.Message));

            return Ok(new
            {
                success = true,
                message = result.Message
            });
        }

        [HttpPost("recalculate-aging")]
        public async Task<IActionResult> RecalculateAllAging()
        {
            int updated = await _agingEngine.RecalculateAllAgingAsync();
            return Ok(new
            {
                success = true,
                message = $"Berhasil memperbarui umur dan kualitas {updated} piutang aktif."
            });
        }
    }
}
