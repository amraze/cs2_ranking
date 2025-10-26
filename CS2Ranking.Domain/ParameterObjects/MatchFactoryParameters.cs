namespace CS2Ranking.Domain.ParameterObjects
{
    public class MatchFactoryParameters(
        int seasonId,
        DateTime dateTime,
        string mapName,
        int outcome,
        string score,
        string gamemode,
        int kills,
        int assists,
        int deaths,
        double hltv,
        int adr,
        int? rankScore)
    {
        public int SeasonId { get; } = seasonId;
        public DateTime DateTime { get; } = dateTime;
        public string MapName { get; } = mapName;
        public int Outcome { get; } = outcome;
        public string Score { get; } = score;
        public string Gamemode { get; } = gamemode;
        public int Kills { get; } = kills;
        public int Assists { get; } = assists;
        public int Deaths { get; } = deaths;
        public double Hltv { get; } = hltv;
        public int Adr { get; } = adr;
        public int? RankScore { get; } = rankScore;
    }
}
