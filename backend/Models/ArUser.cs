using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models;

[Table("ar_users")]
public class ArUser
{
    [Key]
    [Column("id")]
    public long Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("username")]
    public string Username { get; set; } = string.Empty;

    [Required]
    [MaxLength(255)]
    [Column("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [Column("full_name")]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [MaxLength(150)]
    [Column("email")]
    public string Email { get; set; } = string.Empty;

    [MaxLength(30)]
    [Column("nip")]
    public string? Nip { get; set; }

    [MaxLength(30)]
    [Column("telepon")]
    public string? Telepon { get; set; }

    [Column("role_id")]
    public int RoleId { get; set; }

    [Column("satker_id")]
    public int? SatkerId { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("last_login_at")]
    public DateTime? LastLoginAt { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [Column("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    [ForeignKey(nameof(RoleId))]
    public virtual ArRole? Role { get; set; }

    [ForeignKey(nameof(SatkerId))]
    public virtual ArSatker? Satker { get; set; }
}
