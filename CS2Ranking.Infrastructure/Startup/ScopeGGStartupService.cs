using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Application.Interfaces.IServices;
using CS2Ranking.Application.Mappers;
using CS2Ranking.Domain.Entities;
using CS2Ranking.Domain.Factories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CS2Ranking.Infrastructure.Startup
{
    public class ScopeGGStartupService(IServiceProvider serviceProvider) : IHostedService
    {
        private readonly IServiceProvider _serviceProvider = serviceProvider;

        public async Task StartAsync(CancellationToken cancellationToken)
        {
            using var scope = _serviceProvider.CreateScope();

            var _matchRepository = scope.ServiceProvider.GetRequiredService<IMatchRepository>();
            var _mapService = scope.ServiceProvider.GetRequiredService<IMapService>();
            var _rankService = scope.ServiceProvider.GetRequiredService<IRankService>();
            var _ggService = scope.ServiceProvider.GetRequiredService<IScopeGGService>();
            var response = await _ggService.GetScopeGGDataAsync();
            var matches = new List<Match>();

            foreach (var scopeMatch in response)
            {
                var parameters = MatchMapper.FromScopeGG(scopeMatch);
                var map = await _mapService.GetMapByNameAsync(parameters.MapName);
                var rank = await _rankService.GetRankByScoreAsync(parameters.RankScore ?? default);

                if (map != null && rank != null)
                {
                    var match = MatchFactory.Create(parameters, map.Id, rank.Id);
                    matches.Add(match);
                }
            }
            if (matches.Count == 0) return;
            await _matchRepository.AddRangeAsync(matches);

        }

        public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
    }
}
