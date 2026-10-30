using Microsoft.AspNetCore.Mvc;
using ArManagement.Api.DTOs.Auth;
using ArManagement.Api.Services.Auth;

namespace ArManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest(new { success = false, message = "Username dan password wajib diisi." });
        }

        var result = await _authService.LoginAsync(request);
        if (result == null)
        {
            return Unauthorized(new { success = false, message = "Username atau password salah, atau akun Anda non-aktif." });
        }

        return Ok(new { success = true, data = result });
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser([FromHeader(Name = "Authorization")] string? authHeader)
    {
        if (string.IsNullOrWhiteSpace(authHeader))
        {
            return Unauthorized(new { success = false, message = "Header Authorization tidak ditemukan." });
        }

        try
        {
            var token = authHeader.Replace("Bearer ", "").Trim();
            var payload = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(token));
            var parts = payload.Split(':');
            if (parts.Length >= 4 && long.TryParse(parts[0], out var userId))
            {
                var user = await _authService.GetUserByIdAsync(userId);
                if (user != null && user.IsActive)
                {
                    return Ok(new { success = true, data = user });
                }
            }
        }
        catch
        {
            // Invalid token structure
        }

        return Unauthorized(new { success = false, message = "Sesi telah berakhir atau tidak valid." });
    }
}
