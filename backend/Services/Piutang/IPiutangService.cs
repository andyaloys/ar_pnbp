using System.Threading.Tasks;
using ArManagement.Api.DTOs.Common;
using ArManagement.Api.DTOs.Piutang;
using ArManagement.Api.Models;

namespace ArManagement.Api.Services.Piutang
{
    public interface IPiutangService
    {
        Task<PagedResult<ArPiutang>> GetPagedListAsync(PiutangFilterDto filter);
        Task<ArPiutang?> GetByIdAsync(long id);
        Task<ArPiutang> CreatePiutangAsync(CreatePiutangRequest req);
        Task<(bool Success, string Message, decimal SisaSaldo, string Status)> RecordPembayaranAsync(long piutangId, RecordPembayaranRequest req);
        Task<(bool Success, string Message)> RecordPenagihanAsync(long piutangId, RecordPenagihanRequest req);
    }
}
