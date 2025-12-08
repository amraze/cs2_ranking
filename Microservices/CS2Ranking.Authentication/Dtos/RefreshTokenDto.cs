using System.ComponentModel.DataAnnotations;

namespace CS2Ranking.Authentication.Dtos;
public class RefreshTokenDto
{
    [Required]
    public string RefreshToken { get; set; } = string.Empty;
}