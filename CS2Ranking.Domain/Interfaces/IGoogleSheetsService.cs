namespace CS2Ranking.Domain.Interfaces
{
    public interface IGoogleSheetsService
    {
        Task GetSheetDataAsync(string sheetLink);
    }
}
