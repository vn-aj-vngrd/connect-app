using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email is not a valid email address")]
    public string Email { get; set; } = null!;
}
