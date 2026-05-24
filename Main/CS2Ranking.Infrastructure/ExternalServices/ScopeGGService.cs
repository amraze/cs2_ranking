using CS2Ranking.Application.Dtos.ExternalDtos;
using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Infrastructure.ExternalModels;
using System.Net.Http.Json;

/// <summary>
/// External service responsible for automative fetching data from ScopeGG
/// </summary>
namespace CS2Ranking.Infrastructure.ExternalServices
{
    public class ScopeGGService(HttpClient httpClient, IMatchRepository matchRepository) : IScopeGGService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly IMatchRepository _matchRepository = matchRepository;

        public async Task<List<ScopeGGResponseDto>> GetScopeGGDataAsync(string scopeSessionId)
        {
            try
            {
                var matches = await _matchRepository.GetAllAsync();
                var offset = matches.Count();
                var limit = 15;

                var sessionId = scopeSessionId;

                var requestDto = new ScopeGGRequestDto
                {
                    Offset = offset,
                    Limit = limit,
                    Filter = new FilterDto(),
                    Sort = new SortDto()
                };

                var request = new HttpRequestMessage(HttpMethod.Post, "https://app.scope.gg/api/matches/getMyMatches")
                {
                    Content = JsonContent.Create(requestDto)
                };

                request.Headers.Add("Cookie", $"scope_session_id={sessionId}");

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                return await response.Content.ReadFromJsonAsync<List<ScopeGGResponseDto>>();
            }

            catch (HttpRequestException ex)
            {
                Console.WriteLine($"ScopeGG unreachable: {ex.Message}");
                return new List<ScopeGGResponseDto>();
            }
        }
    }
}
