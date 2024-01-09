using System.Text.Json.Serialization;

namespace ConnectApi.Entities;

public class Tag
{
    public long Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public string? AppUserId { get; set; }

    public AppUser AppUser { get; set; } = null!;

    [JsonIgnore]
    public List<Contact> Contacts { get; } = new();
}
