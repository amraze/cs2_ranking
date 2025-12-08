namespace CS2Ranking.Authentication.Dtos;
public class AuthResponseDto
{
    public bool Success { get; set; }
    public required string Message { get; set; }
    public TokenDto? Token { get; set; }
}
