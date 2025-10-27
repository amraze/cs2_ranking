namespace CS2Ranking.Application.Dtos.ExternalDtos
{
    public class ScopeGGResponseDto
    {
        public string? MatchID { get; set; }
        public long? MatchTime { get; set; }
        public string MapName { get; set; }
        public string Gamemode { get; set; }
        public List<TeamInfoDto>? TeamInfos { get; set; }
        public UserStatsDto? UserStats { get; set; }
    }

    public class TeamInfoDto
    {
        public int Score { get; set; }
        public bool Won { get; set; }
        public bool IsUserTeam { get; set; }
    }

    public class UserStatsDto
    {
        public int Damage { get; set; }
        public int? PremierRatingNew { get; set; }
        public int RoundsPlayed { get; set; }
        public int Kills { get; set; }
        public int Deaths { get; set; }
        public int Assists { get; set; }
        public double Rating2 { get; set; }
    }
}
