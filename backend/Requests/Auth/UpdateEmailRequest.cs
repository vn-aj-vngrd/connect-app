using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class UpdateEmailRequest
{
    [Required(ErrorMessage = "NewEmail is required")]
    [EmailAddress(ErrorMessage = "NewEmail is not a valid email address")]
    public string NewEmail { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = null!;
}
