using CS2Ranking.Application.Interfaces.IRepositories;
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
            .OrderByDescending(m => m.Id);
        
        if (limit.HasValue && offset.HasValue)
        {
            query = query.Skip(offset.Value).Take(limit.Value);
        }

        return await query.ToListAsync();
    }
}
