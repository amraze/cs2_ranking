using CS2Ranking.Application.Dtos.MatchDtos;
namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IMatchService
    {
        Task ImportFromSheetAsync(string sheetLink);
        Task<bool> ImportFromScopeAsync(string scopeSessionId);
        Task<IEnumerable<IGrouping<DateTime, MatchResponseDto>>> GetGroupedMatchesAsync(int? limit, int? offset);
        Task<IEnumerable<EvolutionResponseDto>> GetEvolutionAsync();
    }
}
