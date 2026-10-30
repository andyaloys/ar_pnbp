using System;
using System.Threading.Tasks;

namespace ArManagement.Api.Services.Aging
{
    public interface IAgingEngineService
    {
        string TentukanKualitas(int umurHari, string statusPenagihan);
        Task<int> RecalculateAllAgingAsync(DateTime? tanggalAcuan = null);
    }
}
