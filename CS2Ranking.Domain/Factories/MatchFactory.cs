
using CS2Ranking.Domain.Entities;
using System.Globalization;
using System.Text.Json;

namespace CS2Ranking.Domain.Factories
{
    public class MatchFactory
    {

        public static Match CreateFromSheets(List<string> row, Dictionary<string, int> maps)
        {
            var match = new Match(
                seasonId: int.Parse(row[1]),
                datetime: DateTime.Parse(row[2]),
                mapId: maps[row[3]],
                result: row[4].ToUpper() switch
                {
                    "LOSS" => 0,
                    "DRAW" => 1,
                    "WIN" => 2,
                    _ => -1
                }
            );

            double hsp = double.Parse(row[9], CultureInfo.InvariantCulture);

            match.SetResult(
                kills: int.Parse(row[5]),
                assists: int.Parse(row[6]),
                deaths: int.Parse(row[7]),
                mvps: int.Parse(row[8]),
                hsp: hsp,
                score: int.Parse(row[10]),
                adr: int.Parse(row[11])
            );

            if (int.TryParse(row[12], out var rankScore))
            {
                match.SetRank(
                    rankId: 1,
                    rankScore: rankScore
                );
            }

            return match;
        }
    }
}
