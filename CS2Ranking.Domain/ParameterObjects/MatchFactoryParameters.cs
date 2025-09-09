namespace CS2Ranking.Domain.ParameterObjects
{
    public class MatchFactoryParameters(
        int seasonId,
        DateTime dateTime,
        string mapName,
        string result,
        int kills,
        int assists,
        int deaths,
        int mvps,
        double hsp,
        int score,
        int adr,
        int rankScore)
    {
        public int SeasonId { get; } = seasonId;
        public DateTime DateTime { get; } = dateTime;
        public string MapName { get; } = mapName;
        public string Result { get; } = result ?? throw new ArgumentNullException(nameof(result));
        public int Kills { get; } = kills;
        public int Assists { get; } = assists;
        public int Deaths { get; } = deaths;
        public int Mvps { get; } = mvps;
        public double Hsp { get; } = hsp;
        public int Score { get; } = score;
        public int Adr { get; } = adr;
        public int RankScore { get; } = rankScore;
    }
}
