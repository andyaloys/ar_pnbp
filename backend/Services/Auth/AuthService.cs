using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using ArManagement.Api.Data;
using ArManagement.Api.DTOs.Auth;
using ArManagement.Api.Models;

namespace ArManagement.Api.Services.Auth;

public class AuthService : IAuthService
{
    private readonly ArDbContext _context;
    private readonly ILogger<AuthService> _logger;

    public AuthService(ArDbContext context, ILogger<AuthService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToHexString(bytes).ToLowerInvariant();
    }

    public bool VerifyPassword(string inputPassword, string storedHash)
    {
        var inputHash = HashPassword(inputPassword);
        return string.Equals(inputHash, storedHash, StringComparison.OrdinalIgnoreCase);
    }

    public async Task<LoginResponseDto?> LoginAsync(LoginRequestDto request)
    {
        if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            return null;

        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Satker)
            .FirstOrDefaultAsync(u => u.Username == request.Username && u.IsActive);

        if (user == null)
        {
            _logger.LogWarning("Percobaan login gagal: Username '{Username}' tidak ditemukan atau non-aktif", request.Username);
            return null;
        }

        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Percobaan login gagal: Password salah untuk user '{Username}'", request.Username);
            return null;
        }

        // Update last login
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var expiresAt = DateTime.UtcNow.AddHours(12);
        var token = GenerateSessionToken(user, expiresAt);

        var userDto = new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Email = user.Email,
            Nip = user.Nip,
            Telepon = user.Telepon,
            RoleId = user.RoleId,
            RoleCode = user.Role?.RoleCode ?? "USER",
            RoleName = user.Role?.RoleName ?? "Pengguna",
            SatkerId = user.SatkerId,
            KodeSatker = user.Satker?.KodeSatker,
            NamaSatker = user.Satker?.NamaSatker,
            IsActive = user.IsActive,
            LastLoginAt = user.LastLoginAt
        };

        return new LoginResponseDto
        {
            Token = token,
            ExpiresAt = expiresAt,
            User = userDto
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(long userId)
    {
        var user = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Satker)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null) return null;

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Email = user.Email,
            Nip = user.Nip,
            Telepon = user.Telepon,
            RoleId = user.RoleId,
            RoleCode = user.Role?.RoleCode ?? "USER",
            RoleName = user.Role?.RoleName ?? "Pengguna",
            SatkerId = user.SatkerId,
            KodeSatker = user.Satker?.KodeSatker,
            NamaSatker = user.Satker?.NamaSatker,
            IsActive = user.IsActive,
            LastLoginAt = user.LastLoginAt
        };
    }

    private static string GenerateSessionToken(ArUser user, DateTime expiresAt)
    {
        var payload = $"{user.Id}:{user.Username}:{user.RoleId}:{expiresAt.Ticks}";
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(payload));
    }
}
