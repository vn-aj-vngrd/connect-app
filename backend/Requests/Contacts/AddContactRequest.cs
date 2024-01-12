using System.ComponentModel.DataAnnotations;
using ConnectApi.Entities;

namespace ConnectApi.Requests;

public class AddContactRequest
{
    public byte[]? Image { get; set; }

    [Required(ErrorMessage = "FirstName is required")]
    public string FirstName { get; set; } = string.Empty;

    public string? LastName { get; set; }

    public string? PhoneNumber { get; set; }

    public string? PhoneCountry { get; set; }

    public string? Email { get; set; }

    public DeliveryAddress? DeliveryAddress { get; set; }

    public BillingAddress? BillingAddress { get; set; }

    public string? Website { get; set; }

    public string? Notes { get; set; }

    public long[] TagIds { get; set; } = [];

    public bool IsFavorite { get; set; } = false;
}
