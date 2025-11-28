using CS2Ranking.Application.Dtos;
using CS2Ranking.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CS2Ranking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeasonsController(ISeasonService seasonService) : ControllerBase
    {
        private readonly ISeasonService _seasonService = seasonService;

        public async Task<IActionResult> GetSeasons()
        {
            try
            {
                var seasons = await _seasonService.GetAllSeasonsAsync();
                return Ok(seasons);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error getting seasons: {ex.Message}");
            }
        }

    }
}
