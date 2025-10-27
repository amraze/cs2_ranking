using CS2Ranking.Application.Dtos.ExternalDtos;
using CS2Ranking.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CS2Ranking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MatchesController(IMatchService matchService) : ControllerBase
    {
        private readonly IMatchService _matchService = matchService;

        [HttpPost("import")]
        public async Task<IActionResult> ImportMatches([FromBody] GoogleSheetRequestDto request)
        {
            try
            {
                await _matchService.ImportFromSheetAsync(request.SheetLink);
                return Ok(); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error importing matches: {ex.Message}");
            }
        }

        public async Task<IActionResult> GetMatches([FromQuery] int? limit, int? offset)
        {
            try
            {
                var matches = await _matchService.GetGroupedMatchesAsync(limit, offset);
                return Ok(matches);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error getting matches: {ex.Message}");
            }
        }

    }
}
