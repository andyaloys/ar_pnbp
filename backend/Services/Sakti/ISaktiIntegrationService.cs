using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ArManagement.Api.Services.Sakti
{
    public interface ISaktiIntegrationService
    {
        Task<(string RequestId, IEnumerable<object> Data)> GetPosisiPiutangAsync(string? kodeSatker, int? tahun, string? kualitas, string clientIp);
        Task<(string RequestId, object Periode, IEnumerable<object> Data)> GetMutasiPiutangAsync(DateTime? startDate, DateTime? endDate, string? kodeSatker, string clientIp);
    }
}
