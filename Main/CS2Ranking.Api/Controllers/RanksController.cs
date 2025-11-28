using CS2Ranking.Application.Dtos;
using CS2Ranking.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CS2Ranking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RanksController(IRankService rankService) : ControllerBase
    {
        private readonly IRankService _rankService = rankService;

        public async Task<IActionResult> GetRanks()
        {
            try
            {
                var ranks = await _rankService.GetAllRanksAsync();
                return Ok(ranks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error getting mapes: {ex.Message}");
            }
        }

    }
}
