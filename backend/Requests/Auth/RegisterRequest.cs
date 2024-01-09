using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class RegisterRequest
{
    [Required(ErrorMessage = "First name is required")]
    public string FirstName { get; set; } = null!;

    [Required(ErrorMessage = "Last name is required")]
    public string LastName { get; set; } = null!;

    [Required(ErrorMessage = "Username is required")]
    [RegularExpression(
        @"^[a-zA-Z0-9_]*$",
        ErrorMessage = "Invalid username format. Use only letters, numbers, and underscores."
    )]
    public string UserName { get; set; } = null!;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is not a valid email address")]
    public string Email { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    [StringLength(
        100,
        ErrorMessage = "The {0} must be at least {2} characters long.",
        MinimumLength = 6
    )]
    public string Password { get; set; } = null!;
}
