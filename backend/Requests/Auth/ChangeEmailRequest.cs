using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class ChangeEmailRequest
{
    [Required(ErrorMessage = "UserId is required")]
    public string UserId { get; set; } = null!;

    [Required(ErrorMessage = "NewEmail is required")]
    [EmailAddress(ErrorMessage = "NewEmail is not a valid email address")]
    public string NewEmail { get; set; } = null!;

    [Required(ErrorMessage = "Code is required")]
    public string Code { get; set; } = null!;
}
