namespace CS2Ranking.Application.Mappers
{
    using CS2Ranking.Domain.ParameterObjects;
    using System.Globalization;

    public static class MatchMapper
    {
        public static MatchFactoryParameters FromSheetRow(List<string> row)
        {
            double hsp = double.Parse(row[9], CultureInfo.InvariantCulture);
            int rankScore = int.TryParse(row[12], out var score) ? score : 0;

            return new MatchFactoryParameters(
                seasonId: int.Parse(row[1]),
                dateTime: DateTime.Parse(row[2]),
                mapName: row[3],
                result: row[4],
                kills: int.Parse(row[5]),
                assists: int.Parse(row[6]),
                deaths: int.Parse(row[7]),
                mvps: int.Parse(row[8]),
                hsp: hsp,
                score: int.Parse(row[10]),
                adr: int.Parse(row[11]),
                rankScore: rankScore
            );
        }
    }
}