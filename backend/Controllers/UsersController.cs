using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ArManagement.Api.DTOs.Users;
using ArManagement.Api.Services.Users;

namespace ArManagement.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllUsers([FromQuery] string? role, [FromQuery] int? satkerId, [FromQuery] string? search)
    {
        var users = await _userService.GetAllUsersAsync(role, satkerId, search);
        return Ok(new { success = true, total = users.Count, data = users });
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetUserById(long id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(new { success = false, message = "Pengguna tidak ditemukan." });

        return Ok(new { success = true, data = user });
    }

    [HttpGet("roles")]
    public async Task<IActionResult> GetAllRoles()
    {
        var roles = await _userService.GetAllRolesAsync();
        return Ok(new { success = true, data = roles });
    }

    [HttpPost]
    public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
    {
        try
        {
            var user = await _userService.CreateUserAsync(dto);
            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, new { success = true, data = user, message = "Pengguna berhasil ditambahkan." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gagal membuat pengguna baru");
            return StatusCode(500, new { success = false, message = "Terjadi kesalahan internal server." });
        }
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> UpdateUser(long id, [FromBody] UpdateUserDto dto)
    {
        try
        {
            var user = await _userService.UpdateUserAsync(id, dto);
            if (user == null)
                return NotFound(new { success = false, message = "Pengguna tidak ditemukan." });

            return Ok(new { success = true, data = user, message = "Data pengguna berhasil diperbarui." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gagal memperbarui pengguna dengan ID {Id}", id);
            return StatusCode(500, new { success = false, message = "Terjadi kesalahan internal server." });
        }
    }

    [HttpPatch("{id:long}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(long id)
    {
        var result = await _userService.ToggleUserStatusAsync(id);
        if (!result)
            return NotFound(new { success = false, message = "Pengguna tidak ditemukan." });

        return Ok(new { success = true, message = "Status aktif pengguna berhasil diubah." });
    }
}
