using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using ArManagement.Api.Services.Sakti;

namespace ArManagement.Api.Controllers
{
    [ApiController]
    [Route("api/sakti")]
    [Produces("application/json")]
    public class SaktiIntegrationController : ControllerBase
    {
        private readonly ISaktiIntegrationService _saktiService;

        public SaktiIntegrationController(ISaktiIntegrationService saktiService)
        {
            _saktiService = saktiService;
        }

        [HttpGet("posisi-piutang")]
        public async Task<IActionResult> GetPosisiPiutang(
            [FromQuery] string? kodeSatker, 
            [FromQuery] int? tahun, 
            [FromQuery] string? kualitas)
        {
            var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var (requestId, data) = await _saktiService.GetPosisiPiutangAsync(kodeSatker, tahun, kualitas, clientIp);

            return Ok(new
            {
                requestId,
                timestamp = DateTime.UtcNow,
                sourceSystem = "AR_MANAGEMENT_KLH_BPLH",
                targetSystem = "SAKTI_KEMENKEU",
                totalRecords = ((System.Collections.Generic.List<object>)data).Count,
                data
            });
        }

        [HttpGet("mutasi-piutang")]
        public async Task<IActionResult> GetMutasiPiutang(
            [FromQuery] DateTime? startDate, 
            [FromQuery] DateTime? endDate, 
            [FromQuery] string? kodeSatker)
        {
            var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
            var (requestId, periode, data) = await _saktiService.GetMutasiPiutangAsync(startDate, endDate, kodeSatker, clientIp);

            return Ok(new
            {
                requestId,
                timestamp = DateTime.UtcNow,
                periode,
                totalRecords = ((System.Collections.Generic.List<object>)data).Count,
                data
            });
        }
    }
}
