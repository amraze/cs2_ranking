using CS2Ranking.Authentication.Dtos;
using CS2Ranking.Authentication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        var response = await _authService.RegisterAsync(dto);
        if (!response.Success) return BadRequest(response.Message);

        return Ok(new { response.Message, response.Token });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var response = await _authService.LoginAsync(dto);
        if (!response.Success) return Unauthorized(response.Message);

        return Ok(new { response.Message, response.Token });
    }

    [HttpPost("refresh")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto dto)
    {
        var response = await _authService.RefreshToken(dto.RefreshToken);
        if (!response.Success) return Unauthorized(response.Message);

        return Ok(new { response.Message, response.Token });
    }

    [Authorize]
    [HttpPost("revoke")]
    public async Task<IActionResult> RevokeToken()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (userId == null) return Unauthorized();

        var success = await _authService.RevokeTokenAsync(userId);
        if (!success) return BadRequest(new { message = "Failed to revoke token" });

        return Ok(new { message = "Token revoked successfully" });
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var firstName = User.FindFirst(ClaimTypes.GivenName)?.Value;
        var lastName = User.FindFirst(ClaimTypes.Surname)?.Value;

        return Ok(new
        {
            userId,
            email,
            firstName,
            lastName
        });
    }
}