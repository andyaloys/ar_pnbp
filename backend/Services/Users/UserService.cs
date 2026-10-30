using Microsoft.EntityFrameworkCore;
using ArManagement.Api.Data;
using ArManagement.Api.DTOs.Auth;
using ArManagement.Api.DTOs.Users;
using ArManagement.Api.Models;
using ArManagement.Api.Services.Auth;

namespace ArManagement.Api.Services.Users;

public class UserService : IUserService
{
    private readonly ArDbContext _context;
    private readonly IAuthService _authService;
    private readonly ILogger<UserService> _logger;

    public UserService(ArDbContext context, IAuthService authService, ILogger<UserService> logger)
    {
        _context = context;
        _authService = authService;
        _logger = logger;
    }

    public async Task<List<UserDto>> GetAllUsersAsync(string? roleCode = null, int? satkerId = null, string? search = null)
    {
        var query = _context.Users
            .Include(u => u.Role)
            .Include(u => u.Satker)
            .AsNoTracking();

        if (!string.IsNullOrWhiteSpace(roleCode))
        {
            query = query.Where(u => u.Role != null && u.Role.RoleCode == roleCode);
        }

        if (satkerId.HasValue && satkerId.Value > 0)
        {
            query = query.Where(u => u.SatkerId == satkerId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim().ToLower();
            query = query.Where(u => u.FullName.ToLower().Contains(s) ||
                                     u.Username.ToLower().Contains(s) ||
                                     u.Email.ToLower().Contains(s) ||
                                     (u.Nip != null && u.Nip.ToLower().Contains(s)));
        }

        var users = await query.OrderBy(u => u.FullName).ToListAsync();

        return users.Select(u => new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            FullName = u.FullName,
            Email = u.Email,
            Nip = u.Nip,
            Telepon = u.Telepon,
            RoleId = u.RoleId,
            RoleCode = u.Role?.RoleCode ?? "USER",
            RoleName = u.Role?.RoleName ?? "Pengguna",
            SatkerId = u.SatkerId,
            KodeSatker = u.Satker?.KodeSatker,
            NamaSatker = u.Satker?.NamaSatker,
            IsActive = u.IsActive,
            LastLoginAt = u.LastLoginAt
        }).ToList();
    }

    public async Task<UserDto?> GetUserByIdAsync(long id)
    {
        var u = await _context.Users
            .Include(u => u.Role)
            .Include(u => u.Satker)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (u == null) return null;

        return new UserDto
        {
            Id = u.Id,
            Username = u.Username,
            FullName = u.FullName,
            Email = u.Email,
            Nip = u.Nip,
            Telepon = u.Telepon,
            RoleId = u.RoleId,
            RoleCode = u.Role?.RoleCode ?? "USER",
            RoleName = u.Role?.RoleName ?? "Pengguna",
            SatkerId = u.SatkerId,
            KodeSatker = u.Satker?.KodeSatker,
            NamaSatker = u.Satker?.NamaSatker,
            IsActive = u.IsActive,
            LastLoginAt = u.LastLoginAt
        };
    }

    public async Task<UserDto> CreateUserAsync(CreateUserDto dto)
    {
        var existingUsername = await _context.Users.AnyAsync(u => u.Username == dto.Username);
        if (existingUsername)
            throw new InvalidOperationException($"Username '{dto.Username}' sudah digunakan.");

        var existingEmail = await _context.Users.AnyAsync(u => u.Email == dto.Email);
        if (existingEmail)
            throw new InvalidOperationException($"Email '{dto.Email}' sudah digunakan.");

        var user = new ArUser
        {
            Username = dto.Username.Trim().ToLowerInvariant(),
            PasswordHash = _authService.HashPassword(dto.Password),
            FullName = dto.FullName.Trim(),
            Email = dto.Email.Trim().ToLowerInvariant(),
            Nip = dto.Nip?.Trim(),
            Telepon = dto.Telepon?.Trim(),
            RoleId = dto.RoleId,
            SatkerId = dto.SatkerId,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return (await GetUserByIdAsync(user.Id))!;
    }

    public async Task<UserDto?> UpdateUserAsync(long id, UpdateUserDto dto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return null;

        var existingEmail = await _context.Users.AnyAsync(u => u.Email == dto.Email && u.Id != id);
        if (existingEmail)
            throw new InvalidOperationException($"Email '{dto.Email}' sudah digunakan pengguna lain.");

        user.FullName = dto.FullName.Trim();
        user.Email = dto.Email.Trim().ToLowerInvariant();
        user.Nip = dto.Nip?.Trim();
        user.Telepon = dto.Telepon?.Trim();
        user.RoleId = dto.RoleId;
        user.SatkerId = dto.SatkerId;
        user.IsActive = dto.IsActive;
        user.UpdatedAt = DateTime.UtcNow;

        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            user.PasswordHash = _authService.HashPassword(dto.NewPassword);
        }

        await _context.SaveChangesAsync();
        return await GetUserByIdAsync(id);
    }

    public async Task<bool> ToggleUserStatusAsync(long id)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        if (user == null) return false;

        user.IsActive = !user.IsActive;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<RoleDto>> GetAllRolesAsync()
    {
        var roles = await _context.Roles
            .Include(r => r.Users)
            .OrderBy(r => r.Id)
            .ToListAsync();

        return roles.Select(r => new RoleDto
        {
            Id = r.Id,
            RoleCode = r.RoleCode,
            RoleName = r.RoleName,
            Description = r.Description,
            UserCount = r.Users.Count
        }).ToList();
    }
}
