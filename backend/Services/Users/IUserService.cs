using ArManagement.Api.DTOs.Auth;
using ArManagement.Api.DTOs.Users;

namespace ArManagement.Api.Services.Users;

public interface IUserService
{
    Task<List<UserDto>> GetAllUsersAsync(string? roleCode = null, int? satkerId = null, string? search = null);
    Task<UserDto?> GetUserByIdAsync(long id);
    Task<UserDto> CreateUserAsync(CreateUserDto dto);
    Task<UserDto?> UpdateUserAsync(long id, UpdateUserDto dto);
    Task<bool> ToggleUserStatusAsync(long id);
    Task<List<RoleDto>> GetAllRolesAsync();
}
