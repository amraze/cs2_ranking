namespace CS2Ranking.Application.Mappers
{
    using CS2Ranking.Domain.ParameterObjects;
    using System.Globalization;

    public static class MatchMapper
    {
        public static MatchFactoryParameters FromSheetRow(List<string> row)
        {
            double hsp = double.Parse(row[10], CultureInfo.InvariantCulture);
            double? hltv = double.TryParse(row[11], NumberStyles.Any, CultureInfo.InvariantCulture, out var hltv3)? hltv3: null;
            int? rankScore = int.TryParse(row[13], out var rank) ? rank : null;

            return new MatchFactoryParameters(
                seasonId: int.Parse(row[1]),
                dateTime: DateTime.Parse(row[2]),
                mapName: row[3],
                outcome: row[4],
                kills: int.Parse(row[6]),
                assists: int.Parse(row[7]),
                deaths: int.Parse(row[8]),
                mvps: int.Parse(row[9]),
                hsp: hsp,
                hltv: hltv3,
                adr: int.Parse(row[12]),
                rankScore: rankScore
            );
        }
    }
}