using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Application.Models;
using CS2Ranking.Domain.Entities;
using CS2Ranking.Infrastructure;
using CS2Ranking.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

public class MatchRepository(AppDbContext context) : Repository<Match>(context), IMatchRepository
{
    public async Task<IEnumerable<Match>> GetWithDetailsAsync(int? limit = null, int? offset = null)
    {
        IQueryable<Match> query = _dbSet
            .Include(m => m.MatchRank)
            .Include(m => m.MatchResult)
            .Where(m => m.Gamemode == "premier")
            .OrderByDescending(m => m.Id);
        
        if (limit.HasValue && offset.HasValue)
        {
            query = query.Skip(offset.Value).Take(limit.Value);
        }

        return await query.ToListAsync();
    }

    public async Task<IEnumerable<MapPerformance>> GetAllMapPerformanceAsync()
    {
        return await _dbSet
            .GroupBy(m => m.MapId)
            .Select(g => new MapPerformance
            {
                Id = g.Key,
                Matches = g.Count(),
                Wins = g.Count(m => m.Outcome == 2),
                Losses = g.Count(m => m.Outcome == 0),
                Draws = g.Count(m => m.Outcome == 1),
                Kills = g.Sum(m => m.MatchResult.Kills),
                Assists = g.Sum(m => m.MatchResult.Assists),
                Deaths = g.Sum(m => m.MatchResult.Deaths),
                Adr = g.Sum(m => m.MatchResult.Adr),
                Hltv = g.Sum(m => m.MatchResult.Hltv)
            })
            .ToListAsync();
    }

}
