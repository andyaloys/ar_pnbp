using ArManagement.Api.DTOs.Auth;

namespace ArManagement.Api.DTOs.Users;

public class CreateUserDto
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Nip { get; set; }
    public string? Telepon { get; set; }
    public int RoleId { get; set; }
    public int? SatkerId { get; set; }
}

public class UpdateUserDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Nip { get; set; }
    public string? Telepon { get; set; }
    public int RoleId { get; set; }
    public int? SatkerId { get; set; }
    public bool IsActive { get; set; }
    public string? NewPassword { get; set; }
}

public class RoleDto
{
    public int Id { get; set; }
    public string RoleCode { get; set; } = string.Empty;
    public string RoleName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int UserCount { get; set; }
}
