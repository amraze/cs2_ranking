using CS2Ranking.Domain.Interfaces;

namespace CS2Ranking.Application.Services
{
    public class MatchService : IMatchService
    {
        private readonly IGoogleSheetsService _googleSheetsService;

        public MatchService(IMatchRepository matchRepository, IGoogleSheetsService googleSheetsService)
        {
            _googleSheetsService = googleSheetsService;
        }

        public async Task ImportFromSheetAsync(string sheetLink)
        {
            await _googleSheetsService.GetSheetDataAsync(sheetLink);
        }
    }
}
