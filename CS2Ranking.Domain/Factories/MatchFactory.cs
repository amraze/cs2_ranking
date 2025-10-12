
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
                outcome: matchParams.Outcome.ToUpper() switch
                {
                    "LOSS" => 0,
                    "DRAW" => 1,
                    "WIN" => 2,
                    _ => -1
                }
            );

            match.SetResult(
                kills: matchParams.Kills,
                assists: matchParams.Assists,
                deaths: matchParams.Deaths,
                mvps: matchParams.Mvps,
                hsp: matchParams.Hsp,
                hltv: matchParams.Hltv,
                adr: matchParams.Adr
            );

            match.SetRank(rankId, matchParams.RankScore);

            return match;
        }

    }
}
