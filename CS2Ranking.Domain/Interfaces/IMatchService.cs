namespace CS2Ranking.Domain.Interfaces
{
    public interface IMatchService
    {
        Task ImportFromSheetAsync(string sheetLink);
    }
}
