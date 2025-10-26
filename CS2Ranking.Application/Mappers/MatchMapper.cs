namespace CS2Ranking.Application.Mappers
{
    using CS2Ranking.Application.Dtos;
    using CS2Ranking.Domain.ParameterObjects;
    using System.Globalization;

    public static class MatchMapper
    {
        public static MatchFactoryParameters FromSheetRow(List<string> row)
        {
            double? hltv = double.TryParse(row[9], NumberStyles.Any, CultureInfo.InvariantCulture, out var hltv3)? hltv3: null;
            int? rankScore = int.TryParse(row[11], out var rank) ? rank : null;

            return new MatchFactoryParameters(
                seasonId: int.Parse(row[1]),
                dateTime: DateTime.Parse(row[2]),
                mapName: row[3],
                outcome: 1,
                gamemode: "premier",
                score: row[5],
                kills: int.Parse(row[6]),
                assists: int.Parse(row[7]),
                deaths: int.Parse(row[8]),
                hltv: hltv3,
                adr: int.Parse(row[10]),
                rankScore: rankScore
            );
        }

        public static MatchFactoryParameters FromScopeGG(ScopeGGResponseDto scopeMatch)
        {
            var userTeam = scopeMatch.TeamInfos.FirstOrDefault(t => t.IsUserTeam);
            var enemyTeam = scopeMatch.TeamInfos.FirstOrDefault(t => !t.IsUserTeam);
            int outcome = 0;
            string score = "";
            if (userTeam != null && enemyTeam != null)
            {
                score = $"{userTeam.Score}:{enemyTeam.Score}";

                if (userTeam.Score == enemyTeam.Score)
                    outcome = 1;
                else if (userTeam.Won)
                    outcome = 2;
                else
                    outcome = 0;
            }

            return new MatchFactoryParameters(
                seasonId: 1,
                dateTime: DateTimeOffset.FromUnixTimeMilliseconds(scopeMatch.MatchTime ?? 0).UtcDateTime,
                mapName: scopeMatch.MapName,
                outcome: outcome,
                gamemode: scopeMatch.Gamemode,
                score: score,
                kills: scopeMatch.UserStats.Kills,
                assists: scopeMatch.UserStats.Assists,
                deaths: scopeMatch.UserStats.Deaths,
                hltv: scopeMatch.UserStats.Rating2,
                adr: scopeMatch.UserStats.Damage / scopeMatch.UserStats.RoundsPlayed,
                rankScore: scopeMatch.UserStats.PremierRatingNew
            );
        }
    }
}