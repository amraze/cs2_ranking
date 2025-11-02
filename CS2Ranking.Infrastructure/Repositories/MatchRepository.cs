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

    public async Task<IEnumerable<MapPerformance>> GetAllMapPerformanceAsync(DateTime? start, DateTime? end)
    {

        var query = _dbSet.AsQueryable();

        if (start.HasValue)
            query = query.Where(match => match.Datetime >= start.Value);

        if (end.HasValue)
            query = query.Where(match => match.Datetime <= end.Value);

        return await query
            .GroupBy(match => match.MapId)
            .Select(g => new MapPerformance
            {
                Id = g.Key,
                Matches = g.Count(),
                Wins = g.Count(match => match.Outcome == 2),
                Losses = g.Count(match => match.Outcome == 0),
                Draws = g.Count(match => match.Outcome == 1),
                Kills = g.Sum(match => match.MatchResult.Kills),
                Assists = g.Sum(match => match.MatchResult.Assists),
                Deaths = g.Sum(match => match.MatchResult.Deaths),
                Adr = g.Sum(match => match.MatchResult.Adr),
                Hltv = g.Sum(match => match.MatchResult.Hltv)
            })
            .ToListAsync();
    }

}
