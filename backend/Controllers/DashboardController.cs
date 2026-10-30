using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ArManagement.Api.DTOs.Common;
using ArManagement.Api.DTOs.Dashboard;
using ArManagement.Api.Services.Dashboard;

namespace ArManagement.Api.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IDashboardService _dashboardService;

        public DashboardController(IDashboardService dashboardService)
        {
            _dashboardService = dashboardService;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary([FromQuery] int? tahun, [FromQuery] int? satkerId)
        {
            var summary = await _dashboardService.GetSummaryAsync(tahun, satkerId);
            return Ok(ApiResponse<DashboardSummaryDto>.Ok(summary));
        }

        [HttpGet("aging-matrix")]
        public async Task<IActionResult> GetAgingMatrix([FromQuery] int? satkerId)
        {
            var matrix = await _dashboardService.GetAgingMatrixAsync(satkerId);
            return Ok(ApiResponse<object>.Ok(matrix));
        }

        [HttpGet("kualitas-breakdown")]
        public async Task<IActionResult> GetKualitasBreakdown([FromQuery] int? satkerId)
        {
            var breakdown = await _dashboardService.GetKualitasBreakdownAsync(satkerId);
            return Ok(ApiResponse<object>.Ok(breakdown));
        }

        [HttpGet("satker-summary")]
        public async Task<IActionResult> GetSatkerSummary()
        {
            var summary = await _dashboardService.GetSatkerSummaryAsync();
            return Ok(ApiResponse<object>.Ok(summary));
        }
    }
}
