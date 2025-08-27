using CS2Ranking.Application.Dtos;
using CS2Ranking.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace CS2Ranking.Application.Controllers
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
    }
}
