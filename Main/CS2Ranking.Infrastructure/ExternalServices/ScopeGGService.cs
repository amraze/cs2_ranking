using CS2Ranking.Application.Dtos.ExternalDtos;
using CS2Ranking.Application.Interfaces.IRepositories;
using CS2Ranking.Infrastructure.ExternalModels;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Net.Http.Json;

namespace CS2Ranking.Infrastructure.ExternalServices
{
    public class ScopeGGService(HttpClient httpClient, IMatchRepository matchRepository, IHttpContextAccessor httpContextAccessor) : IScopeGGService
    {
        private readonly HttpClient _httpClient = httpClient;
        private readonly IMatchRepository _matchRepository = matchRepository;
        private readonly IHttpContextAccessor _httpContextAccessor = httpContextAccessor;

        public async Task<List<ScopeGGResponseDto>> GetScopeGGDataAsync()
        {
            try
            {
                var sessionId = _httpContextAccessor.HttpContext?.User.FindFirst("scope_session_id")?.Value;
                if (string.IsNullOrEmpty(sessionId))
                    return new List<ScopeGGResponseDto>();

                var matches = await _matchRepository.GetAllAsync();
                var offset = matches.Count();
                var limit = 15;

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
