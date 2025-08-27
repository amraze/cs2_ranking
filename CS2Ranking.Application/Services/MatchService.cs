using CS2Ranking.Application.Interfaces;
using CS2Ranking.Domain.Factories;
using CS2Ranking.Domain.Interfaces;

namespace CS2Ranking.Application.Services
{
    public class MatchService(IMatchRepository matchRepository, IGoogleSheetsService googleSheetsService, IMapService mapService) : IMatchService
    {
        private readonly IGoogleSheetsService _googleSheetsService = googleSheetsService;
        private readonly IMapService _mapService = mapService;
        private readonly IMatchRepository _matchRepository = matchRepository;

        public async Task ImportFromSheetAsync(string sheetLink)
        {
            var maps = (await _mapService.GetAllMapsAsync()).ToDictionary(m => m.Name, m => m.Id);
            var rows = await _googleSheetsService.GetSheetDataAsync(sheetLink);
            var matches = rows.Skip(1).Select(row => MatchFactory.CreateFromSheets(row, maps)).ToList();

            if (matches.Count == 0) return;
            await _matchRepository.DeleteAllAsync();
            await _matchRepository.AddRangeAsync(matches);
        }
    }
}
