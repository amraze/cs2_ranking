using System.ComponentModel.DataAnnotations;
namespace CS2Ranking.Authentication.Dtos;

public class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;

    public string? ScopeSessionId { get; set; }
}
