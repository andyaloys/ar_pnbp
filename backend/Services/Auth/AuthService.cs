using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using ArManagement.Api.Data;
using ArManagement.Api.DTOs.Auth;
using ArManagement.Api.Models;

namespace ArManagement.Api.Services.Auth;

public class AuthService : IAuthService
{
    private readonly ArDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<AuthService> _logger;

    public AuthService(ArDbContext context, IConfiguration configuration, ILogger<AuthService> logger)
    {
        _context = context;
        _configuration = configuration;
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
            _logger.LogWarning("Percobaan login ditolak: Username '{Username}' tidak ditemukan atau non-aktif", request.Username);
            return null;
        }

        if (!VerifyPassword(request.Password, user.PasswordHash))
        {
            _logger.LogWarning("Percobaan login ditolak: Password salah untuk user '{Username}'", request.Username);
            return null;
        }

        // Update waktu login terakhir
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        var expiryHours = _configuration.GetValue<int>("Jwt:ExpiryHours", 12);
        var expiresAt = DateTime.UtcNow.AddHours(expiryHours);
        var token = GenerateJwtToken(user, expiresAt);

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

    private string GenerateJwtToken(ArUser user, DateTime expiresAt)
    {
        var secretKey = _configuration["Jwt:Key"] ?? "AR_MANAGEMENT_PNBP_SECRET_KEY_KLH_BPLH_2026_VERY_SECURE";
        var issuer = _configuration["Jwt:Issuer"] ?? "ArManagementPnbpApi";
        var audience = _configuration["Jwt:Audience"] ?? "ArManagementPnbpApp";

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Name, user.Username),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Role, user.Role?.RoleCode ?? "USER"),
            new("roleName", user.Role?.RoleName ?? "Pengguna"),
            new("fullName", user.FullName)
        };

        if (user.SatkerId.HasValue)
        {
            claims.Add(new Claim("satkerId", user.SatkerId.Value.ToString()));
            if (!string.IsNullOrEmpty(user.Satker?.KodeSatker))
            {
                claims.Add(new Claim("kodeSatker", user.Satker.KodeSatker));
            }
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expiresAt,
            Issuer = issuer,
            Audience = audience,
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}
