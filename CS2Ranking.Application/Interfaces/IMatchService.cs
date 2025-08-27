namespace CS2Ranking.Application.Interfaces
{
    public interface IMatchService
    {
        Task ImportFromSheetAsync(string sheetLink);
    }
}
