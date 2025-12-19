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

        [HttpGet("import/scope")]
        public async Task<IActionResult> ImportScopeMatches()
        {
            try
            {
                var hasInserted = await _matchService.ImportFromScopeAsync();
                if (!hasInserted)
                    return NoContent(); 

                return Ok(new { message = "Matches imported successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error importing matches: {ex.Message}");
            }
        }

        [HttpPost("import/sheets")]
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

        [HttpGet("evolution")]
        public async Task<IActionResult> GetEvolution()
        {
            try
            {
                var evolution = await _matchService.GetEvolutionAsync();
                return Ok(evolution);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error getting evolution: {ex.Message}");
            }
        }

    }
}
