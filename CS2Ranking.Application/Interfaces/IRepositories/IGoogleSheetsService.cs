namespace CS2Ranking.Application.Interfaces.IRepositories
{
    public interface IGoogleSheetsService
    {
        Task<List<List<string>>> GetSheetDataAsync(string sheetLink);
    }
}
