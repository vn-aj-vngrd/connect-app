using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class UpdateUserRequest
{
    public byte[]? Image { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    [RegularExpression(
        @"^[a-zA-Z0-9_]*$",
        ErrorMessage = "Invalid username format. Use only letters, numbers, and underscores."
    )]
    public string? UserName { get; set; }

    public bool RemoveImage { get; set; } = false;
}
