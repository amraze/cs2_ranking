using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Infrastructure.ExternalModels;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;

/// <summary>
/// External service responsible for fetching data from Google Sheets.
/// </summary>
namespace CS2Ranking.Infrastructure.ExternalServices
{
    public class GoogleSheetsService : IGoogleSheetsService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;


        public GoogleSheetsService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _config = config;
        }

        public async Task<List<List<string>>> GetSheetDataAsync(string sheetLink)
        {
            var apiKey = _config["GoogleSheets:ApiKey"];
            var sheetApiLink = $"{sheetLink}/?key={apiKey}";

            var sheetData = await _httpClient.GetFromJsonAsync<GoogleSheetsResponse>(sheetApiLink);

            return sheetData?.Values ?? [];
        }
    }
}
