using CS2Ranking.Application.Dtos;
namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IMatchService
    {
        Task ImportFromSheetAsync(string sheetLink);
        Task<IEnumerable<IGrouping<DateTime, MatchResponseDto>>> GetGroupedMatchesAsync(int? limit, int? offset);
    }
}
