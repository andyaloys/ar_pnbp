using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
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
    [AllowAnonymous]
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
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value
                          ?? User.FindFirst("sub")?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(new { success = false, message = "Klaim identitas pengguna tidak valid pada token JWT." });
        }

        var user = await _authService.GetUserByIdAsync(userId);
        if (user == null || !user.IsActive)
        {
            return Unauthorized(new { success = false, message = "Pengguna tidak ditemukan atau telah dinonaktifkan." });
        }

        return Ok(new { success = true, data = user });
    }
}
