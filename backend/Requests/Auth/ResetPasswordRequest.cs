using System.ComponentModel.DataAnnotations;

namespace ConnectApi.Requests;

public class ResetPasswordRequest
{
    [Required(ErrorMessage = "UserId is required")]
    public string UserId { get; set; } = null!;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = null!;

    [Required(ErrorMessage = "Code is required")]
    public string Code { get; set; } = null!;
}
