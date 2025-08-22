using CS2Ranking.Domain.Interfaces;

/// <summary>
/// External service responsible for fetching data from Google Sheets.
/// </summary>
public class GoogleSheetsService : IGoogleSheetsService
{
    private readonly HttpClient _httpClient;

    public GoogleSheetsService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task GetSheetDataAsync(string sheetApiLink)
    {
        var response = await _httpClient.GetAsync(sheetApiLink);
        response.EnsureSuccessStatusCode();
        var jsonResponse = await response.Content.ReadAsStringAsync();
        Console.WriteLine(jsonResponse);

    }
}
