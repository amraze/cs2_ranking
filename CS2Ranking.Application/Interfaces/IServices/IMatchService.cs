namespace CS2Ranking.Application.Interfaces.IServices
{
    public interface IMatchService
    {
        Task ImportFromSheetAsync(string sheetLink);
    }
}
