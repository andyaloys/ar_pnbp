using ArManagement.Api.DTOs.Auth;

namespace ArManagement.Api.Services.Auth;

public interface IAuthService
{
    Task<LoginResponseDto?> LoginAsync(LoginRequestDto request);
    Task<UserDto?> GetUserByIdAsync(long userId);
    string HashPassword(string password);
    bool VerifyPassword(string inputPassword, string storedHash);
}
