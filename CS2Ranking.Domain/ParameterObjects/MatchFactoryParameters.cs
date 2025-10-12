namespace CS2Ranking.Domain.ParameterObjects
{
    public class MatchFactoryParameters(
        int seasonId,
        DateTime dateTime,
        string mapName,
        string outcome,
        int kills,
        int assists,
        int deaths,
        int mvps,
        double hsp,
        double hltv,
        int adr,
        int? rankScore)
    {
        public int SeasonId { get; } = seasonId;
        public DateTime DateTime { get; } = dateTime;
        public string MapName { get; } = mapName;
        public string Outcome { get; } = outcome ?? throw new ArgumentNullException(nameof(outcome));
        public int Kills { get; } = kills;
        public int Assists { get; } = assists;
        public int Deaths { get; } = deaths;
        public int Mvps { get; } = mvps;
        public double Hsp { get; } = hsp;
        public double Hltv { get; } = hltv;
        public int Adr { get; } = adr;
        public int? RankScore { get; } = rankScore;
    }
}
