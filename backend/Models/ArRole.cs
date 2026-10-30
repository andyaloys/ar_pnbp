using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ArManagement.Api.Models;

[Table("ar_roles")]
public class ArRole
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    [Column("role_code")]
    public string RoleCode { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [Column("role_name")]
    public string RoleName { get; set; } = string.Empty;

    [MaxLength(255)]
    [Column("description")]
    public string? Description { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public virtual ICollection<ArUser> Users { get; set; } = new List<ArUser>();
}
