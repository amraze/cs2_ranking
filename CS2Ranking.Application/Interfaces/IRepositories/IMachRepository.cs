using CS2Ranking.Application.Models;
using CS2Ranking.Domain.Entities;

namespace CS2Ranking.Application.Interfaces.IRepositories
{
    public interface IMatchRepository : IRepository<Match>
    {
        Task<IEnumerable<Match>> GetWithDetailsAsync(int? limit = null, int? offset = null);
        Task<IEnumerable<MapPerformance>> GetAllMapPerformanceAsync(DateTime? start, DateTime? end);
    }
}
