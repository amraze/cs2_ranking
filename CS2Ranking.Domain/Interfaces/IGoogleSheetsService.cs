namespace CS2Ranking.Domain.Interfaces
{
    public interface IGoogleSheetsService
    {
        Task<List<List<string>>> GetSheetDataAsync(string sheetLink);
    }
}
