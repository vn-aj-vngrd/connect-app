using System.Text.Json.Serialization;

namespace ConnectApi.Entities;

public class BillingAddress
{
    public long Id { get; set; }

    public string? Country { get; set; } = string.Empty;

    public string? Street { get; set; }

    public string? City { get; set; }

    public string? PostalCode { get; set; }

    public string? Province { get; set; }

    public long? ContactId { get; set; }

    public Contact? Contact { get; set; } = default!;
}
