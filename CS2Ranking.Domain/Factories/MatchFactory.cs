
using CS2Ranking.Domain.Entities;
using CS2Ranking.Domain.ParameterObjects;

namespace CS2Ranking.Domain.Factories
{
    public class MatchFactory
    {
        public static Match Create(MatchFactoryParameters matchParams, int mapId, int rankId)
        {
            var match = new Match(
                seasonId: matchParams.SeasonId,
                datetime: matchParams.DateTime,
                mapId: mapId,
                outcome: matchParams.Outcome,
                gamemode: matchParams.Gamemode,
                score: matchParams.Score
            );

            match.SetResult(
                kills: matchParams.Kills,
                assists: matchParams.Assists,
                deaths: matchParams.Deaths,
                hltv: matchParams.Hltv,
                adr: matchParams.Adr
            );

            match.SetRank(rankId, matchParams.RankScore);

            return match;
        }

    }
}
