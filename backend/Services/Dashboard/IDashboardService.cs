using System.Collections.Generic;
using System.Threading.Tasks;
using ArManagement.Api.DTOs.Dashboard;

namespace ArManagement.Api.Services.Dashboard
{
    public interface IDashboardService
    {
        Task<DashboardSummaryDto> GetSummaryAsync(int? tahun, int? satkerId);
        Task<IEnumerable<AgingMatrixItemDto>> GetAgingMatrixAsync(int? satkerId);
        Task<IEnumerable<KualitasBreakdownItemDto>> GetKualitasBreakdownAsync(int? satkerId);
        Task<IEnumerable<SatkerSummaryItemDto>> GetSatkerSummaryAsync();
    }
}
