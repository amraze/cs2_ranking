using CS2Ranking.Authentication.Models;
using CS2Ranking.Authentication.Settings;
using CS2Ranking.Authentication.Dtos;
using Microsoft.AspNetCore.Identity;

namespace CS2Ranking.Authentication.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<AuthResponseDto> RefreshToken(string refreshToken);
    Task<bool> RevokeTokenAsync(string userId);
}

public class AuthService : IAuthService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly JwtSettings _jwtSettings;

    public AuthService(
        UserManager<AppUser> userManager,
        ITokenService tokenService,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _jwtSettings = configuration.GetSection("JwtSettings").Get<JwtSettings>()!;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _userManager.FindByEmailAsync(dto.Email);
        if (existingUser != null) return new AuthResponseDto { Success = false, Message = "User already exists", Token = null };

        var user = new AppUser
        {
            Email = dto.Email,
            UserName = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return new AuthResponseDto { Success = false, Message = string.Join(", ", result.Errors.Select(e => e.Description)), Token = null };

        var token = await _tokenService.GenerateTokensAsync(user);
        await _userManager.UpdateAsync(user);

        return new AuthResponseDto { Success = true, Message = "Registration successful", Token = token };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null) return new AuthResponseDto { Success = false, Message = "Invalid email or password", Token = null };

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!isPasswordValid) return new AuthResponseDto { Success = false, Message = "Invalid email or password", Token = null };

        if (!string.IsNullOrEmpty(dto.ScopeSessionId))
            user.ScopeSessionId = dto.ScopeSessionId;

        var token = await _tokenService.GenerateTokensAsync(user);
        await _userManager.UpdateAsync(user);

        return new AuthResponseDto { Success = true, Message = "Login successful", Token = token };
    }

    public async Task<AuthResponseDto> RefreshToken(string refreshToken)
    {
        var user = _userManager.Users.FirstOrDefault(u => u.RefreshToken == refreshToken);

        if (user == null || user.RefreshTokenExpiry <= DateTime.UtcNow) return new AuthResponseDto { Success = false, Message = "Expired refresh token", Token = null };
        var token = await _tokenService.GenerateTokensAsync(user);
        await _userManager.UpdateAsync(user);

        return new AuthResponseDto { Success = true, Message = "Token refreshed", Token = token };
    }

    public async Task<bool> RevokeTokenAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return false;

        user.RefreshToken = null;
        user.RefreshTokenExpiry = null;
        await _userManager.UpdateAsync(user);

        return true;
    }
}