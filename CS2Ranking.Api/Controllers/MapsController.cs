using CS2Ranking.Application.Dtos;
using CS2Ranking.Application.Interfaces.IServices;
using Microsoft.AspNetCore.Mvc;

namespace CS2Ranking.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MapsController(IMapService mapService) : ControllerBase
    {
        private readonly IMapService _mapService = mapService;

        public async Task<IActionResult> GetMaps()
        {
            try
            {
                var maps = await _mapService.GetAllMapsAsync();
                return Ok(maps);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error getting mapes: {ex.Message}");
            }
        }

    }
}
