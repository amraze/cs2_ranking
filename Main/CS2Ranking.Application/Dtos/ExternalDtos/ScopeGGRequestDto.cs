namespace CS2Ranking.Application.Dtos.ExternalDtos
{
    public class ScopeGGRequestDto
    {
        public FilterDto Filter { get; set; } = new FilterDto();
        public SortDto Sort { get; set; } = new SortDto();
        public int Offset { get; set; }
        public int Limit { get; set; }
    }

    public class FilterDto
    {
        public List<string> Sources { get; set; } = new List<string>();
        public List<string> Maps { get; set; } = new List<string>();
        public List<string> Tags { get; set; } = new List<string>();
        public bool FavouriteOnly { get; set; }
        public bool BannedOnly { get; set; }
    }

    public class SortDto
    {
        public string By { get; set; } = "date";
        public int Direction { get; set; } = 1;
    }
}
