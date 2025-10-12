using CS2Ranking.Application.Dtos;
namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IMatchService
    {
        Task ImportFromSheetAsync(string sheetLink);
        Task<IEnumerable<IGrouping<DateTime, MatchResponseDto>>> GetMatches(int? limit, int? offset);
    }
}
