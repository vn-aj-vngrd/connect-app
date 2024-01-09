namespace ConnectApi.Entities;

public class Contact
{
    public long Id { get; set; }

    public byte[]? Image { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string? LastName { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }

    // [JsonIgnore]
    public DeliveryAddress? DeliveryAddress { get; set; }

    // [JsonIgnore]
    public BillingAddress? BillingAddress { get; set; }

    public string? Website { get; set; }

    public string? Notes { get; set; }

    public bool IsFavorite { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public string? AppUserId { get; set; }

    public AppUser AppUser { get; set; } = null!;

    public List<Tag> Tags { get; } = new();
}
