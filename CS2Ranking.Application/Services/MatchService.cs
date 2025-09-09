using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Application.Interfaces.IServices;
using CS2Ranking.Application.Mappers;
using CS2Ranking.Domain.Entities;
using CS2Ranking.Domain.Factories;

namespace CS2Ranking.Application.Services
{
    public class MatchService(IMatchRepository matchRepository, IGoogleSheetsService googleSheetsService, IMapService mapService, IRankService rankService) : IMatchService
    {
        private readonly IGoogleSheetsService _googleSheetsService = googleSheetsService;
        private readonly IMapService _mapService = mapService;
        private readonly IRankService _rankService = rankService;
        private readonly IMatchRepository _matchRepository = matchRepository;

        public async Task ImportFromSheetAsync(string sheetLink)
        {
            var rows = await _googleSheetsService.GetSheetDataAsync(sheetLink);
            var matches = new List<Match>();

            foreach (var row in rows.Skip(1))
            {
                var parameters = MatchMapper.FromSheetRow(row);
                var map = await _mapService.GetMapByNameAsync(parameters.MapName);
                var rank = await _rankService.GetRankByScoreAsync(parameters.RankScore);
               
                if (map != null && rank != null)
                {
                    var match = MatchFactory.Create(parameters, map.Id, rank.Id);
                    matches.Add(match);
                }
            }

            if (matches.Count == 0) return;
            await _matchRepository.DeleteAllAsync();
            await _matchRepository.AddRangeAsync(matches);
        }
    }
}
